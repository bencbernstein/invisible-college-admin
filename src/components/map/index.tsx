import * as React from "react"
import { connect } from "react-redux"

import { fetchPassagesAndAddressesAction } from "../../actions"

import { User } from "../../interfaces/user"
import backIcon from "../../lib/images/icon-back.png"
import { Redirect } from "react-router"
import { lastPath } from "src/lib/helpers"

import FlexedDiv from "../common/flexedDiv"
import Icon from "../common/icon"
import Header from "../common/header"

// @ts-ignore
import MapContainer from "./map"

interface State {
  redirect?: string
  geoCodedAddresses: any
}

interface Props {
  user: User
  dispatch: any
}

class MapComponent extends React.Component<Props, State> {
  constructor(props: any) {
    super(props)
    this.state = {
      geoCodedAddresses: []
    }
  }

  private geocode(address: any) {
    const key = "address"
    const toSearch = address[key]

    const googleAPIKEY = "AIzaSyD8n2_PZUwTYGhky7HwjPFf10HgU_karH4"
    const formattedAddress = toSearch.replace(/ /g, "+")

    const query =
      "https://maps.googleapis.com/maps/api/geocode/json?address=" +
      formattedAddress +
      "+New+York+City" +
      "&key=" +
      googleAPIKEY

    fetch(query)
      .then(res => res.json())
      .then(
        result => {
          const resultKey = "results"
          const geometry = "geometry"
          const location = "location"
          const geocode = "geocode"
          if (result[resultKey][0] != null) {
            address[geocode] = result[resultKey][0][geometry][location]
            const geoCodedAddresses = this.state.geoCodedAddresses
            geoCodedAddresses.push(address)
            this.setState({ geoCodedAddresses })
          }
        },
        error => {
          console.log("error fetching address")
        }
      )
  }

  public async componentDidMount() {
    const id = lastPath(window!)
    const result = await this.props.dispatch(
      fetchPassagesAndAddressesAction(id)
    )
    result.response.data.map((address: any) => this.geocode(address))

    // const testingAddress = {
    //   address: "20 East Forty Sixth Street",
    //   context:
    //     "When Rosalie had joined the Society for Ethical Culture, Bernhard had joined, too. When Bella joined the Society, so did Emanuel. Bella Moses' children grew up in snug luxury. The family lived at  20 East Forty Sixth Street , just off Fifth A venue, in the heartland of the German Jewish elite. The neighborhood was one of lavish private homes. The Seligman house was almost directly across the street from the Moseses', and two doors down lived the Lehmans; their youngest child, Herbert, was a student at Williams College. It was a neighborhood in which the children all knew one ↵↵↵↵<page>46</page>↵↵THE IDEALIST ↵↵34 ↵↵another; they visited one another's homes, so alike with the varnished oak and black walnut paneling, red damask and green repp, heavy legged, plump cushioned sofas, gold fringed lamps and Dresden figurines.",
    //   geocode: {
    //     lat: 40.7552901,
    //     lng: -73.9779346
    //   },
    //   page_number: 45,
    //   word_count: "16904/644878 (2.62%)"
    // }
    // this.setState({ geoCodedAddresses: [testingAddress] })
  }

  public render() {
    const { redirect } = this.state
    if (redirect) return <Redirect to={redirect} />

    return (
      <div style={{ margin: "0", textAlign: "center" }}>
        <FlexedDiv justifyContent="flex-start" flex={1}>
          <Icon
            onClick={() =>
              this.setState({
                redirect: "/library"
              })
            }
            pointer={true}
            src={backIcon}
          />
          <Header.largeThin style={{ margin: "0px auto" }} id="textTitle">
            Map View
          </Header.largeThin>
        </FlexedDiv>

        <MapContainer addresses={this.state.geoCodedAddresses} />
      </div>
    )
  }
}

const mapStateToProps = (state: any, ownProps: any) => ({
  user: state.entities.user
})

export default connect(mapStateToProps)(MapComponent)
