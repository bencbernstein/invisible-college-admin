import * as React from "react"
import { Redirect } from "react-router"
import { connect } from "react-redux"
import { without, uniq, chunk } from "lodash"

import Spinner from "../common/spinner"
import Text from "../common/text"
import Settings from "./settings"
import PassagesList from "./passages"
import { LeftPane, RightPane } from "./components"
import { colors } from "../../lib/colors"

import {
  fetchWordsByValuesAction,
  findEsPassagesAction,
  createQueuesAction,
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
      searchWords: [],
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
    const { hits, curriculum } = this.props

    const queueSize = parseInt(
      window.prompt("Max queue size? (min. 10)", "20") || "",
      10
    )
    if (!queueSize || queueSize < 10) return

    const findMatches = (sentences: string[]) =>
      (sentences.join(" ").match(/>([^<]*)<\/span/g) || []).map((s: any) =>
        s.replace(/>|<\/span/gi, "").toLowerCase()
      )

    const items = hits.map(({ _id, highlight }) => ({
      id: _id,
      tags: uniq(findMatches(highlight.sentences))
    }))

    const chunks = chunk(items, queueSize)
    const queues = chunks.map((items: any[], idx: number) => ({
      type: "filter",
      entity: "passage",
      curriculumId: curriculum.id,
      curriculum: curriculum.name,
      part: chunks.length > 1 && idx + 1,
      items
    }))

    const confirm = `Create ${queues.length} ${curriculum.name} queue(s) from ${
      items.length
    } passages?`

    if (window.confirm(confirm)) {
      this.props.dispatch(setEntity({ isLoading: true }))
      await this.props.dispatch(createQueuesAction(queues))
      this.setState({ redirect: "/queues" })
    }
  }

  public render() {
    const { searchWords, searchCollections, error, redirect } = this.state
    const { hits, isLoading } = this.props

    if (redirect) return <Redirect to={redirect} />

    return (
      <div style={{ display: "flex" }}>
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
      </div>
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
