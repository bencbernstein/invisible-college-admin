/* tslint:disable:variable-name */
import * as React from "react"
import { connect } from "react-redux"
import { chunk, sortBy } from "lodash"

import Text from "../common/text"
import HitHeader from "../hit/header"

import { PassageContainer, Image } from "./components"
import FlexedDiv from "../common/flexedDiv"
import { colors } from "../../lib/colors"

import arrowLeft from "../../lib/images/arrow-left.png"
import arrowRight from "../../lib/images/arrow-right.png"

interface Props {
  hits: any[]
}

enum SortBy {
  length_asc = "Length (asc)",
  length_desc = "Length (desc)",
  score = "Score"
}

interface State {
  selectedSortBy: SortBy
  maxResults: number
  currentPage: number
}

const sort = (hits: any[], comparator: SortBy): any[] => {
  const isAscending = comparator.includes("asc")
  let sorted: any[] = []
  if (comparator.includes("Length")) {
    sorted = sortBy(hits, h => h._source.content.join("").length)
  } else {
    sorted = sortBy(hits, "_score")
  }
  return isAscending ? sorted : sorted.reverse()
}

const MAX_PER_PAGE = 20

class PassagesList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      currentPage: 0,
      maxResults: MAX_PER_PAGE,
      selectedSortBy: SortBy.score
    }
  }

  public paginate(isLeft: boolean, isDisabled: boolean) {
    if (!isDisabled) {
      const currentPage = this.state.currentPage + (isLeft ? -1 : 1)
      this.setState({ currentPage })
      window.scroll(0, 0)
    }
  }

  public render() {
    const { hits } = this.props

    const { selectedSortBy, maxResults, currentPage } = this.state

    const listLength = hits.length
    if (listLength === 0) return null

    const option = (sortBy: SortBy) => (
      <option key={sortBy} value={sortBy}>
        {sortBy}
      </option>
    )

    const sortByComponent = (
      <select
        onChange={e =>
          this.setState({
            selectedSortBy: e.target.value as SortBy,
            currentPage: 0
          })
        }
        value={selectedSortBy}
      >
        {[SortBy.score, SortBy.length_asc, SortBy.length_desc].map(option)}
      </select>
    )

    const passageComponent = (hit: any, i: number) => (
      <PassageContainer key={i}>
        <div style={{ textAlign: "center", margin: " 10px 0" }}>
          <HitHeader passage={hit} />
          <Text.s>{Number(hit._score.toFixed(2))}</Text.s>
        </div>
        {hit.highlight.sentences.map((__html: string, i: number) => (
          <Text.garamond key={i} dangerouslySetInnerHTML={{ __html }} />
        ))}
      </PassageContainer>
    )

    const sorted = sort(hits, selectedSortBy)
    const chunked = chunk(sorted, maxResults)
    const toDisplay = chunked[currentPage]

    const disabledLeft = currentPage === 0
    const disabledRight = currentPage + 1 === chunked.length

    const navigation = (
      <FlexedDiv justifyContent={"space-between"}>
        <Image
          onClick={() => this.paginate(true, disabledLeft)}
          isDisabled={disabledLeft}
          src={arrowLeft}
        />
        <Image
          onClick={() => this.paginate(false, disabledRight)}
          isDisabled={disabledRight}
          src={arrowRight}
        />
      </FlexedDiv>
    )

    let informationText = `${listLength} passages`

    if (chunked.length > 1) {
      const startIdx = currentPage * maxResults + 1
      const endIdx = Math.min(startIdx + 49, hits.length)
      informationText += ` (showing ${startIdx} - ${endIdx})`
    }

    const information = (
      <FlexedDiv justifyContent={"space-between"}>
        <Text.l color={colors.gray}>{informationText}</Text.l>
        {sortByComponent}
      </FlexedDiv>
    )

    return (
      <div>
        <br />
        {information}
        {toDisplay.map(passageComponent)}
        {navigation}
      </div>
    )
  }
}

const mapStateToProps = (state: any, ownProps: any) => ({
  hits: state.entities.hits || []
})

export default connect(mapStateToProps)(PassagesList)
