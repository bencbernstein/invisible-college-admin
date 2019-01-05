import * as React from "react"
import { connect } from "react-redux"
import { Link } from "react-router-dom"
import Dropzone from "react-dropzone"

import CONFIG from "../../lib/config"

import Grid from "../common/grid"
import Spinner from "../common/spinner"
import Button from "../common/button"
import StyledText from "../common/text"
import blankLinkStyle from "../common/blankLinkStyle"

import { ErrorMessage } from "../../interfaces/errorMessage"
import { fetchTextsAction, setEntity, removeEntity } from "../../actions"
import { alphabetize, lastPath } from "../../lib/helpers"
import { colors } from "../../lib/colors"
import { Job } from "../../interfaces/job"

interface State {
  index: string
}

interface Props {
  texts: any[]
  dispatch: any
  isLoading: boolean
  job?: Job
}

class TextListComponent extends React.Component<Props, State> {
  constructor(props: any) {
    super(props)

    this.state = {
      index: lastPath(window)
    }
  }

  public componentDidMount() {
    this.loadData()
  }

  public async onDrop(acceptedFiles: File[]) {
    const file = acceptedFiles[0]
    if (!file) return
    const extension = file.name.split(".").pop() || ""
    const acceptedExtensions = ["pdf", "txt", "epub"]
    if (acceptedExtensions.indexOf(extension) === -1) {
      const error: ErrorMessage = {
        type: "Upload Text Error",
        message: `Accepted file types: ${acceptedExtensions.join(", ")}`
      }
      return this.props.dispatch(setEntity({ error }))
    }
    const job: Job = {
      text: "Processing " + file.name,
      color: colors.gray
    }
    this.props.dispatch(setEntity({ job }))
    const formData = new FormData()
    formData.append("text", file)
    const url = `${CONFIG.MINE_API_URL}/index-texts?index=${this.state.index}`
    const params = { body: formData, method: "POST" }
    const data = await fetch(url, params)
      .then(res => res.json())
      .catch(error => error)
    console.log(data)

    if (data.id) {
      job.id = data.id
      this.props.dispatch(setEntity({ job }))
    } else {
      console.log("ERR: ", data)
      this.props.dispatch(removeEntity("job"))
    }
  }

  public async loadData() {
    this.props.dispatch(setEntity({ isLoading: true }))
    this.props.dispatch(fetchTextsAction(this.state.index))
  }

  public render() {
    const { isLoading, texts } = this.props
    const { index } = this.state

    const uploadButton = (
      <Dropzone
        style={{
          position: "fixed",
          bottom: "25px",
          right: "25px",
          border: "none"
        }}
        onDrop={this.onDrop.bind(this)}
        disabled={this.props.job !== undefined}
      >
        <Button.regular disabled={this.props.job !== undefined} margin="0">
          Upload
        </Button.regular>
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
            <Link style={blankLinkStyle} key={i} to={`/library/${index}/${id}`}>
              <StyledText.regular>{title}</StyledText.regular>
            </Link>
          )
        )}
      </Grid>
    )

    return (
      <div>
        {uploadButton}
        {isLoading ? <Spinner /> : textList}
      </div>
    )
  }
}

const mapStateToProps = (state: any, ownProps: any) => ({
  texts: state.entities.texts || [],
  isLoading: state.entities.isLoading === true,
  job: state.entities.job
})

export default connect(mapStateToProps)(TextListComponent)
