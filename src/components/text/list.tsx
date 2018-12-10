import * as React from "react"
import { connect } from "react-redux"
import { Link } from "react-router-dom"
import Dropzone from "react-dropzone"

import Grid from "../common/grid"
import Spinner from "../common/spinner"
import Button from "../common/button"
import Header from "../common/header"
import StyledText from "../common/text"
import blankLinkStyle from "../common/blankLinkStyle"

import { parseTexts } from "../../models/text"
import { fetchTextsAction, setEntity } from "../../actions"
import { alphabetize } from "../../lib/helpers"

interface State {
  index?: string
}

interface Props {
  texts: any[]
  dispatch: any
  isLoading: boolean
  collection?: string
}

class TextListComponent extends React.Component<Props, State> {
  constructor(props: any) {
    super(props)
    this.state = {}
  }

  public componentDidMount() {
    if (this.props.collection) {
      this.loadData(this.props.collection)
    }
  }

  public componentWillReceiveProps(nextProps: Props) {
    const collection = nextProps.collection
    if (collection && collection !== this.props.collection) {
      this.loadData(collection)
    }
  }

  public async onDrop(acceptedFiles: File[]) {
    if (acceptedFiles.length) {
      await parseTexts(acceptedFiles)
      this.loadData(this.props.collection!)
    }
  }

  public async loadData(collection: string) {
    const index = collection.replace(/ /g, "_")
    this.props.dispatch(setEntity({ isLoading: true }))
    this.props.dispatch(fetchTextsAction(index))
    this.setState({ index })
  }

  public render() {
    const { collection, isLoading, texts } = this.props
    if (!collection) return null

    const header = (
      <Header.m style={{ textTransform: "capitalize" }}>{collection}</Header.m>
    )

    const uploadButton = (
      <Dropzone
        style={{
          position: "fixed",
          bottom: "50px",
          right: "50px",
          border: "none"
        }}
        onDrop={this.onDrop.bind(this)}
      >
        <Button.regular>Upload</Button.regular>
      </Dropzone>
    )

    const textList = (
      <Grid>
        {alphabetize(texts, "title").map(({ id, title, divider }, i) =>
          divider ? (
            <StyledText.xxl
              style={{ gridColumn: "1 / -1", margin: "15px 0" }}
              key={i}
            >
              {divider}
            </StyledText.xxl>
          ) : (
            <Link style={blankLinkStyle} key={i} to={`/library/text/${id}`}>
              <StyledText.regular>{title}</StyledText.regular>
            </Link>
          )
        )}
      </Grid>
    )

    return (
      <div>
        {header}
        {uploadButton}
        {isLoading ? <Spinner /> : textList}
      </div>
    )
  }
}

const mapStateToProps = (state: any, ownProps: any) => ({
  texts: state.entities.texts || [],
  isLoading: state.entities.isLoading === true,
  collection: state.entities.collection
})

export default connect(mapStateToProps)(TextListComponent)
