import * as React from "react"
import { Redirect } from "react-router"
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
  findEsPassagesAction,
  createQueueAction,
  setEntity
} from "../../actions"

import { Word } from "../../interfaces/word"
import { Curriculum } from "../../interfaces/curriculum"

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
  redirect?: string
  searchCollections: string[]
}

interface Props {
  dispatch: any
  words: Word[]
  curriculum: Curriculum
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
    this.props.dispatch(setEntity({ isLoading: true }))
    this.props.dispatch(findEsPassagesAction(lcds))
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
    const params = { type: "filter", entity: "passage", items }
    const curriculum = this.props.curriculum.name
    const confirm = `Create ${curriculum} queue from ${items.length} passages?`
    if (window.confirm(confirm)) {
      this.props.dispatch(setEntity({ isLoading: true }))
      await this.props.dispatch(createQueueAction(params))
      this.setState({ redirect: "/queues" })
    }
  }

  public render() {
    const { searchWords, searchCollections, error, redirect } = this.state
    const { hits, isLoading } = this.props

    if (redirect) return <Redirect to={redirect} />

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
  isLoading: state.entities.isLoading === true,
  curriculum: state.entities.curriculum
})

export default connect(mapStateToProps)(Discover)
