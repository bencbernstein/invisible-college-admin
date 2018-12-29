import * as React from "react"
import { connect } from "react-redux"
import { Link } from "react-router-dom"

import Spinner from "../common/spinner"
import Text from "../common/text"

import { findIndexCountsAction } from "../../actions"
import { colors } from "../../lib/colors"
import blankLinkStyle from "../common/blankLinkStyle"

interface State {
  collections: string[]
}

interface Props {
  indexCounts: number[]
  dispatch: any
  isLoading: boolean
}

import collections from "../../lib/collections"

class IndexesListComponent extends React.Component<Props, State> {
  constructor(props: any) {
    super(props)
    this.state = {
      collections
    }
  }

  public componentDidMount() {
    this.loadData()
  }

  private loadData() {
    this.props.dispatch(findIndexCountsAction(collections))
  }

  public render() {
    const { indexCounts } = this.props
    if (indexCounts.length === 0) return <Spinner />

    const collection = (name: string, i: number) => (
      <div key={name}>
        <Link style={blankLinkStyle} to={`/library/${name.replace(/_/g, "-")}`}>
          <Text.regular style={{ textTransform: "capitalize" }}>
            {name.replace(/_/g, " ")}
          </Text.regular>
        </Link>
        <Text.regular color={colors.mediumLGray}>
          Count: {indexCounts[i]}
        </Text.regular>
      </div>
    )

    return (
      <div style={{ width: "600px", margin: "0 auto", marginTop: "30px" }}>
        {collections.map(collection)}
      </div>
    )
  }
}

const mapStateToProps = (state: any, ownProps: any) => ({
  indexCounts: state.entities.indexCounts || []
})

export default connect(mapStateToProps)(IndexesListComponent)
