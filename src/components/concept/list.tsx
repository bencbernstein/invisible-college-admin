import * as React from "react"
import { Link } from "react-router-dom"
import { connect } from "react-redux"
import { get } from "lodash"
import Dropzone from "react-dropzone"

import Spinner from "../common/spinner"
import Grid from "../common/grid"
import Button from "../common/button"
import StyledText from "../common/text"
import blankLinkStyle from "../common/blankLinkStyle"

import {
  fetchWordsAction,
  setEntity,
  addToSequenceAction,
  uploadConceptsAction
} from "../../actions"
import { Curriculum } from "../../interfaces/curriculum"
import { Sequence } from "../../interfaces/sequence"

import { alphabetize } from "../../lib/helpers"
import { colors } from "../../lib/colors"

interface State {
  index?: string
}

interface Props {
  concepts: any[]
  curriculum?: Curriculum
  sequence?: Sequence
  index?: string
  dispatch: any
  isLoading: boolean
  isRob: boolean
  searchQuery?: string
}

class ConceptListComponent extends React.Component<Props, State> {
  constructor(props: any) {
    super(props)
    this.state = {}
  }

  public componentDidMount() {
    if (this.props.curriculum) {
      this.loadData(this.props.curriculum)
    }
  }

  public componentWillReceiveProps(nextProps: Props) {
    const { curriculum } = nextProps
    if (curriculum && curriculum.id !== get(this.props.curriculum, "id")) {
      this.loadData(curriculum)
    }
  }

  public loadData(curriculum: Curriculum) {
    this.props.dispatch(setEntity({ isLoading: true, words: [] }))
    this.props.dispatch(fetchWordsAction(curriculum))
  }

  public async onDrop(acceptedFiles: File[]) {
    const { dispatch, curriculum } = this.props
    const file = acceptedFiles[0]
    const fileReader = new FileReader()

    fileReader.onloadend = async (e: any) => {
      const words = fileReader.result
        .split("\n")
        .map((word: string) => word.trim())
      const sample = words.slice(0, 3).join(", ")
      const confirm = `Upload ${words.length} words? (incl. ${sample})`
      if (!window.confirm(confirm) || !curriculum) return
      await dispatch(uploadConceptsAction(curriculum.id, words))
      this.loadData(curriculum)
    }

    fileReader.readAsText(file)
  }

  public render() {
    const { concepts, isLoading, searchQuery, isRob, sequence } = this.props

    const filtered = concepts.filter(
      ({ value }) =>
        !searchQuery ||
        value.toLowerCase().indexOf(searchQuery.toLowerCase()) > -1
    )

    const alphabetized = alphabetize(filtered, "value")

    const link = (id: string, value: string) => {
      if (isRob) {
        return <StyledText.regular key={id}>{value}</StyledText.regular>
      }

      if (sequence) {
        return (
          <StyledText.regular
            onClick={() =>
              this.props.dispatch(
                addToSequenceAction(sequence.id, "word", id, value)
              )
            }
            pointer={true}
            key={id}
            hoverColor={colors.blue}
          >
            {value}
          </StyledText.regular>
        )
      }

      return (
        <Link style={blankLinkStyle} key={id} to={`/concept/enrich/${id}`}>
          <StyledText.regular>{value}</StyledText.regular>
        </Link>
      )
    }

    const uploadButton = (
      <Dropzone
        style={{
          position: "fixed",
          bottom: "25px",
          right: "25px",
          border: "none"
        }}
        onDrop={this.onDrop.bind(this)}
      >
        <Button.regular margin="0">Upload</Button.regular>
      </Dropzone>
    )

    return (
      <div style={{ marginTop: "30px" }}>
        {isLoading ? (
          <Spinner />
        ) : (
          <Grid>
            {alphabetized.map(({ id, value, divider }, i) =>
              divider ? (
                <StyledText.xxl
                  style={{ gridColumn: "1 / -1", margin: "15px 0" }}
                  key={i}
                >
                  {divider}
                </StyledText.xxl>
              ) : (
                link(id, value)
              )
            )}
          </Grid>
        )}
        {!isRob && uploadButton}
      </div>
    )
  }
}

const mapStateToProps = (state: any, ownProps: any) => ({
  concepts: state.entities.words || [],
  isLoading: state.entities.isLoading === true,
  isRob: state.entities.isRob === true,
  searchQuery: state.entities.searchQuery,
  curriculum: state.entities.curriculum,
  sequence: state.entities.sequence
})

export default connect(mapStateToProps)(ConceptListComponent)
