import * as React from "react"
import { connect } from "react-redux"

import FlexedDiv from "../common/flexedDiv"
import Input from "../common/input"
import Icon from "../common/icon"

import magnifyingGlass from "../../lib/images/icon-magnifying-glass.png"
import { colors } from "../../lib/colors"

import { fetchTextsAction, setEntity, fetchImagesAction } from "../../actions"

interface State {
  timeout?: any
}

interface Props {
  dispatch: any
  collection: string
  searchQuery?: string
}

class Search extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {}
  }

  private requiresNetworkingFor() {
    return {
      library: "texts",
      images: "images"
    }[window.location.pathname.split("/")[1]]
  }

  private handleInputChange(value: string) {
    let timeout

    if (this.requiresNetworkingFor()) {
      this.props.dispatch(setEntity({ isLoading: true }))
      clearTimeout(this.state.timeout)
      timeout = setTimeout(this.search.bind(this), 1000)
    }

    this.props.dispatch(setEntity({ searchQuery: value }))
    this.setState({ timeout })
  }

  private search() {
    const networkingOperation = this.requiresNetworkingFor()

    if (networkingOperation === "texts") {
      const index = this.props.collection.replace(/ /g, "_")
      this.props.dispatch(fetchTextsAction(index, this.props.searchQuery))
    }

    if (networkingOperation === "images") {
      this.props.dispatch(fetchImagesAction(this.props.searchQuery))
    }
  }

  public render() {
    return (
      <FlexedDiv
        style={{
          borderBottom: `1px solid ${colors.gray}`,
          width: "200px",
          justifyContent: "flex-start"
        }}
      >
        <Icon small={true} src={magnifyingGlass} />
        <Input.m
          onChange={e => this.handleInputChange(e.target.value)}
          value={this.props.searchQuery || ""}
          type="text"
          placeholder="Search..."
        />
      </FlexedDiv>
    )
  }
}

const mapStateToProps = (state: any, ownProps: any) => ({
  collection: state.entities.collection,
  searchQuery: state.entities.searchQuery
})

export default connect(mapStateToProps)(Search)
