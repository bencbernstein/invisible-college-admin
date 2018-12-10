import * as React from "react"
import { connect } from "react-redux"

import Spinner from "../common/spinner"
import Text from "../common/text"
import Grid from "../common/grid"

import { fetchImagesAction, setEntity } from "../../actions"

import { alphabetize } from "../../lib/helpers"

interface State {
  index?: string
}

interface Props {
  images: any[]
  index?: string
  dispatch: any
  isLoading: boolean
  searchQuery?: string
}

class ImageListComponent extends React.Component<Props, State> {
  constructor(props: any) {
    super(props)
    this.state = {}
  }

  public componentDidMount() {
    this.loadData()
  }

  public loadData() {
    this.props.dispatch(setEntity({ isLoading: true }))
    this.props.dispatch(fetchImagesAction(this.state.index!))
  }

  public render() {
    const { images, isLoading } = this.props

    const alphabetized = alphabetize(images, "firstWordValue")

    return (
      <div>
        {isLoading ? (
          <Spinner />
        ) : (
          <Grid alignItems="center" justifyItems="center" rowGap={40}>
            {alphabetized.map(({ divider, url, wordValues }, i) =>
              divider ? (
                <Text.xxl
                  style={{ gridColumn: "1 / -1", margin: "15px 0" }}
                  key={i}
                >
                  {divider}
                </Text.xxl>
              ) : (
                <div style={{ textAlign: "center" }} key={url}>
                  <img
                    style={{
                      maxHeight: "75px",
                      maxWidth: "75px",
                      height: "auto",
                      width: "auto"
                    }}
                    src={"https://s3.amazonaws.com/" + url}
                  />
                  <Text.s>{wordValues.join(", ")}</Text.s>
                </div>
              )
            )}
          </Grid>
        )}
      </div>
    )
  }
}

const mapStateToProps = (state: any, ownProps: any) => ({
  images: state.entities.images || [],
  isLoading: state.entities.isLoading === true,
  searchQuery: state.entities.searchQuery
})

export default connect(mapStateToProps)(ImageListComponent)
