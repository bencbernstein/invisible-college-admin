import * as React from "react"
import { flatten } from "underscore"

import Header from "../common/header"
import Text from "../common/text"
import CompletedModal from "./completedModal"
import EnrichComponent from "./enrich"
import FilterComponent from "./filter"

import { Tag } from "../../models/text"
import { passagesForWord } from "../../models/word"
import { Passage, filterPassage, updatePassage } from "../../models/passage"
import { colors } from "../../lib/colors"
import { cleanObj, toSentences } from "../../lib/helpers"

export enum QueueType {
  filter = "Filter",
  enrich = "Enrich"
}

interface State {
  passages: Passage[]
  passage?: Passage
  idx: number
  sentenceCount: number
  sentences: Tag[][]
  displayModal: boolean
  queueType?: QueueType
  word: string
}

class PassageContainer extends React.Component<any, State> {
  constructor(props: any) {
    super(props)

    this.state = {
      passages: [],
      idx: 0,
      sentenceCount: 0,
      sentences: [],
      displayModal: false,
      word: ""
    }
  }

  public componentDidMount() {
    this.reset()
  }

  public async reset() {
    const s = window.location.search
    const queueType = s.includes("filter")
      ? QueueType.filter
      : s.includes("enrich")
        ? QueueType.enrich
        : undefined
    const word = s.split("word=")[1]
    let passages = await passagesForWord(word)

    if (!(passages instanceof Error)) {
      if (queueType === QueueType.filter) {
        passages = passages.filter(p => p.status === "unfiltered")
      } else if (queueType === QueueType.enrich) {
        passages = passages.filter(p => p.status === "accepted")
      }
      this.setState({ passages, queueType, word, displayModal: false }, () =>
        this.nextPassage(0, passages as Passage[])
      )
    }
  }

  public async nextFilterPassage(next: number, filteredSentences?: number[]) {
    const { idx, passages } = this.state
    if (next > idx && filteredSentences) {
      passages[idx].filteredSentences = filteredSentences
      const status = filteredSentences.length ? "accepted" : "rejected"
      await filterPassage(passages[idx].id, status, filteredSentences)
    }
    this.nextPassage(next, passages)
  }

  public async nextEnrichPassage(
    next: number,
    passage: Passage,
    remove?: boolean
  ) {
    const { idx, passages } = this.state
    if (next > idx) {
      flatten(passage.tagged).forEach((tag: Tag) => cleanObj(tag))
      const status = remove ? "rejected" : "enriched"
      remove ? passages.splice(idx, 1) : (passages[idx] = passage)
      await updatePassage(passage, status)
      passage.status = status
    }
    this.nextPassage(remove ? idx : next, passages)
  }

  public async nextPassage(idx: number, passages: Passage[]) {
    const passage = passages[idx]
    if (!passage) {
      this.setState({ displayModal: true })
      return
    }
    const sentences = toSentences(passage.tagged)
    const sentenceCount = sentences.length
    this.setState({
      passage,
      sentenceCount,
      idx,
      sentences,
      passages
    })
  }

  public render() {
    const {
      passage,
      passages,
      idx,
      displayModal,
      queueType,
      word,
      sentenceCount,
      sentences
    } = this.state

    if (displayModal && queueType) {
      return (
        <CompletedModal
          reset={this.reset.bind(this)}
          passagesCount={passages.length}
          queueType={queueType}
          word={word}
        />
      )
    }

    if (!passage) {
      return null
    }

    return (
      <div>
        <Header.s textAlign={"center"}>
          {passage.title} (
          <a
            style={{ color: colors.blue, margin: "0 2px" }}
            href={`https://en.wikipedia.org/wiki/${passage.title}`}
            target={"_blank"}
          >
            {passage.source}
          </a>
          )
        </Header.s>
        {
          {
            Filter: (
              <FilterComponent
                sentences={sentences}
                passage={passage}
                sentenceCount={sentenceCount}
                idx={idx}
                nextPassage={this.nextFilterPassage.bind(this)}
              />
            ),
            Enrich: (
              <EnrichComponent
                passageSequences={[]}
                passage={passage}
                sentences={sentences}
                idx={idx}
                nextPassage={this.nextEnrichPassage.bind(this)}
              />
            ),
            Passage: <Text.garamond>{passage.value}</Text.garamond>
          }[queueType || "Passage"]
        }
      </div>
    )
  }
}

export default PassageContainer
