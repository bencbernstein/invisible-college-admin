import * as React from "react"
import { Redirect } from "react-router"
import * as _ from "underscore"
import { get } from "lodash"

import Spinner from "../common/spinner"
import Text from "../common/text"
import Socket from "../../socket/"

import Settings from "./settings"
import Search from "./search"
import PredictiveCorpusComponent from "./predictiveCorpus"
import PassagesList from "./passages"

import { Container, LeftPane, RightPane, FlexedDiv } from "./components"
import { colors } from "../../lib/colors"

// import { DUMMY_PASSAGES } from "./seed"

import {
  PredictiveCorpus,
  PassageResult,
  PREDICTIVE_CORPUS,
  fetchArticleLinks,
  fetchPassages,
  fetchPredictiveCorpus,
  fetchTask
} from "../../models/discover"

import { fetchWordsByValues, Word, Keywords } from "../../models/word"

const combineLcds = (
  words: Word[] | Error,
  searchWords: string[]
): string[] => {
  if (!(words instanceof Error)) {
    words.forEach((word: Word) => {
      const idx = _.findIndex(searchWords, w => w === word.value)
      if (idx > -1) {
        searchWords[idx] = word.lcd
      }
    })
  }
  return searchWords.map(word => word.toLowerCase())
}

export enum MainDisplay {
  PredictiveCorpus,
  Passages
}

interface State {
  error?: string
  selectedPredictiveCorpus: string[]
  predictiveCorpus: PredictiveCorpus
  passageResults: PassageResult[]
  redirect?: string
  links: string[]
  mainDisplay: MainDisplay
  searchWords: string[]
  context: number
  isLoading: boolean
  predictiveCorpusLinks: string[]
  cachingId?: string
}

interface Props {
  keywords?: Keywords
}

class Discover extends React.Component<Props, State> {
  private socket: Socket

  constructor(props: Props) {
    super(props)

    this.state = {
      mainDisplay: MainDisplay.Passages,
      searchWords: [],
      passageResults: [],
      selectedPredictiveCorpus: [],
      predictiveCorpus: PREDICTIVE_CORPUS,
      links: [],
      context: 5,
      isLoading: false,
      predictiveCorpusLinks: []
    }
  }

  public componentDidMount() {
    // this.setupSocket()
  }

  public setupSocket() {
    this.socket = new Socket()
    this.socket.registerHandler(this.onMessageReceived.bind(this))
  }

  public onMessageReceived(message: any) {
    console.log("message received!")
  }

  public async query(search: string) {
    if (this.state.cachingId && !(await this.wikipediaArticlesDownloaded())) {
      return
    }
    this.setState({ isLoading: true, passageResults: [] })
    const result = await fetchArticleLinks(search, this.state.cachingId)
    this.setState({ isLoading: false })
    if (result.success) {
      const links = result.data.sort()
      links.length
        ? this.setState({ links, error: undefined, cachingId: result.job })
        : this.setState({ error: "No links found." })
    } else {
      this.setState({ error: result.error })
    }
  }

  public async runPredictiveCorpus() {
    this.setState({ isLoading: true, error: undefined })
    if (!(await this.wikipediaArticlesDownloaded())) {
      this.setState({ isLoading: false })
      return
    }
    const { predictiveCorpus, predictiveCorpusLinks } = this.state
    this.setState({ isLoading: true })
    const result = await fetchPredictiveCorpus(predictiveCorpusLinks)
    this.setState({ isLoading: false })
    if (result.success) {
      const keys = Object.keys(predictiveCorpus)
      keys.forEach(k => (predictiveCorpus[k].results = result.data[k]))
      this.setState({ predictiveCorpus })
    } else {
      this.setState({ error: result.error })
    }
  }

  public async wikipediaArticlesDownloaded(): Promise<boolean> {
    const { cachingId } = this.state
    if (cachingId) {
      const result = await fetchTask(cachingId)
      if (result instanceof Error) {
        return false
      }
      const finished = get(result.data, "task_status") === "finished"
      if (!finished) {
        const error = "Articles still downloading. Try again in a minute."
        this.setState({ error })
      } else {
        return true
      }
    }
    return false
  }

  public async runPassageSearch() {
    this.setState({ isLoading: true, error: undefined })
    if (!(await this.wikipediaArticlesDownloaded())) {
      this.setState({ isLoading: false })
      return
    }
    const words = await fetchWordsByValues(this.state.searchWords)
    const searchWords = combineLcds(words, this.state.searchWords)
    const result = await fetchPassages(this.state.links, searchWords)
    this.setState({ isLoading: false })
    result.success
      ? this.setState({ passageResults: result.data })
      : this.setState({ error: result.error })
  }

  public checkedPredictiveCorpus(attr: string) {
    const { predictiveCorpus } = this.state
    predictiveCorpus[attr].checked = !predictiveCorpus[attr].checked
    this.setState({ predictiveCorpus })
  }

  public addPredictiveCorpusResult(str: string) {
    let { selectedPredictiveCorpus, searchWords } = this.state
    const exists = _.includes(selectedPredictiveCorpus, str)
    selectedPredictiveCorpus = exists
      ? _.without(selectedPredictiveCorpus, str)
      : selectedPredictiveCorpus.concat(str)
    searchWords = exists ? _.without(searchWords, str) : searchWords.concat(str)
    this.setState({ selectedPredictiveCorpus, searchWords })
  }

  public addLinkToPredictiveCorpus(result: string) {
    let { predictiveCorpusLinks } = this.state
    if (_.includes(predictiveCorpusLinks, result)) {
      predictiveCorpusLinks = _.without(predictiveCorpusLinks, result)
    } else {
      if (predictiveCorpusLinks.length === 3) {
        predictiveCorpusLinks.shift()
      }
      predictiveCorpusLinks = predictiveCorpusLinks.concat(result)
    }
    this.setState({ predictiveCorpusLinks })
  }

  public editedSearchWords(str: string) {
    const searchWords = str.split(",").map(s => s.trim())
    this.setState({ searchWords })
  }

  public render() {
    const {
      links,
      redirect,
      predictiveCorpus,
      selectedPredictiveCorpus,
      mainDisplay,
      searchWords,
      passageResults,
      error,
      context,
      isLoading,
      predictiveCorpusLinks
    } = this.state

    if (redirect) {
      return <Redirect to={redirect} />
    }

    return (
      <Container>
        <LeftPane>
          <Settings
            changeMainDisplay={(m: MainDisplay) =>
              this.setState({ mainDisplay: m })
            }
            mainDisplay={mainDisplay}
            context={context}
            hasLinks={links.length > 0}
            hasSearchWords={searchWords.length > 0}
            searchWords={searchWords}
            hasPredictiveCorpusLinks={predictiveCorpusLinks.length > 0}
            editedContext={e => this.setState({ context: e })}
            editedSearchWords={this.editedSearchWords.bind(this)}
            runPassageSearch={this.runPassageSearch.bind(this)}
            isLoading={isLoading}
            runPredictiveCorpus={this.runPredictiveCorpus.bind(this)}
          />
        </LeftPane>
        <RightPane>
          <FlexedDiv alignItems={"flex-start"}>
            <Search
              placeholder={"Search article"}
              type={"article"}
              results={links}
              hasResults={links.length > 0}
              query={this.query.bind(this)}
              mainDisplay={mainDisplay}
              isLoading={isLoading}
              removeLink={result =>
                this.setState({ links: _.without(links, result) })
              }
              predictiveCorpusLinks={predictiveCorpusLinks}
              addLinkToPredictiveCorpus={this.addLinkToPredictiveCorpus.bind(
                this
              )}
            />
            <Search
              type={"word"}
              placeholder={"Search words"}
              results={searchWords}
              isLoading={isLoading}
              hasResults={searchWords.length > 0}
              query={() => console.log("query")}
            />
          </FlexedDiv>

          {error && <Text.s color={colors.red}>{error}</Text.s>}

          {isLoading ? (
            <Spinner />
          ) : (
            {
              [MainDisplay.Passages]: (
                <PassagesList
                  keywords={this.props.keywords}
                  context={context}
                  passages={passageResults}
                />
              ),
              [MainDisplay.PredictiveCorpus]: (
                <PredictiveCorpusComponent
                  selected={selectedPredictiveCorpus}
                  addResult={this.addPredictiveCorpusResult.bind(this)}
                  predictiveCorpus={predictiveCorpus}
                />
              )
            }[mainDisplay]
          )}
        </RightPane>
      </Container>
    )
  }
}

export default Discover
