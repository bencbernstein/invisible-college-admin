import * as React from "react"
import { connect } from "react-redux"
import { Link } from "react-router-dom"

import Spinner from "../common/spinner"
import Text from "../common/text"

import { findIndexCountsAction } from "../../actions"
import { colors } from "../../lib/colors"
import blankLinkStyle from "../common/blankLinkStyle"

interface State {
  INDEXES: string[]
}

interface Props {
  indexCounts: number[]
  dispatch: any
  isLoading: boolean
}

const INDEXES = ["simple_english_wikipedia"]

class IndexesListComponent extends React.Component<Props, State> {
  constructor(props: any) {
    super(props)
    this.state = {
      INDEXES
    }
  }

  public componentDidMount() {
    this.loadData()
  }

  private loadData() {
    this.props.dispatch(findIndexCountsAction(INDEXES))
  }

  public render() {
    const { indexCounts } = this.props
    if (indexCounts.length === 0) return <Spinner />

    return (
      <div style={{ width: "600px", margin: "0 auto", marginTop: "30px" }}>
        <Link
          style={blankLinkStyle}
          to={`/library/${INDEXES[0].replace(/_/g, "-")}`}
        >
          <Text.regular style={{ textTransform: "capitalize" }}>
            {INDEXES[0].replace(/_/g, " ")}
          </Text.regular>
        </Link>
        <Text.regular color={colors.mediumLGray}>
          Count: {indexCounts[0]}
        </Text.regular>
      </div>
    )
  }
}

const mapStateToProps = (state: any, ownProps: any) => ({
  indexCounts: state.entities.indexCounts || []
})

export default connect(mapStateToProps)(IndexesListComponent)
