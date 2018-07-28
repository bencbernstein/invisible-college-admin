import * as React from "react"
import styled from "styled-components"
import * as _ from "underscore"

import { Sentence, Text } from "../../models/text"
import { Keywords } from "../app"

import { colors } from "../../lib/colors"
import { getRanges, highlight } from "../../lib/helpers"
import Input from "../common/input"
import CommonText from "../common/text"
import Navigation from "./navigation"

const DEFAULT_CHAR_LIMIT = 1500

const Container = styled.div`
  text-align: left;
  width: 100%;
`

const InfoContainer = styled.div`
  text-align: left;
  margin-top: 25px;
`

const SentencesContainer = styled.div`
  margin: 50px 0px;
`

const CharLimitContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
`

const Space = styled.div`
  width: 5px;
`

interface SpanProps {
  color?: string
  saved?: boolean
  previouslySaved?: boolean
}

const Span = styled.span`
  color: ${(p: SpanProps) => p.color || colors.gray};
  text-decoration: ${(p: SpanProps) =>
    p.saved || p.previouslySaved ? "underline" : "none"};
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`

interface State {
  viewingSentencesCount: number
  characterLimit: number
  idx: number
  tokenized: Sentence[]
  savedSentences: number[]
}

interface Props {
  text: Text
  keywords?: Keywords
  updatePassages: (id: string, ranges: number[][]) => {}
}

class Read extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      viewingSentencesCount: 0,
      characterLimit: DEFAULT_CHAR_LIMIT,
      idx: 0,
      savedSentences: [],
      tokenized: this.props.text!.tokenized
    }
  }

  public componentDidMount() {
    this.getText()
  }

  public componentWillUnmount() {
    const ranges = getRanges(this.state.savedSentences)
    this.props.updatePassages(this.props.text.id, ranges)
  }

  public getText() {
    const { idx, characterLimit } = this.state
    const tokenized = this.state.tokenized.slice(idx)

    let isViewing: Sentence[] = []

    for (let i = 0; i < tokenized.length; i++) {
      const textPart = tokenized[i]

      const underCharacterLimit =
        isViewing
          .concat(textPart)
          .map((t: Sentence) => t.sentence)
          .join(" ").length < characterLimit

      if (!underCharacterLimit) {
        this.setState({ viewingSentencesCount: Math.max(i, 1) })
        return
      } else {
        isViewing = isViewing.concat(textPart)
      }
    }

    this.setState({ viewingSentencesCount: tokenized.length })
  }

  public handleNavigation(value: string) {
    let { idx } = this.state
    const { tokenized, viewingSentencesCount } = this.state

    if (value === "previous highlight") {
      const lastHighlightIdx = _.findLastIndex(
        tokenized.slice(0, idx),
        t => t.found.length > 0
      )
      if (lastHighlightIdx > -1) {
        idx = lastHighlightIdx
      }
    } else if (value === "previous") {
      idx = Math.max(0, idx - viewingSentencesCount)
    } else if (value === "keep") {
      this.keepAllSentences()
    } else if (value === "next") {
      if (idx + viewingSentencesCount < tokenized.length) {
        idx = idx + viewingSentencesCount
      }
    } else if (value === "next highlight") {
      const nextHighlightIdx = _.findIndex(
        tokenized.slice(idx),
        t => t.found.length > 0
      )
      if (nextHighlightIdx > -1) {
        idx = idx + viewingSentencesCount + nextHighlightIdx
      }
    }

    this.setState({ idx }, this.getText)
  }

  public changeCharacterLimit(limit: string) {
    this.setState({ characterLimit: parseInt(limit, 10) || 0 }, this.getText)
  }

  public keepAllSentences() {
    const { idx, viewingSentencesCount } = this.state
    let { savedSentences } = this.state
    savedSentences = _.uniq(
      savedSentences.concat(_.range(idx, idx + viewingSentencesCount))
    )
    this.setState({ savedSentences })
  }

  public handleClickedSentence(i: number) {
    let { savedSentences } = this.state
    const idx = i + this.state.idx

    savedSentences =
      savedSentences.indexOf(idx) > -1
        ? _.without(savedSentences, idx)
        : savedSentences.concat(idx)

    this.setState({ savedSentences })
  }

  public render() {
    const {
      tokenized,
      idx,
      viewingSentencesCount,
      characterLimit,
      savedSentences
    } = this.state

    const { keywords } = this.props

    const previouslySavedSentences = _.flatten(
      this.props.text.passages.map(p => _.range(p.startIdx, p.endIdx))
    )

    const word = (str: string, found: string[], i: number) => (
      <Span key={i} color={highlight(str, keywords)}>
        {" "}
        {str}
      </Span>
    )

    const sentences = tokenized
      .slice(idx, idx + viewingSentencesCount)
      .map((textPart: Sentence, i: number) => {
        const saved = savedSentences.indexOf(idx + i) > -1
        const previouslySaved = previouslySavedSentences.indexOf(i) > -1
        return (
          <Span
            previouslySaved={previouslySaved}
            saved={saved}
            onClick={() => {
              if (!previouslySaved) {
                this.handleClickedSentence(i)
              }
            }}
            key={i}
          >
            {textPart.sentence
              .split(" ")
              .map((w: string, i2: number) => word(w, textPart.found, i2))}
          </Span>
        )
      })

    return (
      <Container>
        <InfoContainer>
          <CommonText.regular>{`Total sentences : ${
            tokenized.length
          }`}</CommonText.regular>

          <CharLimitContainer>
            <CommonText.regular>Character limit :</CommonText.regular>
            <Space />
            <Input.s
              onChange={e => this.changeCharacterLimit(e.target.value)}
              value={characterLimit}
              placeholder="ex. 500"
              type="text"
            />
          </CharLimitContainer>

          <CommonText.regular>
            {`Showing : ${idx + 1} - ${idx + viewingSentencesCount}`}
          </CommonText.regular>
        </InfoContainer>
        <SentencesContainer>{sentences}</SentencesContainer>

        <Navigation handleNavigation={this.handleNavigation.bind(this)} />
      </Container>
    )
  }
}

export default Read
