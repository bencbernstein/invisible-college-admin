import * as React from "react"
import { Link } from "react-router-dom"
import { connect } from "react-redux"

import Spinner from "../common/spinner"
import Grid from "../common/grid"
import StyledText from "../common/text"
import blankLinkStyle from "../common/blankLinkStyle"

import { fetchWordsAction, setEntity, addToSequenceAction } from "../../actions"
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
    if (nextProps.curriculum && !this.props.curriculum) {
      this.loadData(nextProps.curriculum)
    }
  }

  public loadData(curriculum: Curriculum) {
    this.props.dispatch(setEntity({ isLoading: true }))
    this.props.dispatch(fetchWordsAction(curriculum))
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
