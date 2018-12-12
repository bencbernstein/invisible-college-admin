import * as React from "react"
import { Link } from "react-router-dom"
import { connect } from "react-redux"

import Spinner from "../common/spinner"
import Grid from "../common/grid"
import StyledText from "../common/text"
import blankLinkStyle from "../common/blankLinkStyle"

import { fetchWordsAction, setEntity } from "../../actions"

import { alphabetize } from "../../lib/helpers"

interface State {
  index?: string
}

interface Props {
  concepts: any[]
  index?: string
  dispatch: any
  isLoading: boolean
  searchQuery?: string
}

class ConceptListComponent extends React.Component<Props, State> {
  constructor(props: any) {
    super(props)
    this.state = {}
  }

  public componentDidMount() {
    this.loadData()
  }

  public loadData() {
    this.props.dispatch(setEntity({ isLoading: true }))
    this.props.dispatch(fetchWordsAction(this.state.index!))
  }

  public render() {
    const { concepts, isLoading, searchQuery } = this.props

    const filtered = concepts.filter(
      ({ value }) =>
        !searchQuery ||
        value.toLowerCase().indexOf(searchQuery.toLowerCase()) > -1
    )

    const alphabetized = alphabetize(filtered, "value")

    return (
      <div>
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
                <Link
                  style={blankLinkStyle}
                  key={i}
                  to={`/concept/enrich/${id}`}
                >
                  <StyledText.regular>{value}</StyledText.regular>
                </Link>
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
  searchQuery: state.entities.searchQuery
})

export default connect(mapStateToProps)(ConceptListComponent)
