import * as React from "react"
import * as _ from "underscore"
import { chunk } from "lodash"

import Text from "../common/text"

import { PassageResult } from "../../models/discover"
import { PassageContainer, FlexedDiv, Image, Sentence } from "./components"
import { colors } from "../../lib/colors"

import arrowLeft from "../../lib/images/arrow-left.png"
import arrowRight from "../../lib/images/arrow-right.png"

import { Keywords } from "../../models/word"

interface Props {
  passages: PassageResult[]
  context: number
  keywords?: Keywords
}

enum SortBy {
  length_asc = "Length (asc)",
  length_desc = "Length (desc)",
  density_asc = "Density (asc)",
  density_desc = "Density (desc)"
}

interface State {
  selectedSortBy: SortBy
  maxResults: number
  currentPage: number
}

const sort = (
  passages: PassageResult[],
  comparator: SortBy
): PassageResult[] => {
  const isAscending = comparator.includes("asc")
  let sorted: PassageResult[] = []
  if (comparator.includes("Length")) {
    sorted = _.sortBy(passages, p => p.context.join("").length)
  } else {
    sorted = _.sortBy(passages, p => p.matches.length)
  }
  return isAscending ? sorted : sorted.reverse()
}

const MAX_PER_PAGE = 50

class PassagesList extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      currentPage: 0,
      maxResults: MAX_PER_PAGE,
      selectedSortBy: SortBy.length_asc
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
    const { context, passages, keywords } = this.props
    const { selectedSortBy, maxResults, currentPage } = this.state

    const listLength = passages.length

    if (listLength === 0) {
      return null
    }

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
        {[
          SortBy.length_asc,
          SortBy.length_desc,
          SortBy.density_asc,
          SortBy.density_desc
        ].map(option)}
      </select>
    )

    const words = keywords ? keywords.words : {}

    const span = (word: string, idx: number): any => {
      const highlight =
        words[word.toLowerCase().replace(/[^a-z]/gi, "")] !== undefined
      return (
        <span key={idx} style={{ color: highlight ? colors.yellow : "" }}>
          {word}
        </span>
      )
    }

    const sliced = (sentences: string[], matchIdx: number) =>
      sentences
        .map((str: string, idx: number) => {
          const isHeader = str.includes("== ")
          const value = isHeader ? str.replace(/=/g, "").trim() : str
          return (
            <Sentence isHeader={isHeader} isMatch={idx === matchIdx} key={idx}>
              {isHeader
                ? value
                : value
                    .split(" ")
                    .map(span)
                    .reduce((prev: any, curr: any, i: number) => [
                      prev,
                      " ",
                      curr
                    ])}
            </Sentence>
          )
        })
        .slice(Math.max(matchIdx - context, 0), matchIdx + context + 1)

    const passageComponent = (passage: PassageResult, i: number) => (
      <PassageContainer key={i}>
        <Text.garamond>
          {sliced(passage.context, passage.matchIdx)}
        </Text.garamond>
        <Text.regular>
          {passage.title}, found {passage.matches.join(", ")}
        </Text.regular>
      </PassageContainer>
    )

    const sorted = sort(passages, selectedSortBy)
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
      const endIdx = Math.min(startIdx + 49, passages.length)
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

export default PassagesList
