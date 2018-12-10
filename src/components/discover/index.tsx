import * as React from "react"
import { connect } from "react-redux"
import { without, uniq } from "lodash"

import Spinner from "../common/spinner"
import Text from "../common/text"
import Settings from "./settings"
import PassagesList from "./passages"
import { Container, LeftPane, RightPane } from "./components"
import { colors } from "../../lib/colors"

import {
  fetchWordsByValuesAction,
  findPassagesAction,
  createQueueAction
} from "../../actions"

import { Word } from "../../interfaces/word"

const combineLcds = (words: Word[], searchWords: string[]): string[] => {
  words.forEach((word: Word) => {
    const idx = searchWords.findIndex(w => w === word.value)
    if (idx > -1) {
      searchWords[idx] = word.lcd || word.value
    }
  })
  return searchWords.map(word => word.toLowerCase())
}

interface State {
  error?: string
  searchWords: string[]
  searchCollections: string[]
}

interface Props {
  dispatch: any
  words: Word[]
  hits: any[]
  isLoading: boolean
}

class Discover extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      searchWords: ["carnivore"],
      searchCollections: ["simple english wikipedia"]
    }
  }

  public async runPassageSearch() {
    await this.props.dispatch(fetchWordsByValuesAction(this.state.searchWords))
    const lcds = combineLcds(this.props.words, this.state.searchWords)
    this.props.dispatch(findPassagesAction(lcds))
  }

  private editedSearchWords(str: string) {
    const searchWords = str.split(",").map(s => s.trim())
    this.setState({ searchWords })
  }

  private editedSearchCollections(str: string) {
    const searchCollections =
      this.state.searchCollections.indexOf(str) > -1
        ? without(this.state.searchCollections, str)
        : this.state.searchCollections.concat(str)
    this.setState({ searchCollections })
  }

  public async exportPassages() {
    const findMatches = (sentences: string[]) =>
      (sentences.join(" ").match(/>([^<]*)<\/span/g) || []).map((s: any) =>
        s.replace(/>|<\/span/gi, "").toLowerCase()
      )
    const items = this.props.hits.map(({ _id, highlight }) => ({
      id: _id,
      tags: uniq(findMatches(highlight.sentences))
    }))
    const createdOn = Date.now()
    const params = { type: "filter", entity: "passage", items, createdOn }
    this.props.dispatch(createQueueAction(params))
  }

  public render() {
    const { searchWords, searchCollections, error } = this.state
    const { hits, isLoading } = this.props

    return (
      <Container>
        <LeftPane>
          <Settings
            canExport={hits.length > 0}
            exportPassages={this.exportPassages.bind(this)}
            searchCollections={searchCollections}
            hasSearchCollections={searchCollections.length > 0}
            hasSearchWords={searchWords.length > 0}
            searchWords={searchWords}
            editedSearchCollections={this.editedSearchCollections.bind(this)}
            editedSearchWords={this.editedSearchWords.bind(this)}
            runPassageSearch={this.runPassageSearch.bind(this)}
          />
        </LeftPane>
        <RightPane>
          {error && <Text.s color={colors.red}>{error}</Text.s>}
          {isLoading ? <Spinner /> : <PassagesList />}
        </RightPane>
      </Container>
    )
  }
}

const mapStateToProps = (state: any, ownProps: any) => ({
  words: state.entities.words || [],
  hits: state.entities.hits || [],
  isLoading: state.entities.isLoading
})

export default connect(mapStateToProps)(Discover)
