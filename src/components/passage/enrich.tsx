import pos from "pos"
import * as React from "react"
import { get } from "lodash"
import * as _ from "underscore"

import CommonIcon from "../common/icon"
import Text from "../common/text"
import FlexedDiv from "../common/flexedDiv"

import {
  TagValue,
  PartOfSpeech,
  Tagged,
  Textarea,
  PassageContainer,
  Icon,
  Icons
} from "./components"

import { PassageSequence } from "../../models/passageSequence"
import { Tag } from "../../models/passage"
import { Passage } from "../../models/passage"
import { Keywords } from "../../models/word"

import { highlight, tagsToSentence, flattenSentences } from "../../lib/helpers"

import nextImg from "../../lib/images/icon-next.png"
import addIcon from "../../lib/images/icon-add.png"
import deleteIcon from "../../lib/images/icon-delete.png"

const connectorValues: any[] = []

interface Props {
  keywords?: Keywords
  passage: Passage
  passageSequences: PassageSequence[]
  sentences: Tag[][]
  nextPassage: (next: number, passage: Passage, remove?: boolean) => void
  idx: number
}

interface IsEditing {
  idx: number
  value: string
}

interface State {
  sentences: Tag[][]
  passage: Passage
  isEditing?: IsEditing
}

const automaticFocus = (tag: Tag) =>
  tag.wordId || tag.choiceSetId || tag.isConnector

class EnrichComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    const { passage, sentences } = this.props

    this.state = {
      passage,
      sentences
    }
  }

  public componentWillReceiveProps(nextProps: Props) {
    const { passage, sentences } = nextProps
    if (passage.id !== this.props.passage.id) {
      this.setState({
        passage,
        sentences
      })
    }
  }

  public editValue(senIdx: number, value: string) {
    const { passage, sentences } = this.state

    const [words, choices] = this.props.keywords
      ? [this.props.keywords.words, this.props.keywords.choices]
      : [{}, {}]

    const lexed = new pos.Lexer().lex(value)
    const tagger = new pos.Tagger()

    sentences[senIdx] = tagger.tag(lexed).map((t: any) => ({
      value: t[0],
      tag: t[1],
      isPunctuation: t[0] === t[1],
      isConnector: connectorValues.indexOf(t[0]) > -1,
      wordId: words[t[0].toLowerCase()],
      choiceSetId: choices[t[0].toLowerCase()],
      isFocusWord: false
    }))

    passage.tagged = flattenSentences(sentences)

    this.setState({ passage, sentences, isEditing: undefined })
  }

  public switchFocus(senIdx: number, wordIdx: number) {
    const { passage, sentences } = this.state

    const tag = sentences[senIdx][wordIdx]
    const attr = automaticFocus(tag) ? "isUnfocused" : "isFocusWord"
    sentences[senIdx][wordIdx][attr] = !tag[attr]
    passage.tagged = flattenSentences(sentences)

    this.setState({ passage, sentences })
  }

  public removeSentence(idx: number) {
    const { passage, sentences } = this.state

    sentences.splice(idx, 1)
    passage.filteredSentences = _.without(
      passage.filteredSentences.map(i => (i > idx ? i - 1 : i)).concat(idx + 1),
      idx
    )
    passage.tagged = flattenSentences(sentences)

    this.setState({ passage, sentences })
  }

  public addSentenceAfter(idx: number) {
    const { passage, sentences } = this.state

    sentences.splice(idx + 1, 0, [])
    passage.filteredSentences = passage.filteredSentences
      .map(i => (i > idx ? i + 1 : i))
      .concat(idx + 1)
    passage.tagged = flattenSentences(sentences)

    this.setState({ passage, sentences })
  }

  public changedFactoidOnCorrect() {
    const { passage } = this.state
    passage.factoidOnCorrect = !passage.factoidOnCorrect
    this.setState({ passage })
  }

  public render() {
    const { isEditing, sentences, passage } = this.state
    const { idx } = this.props

    const wordComponent = (tags: Tag[], i: number) =>
      _.include(passage.filteredSentences, i) ? (
        tags.map((tag: Tag, i2: number) => (
          <Tagged isPunctuation={tag.isPunctuation} key={`${i}-${i2}`}>
            <TagValue
              isUnfocused={tag.isUnfocused}
              isFocusWord={tag.isFocusWord}
              onClick={() => this.switchFocus(i, i2)}
              color={highlight(tag)}
            >
              {tag.value}
            </TagValue>
            {(tag.isFocusWord || (automaticFocus(tag) && !tag.isUnfocused)) && (
              <PartOfSpeech>{tag.tag}</PartOfSpeech>
            )}
          </Tagged>
        ))
      ) : (
        <Tagged key={i} hide={true}>
          <TagValue>...</TagValue>
        </Tagged>
      )

    const sentenceComponent = (tags: Tag[], i: number) =>
      _.include(passage.filteredSentences, i) && (
        <FlexedDiv justifyContent={"space-between"} key={i}>
          <Text.s>{i + 1}</Text.s>
          <Textarea
            spellCheck={false}
            onChange={e =>
              this.setState({
                isEditing: { idx: i, value: e.target.value }
              })
            }
            onBlur={() => {
              if (isEditing) {
                this.editValue(i, isEditing.value)
              }
            }}
            value={
              i === get(isEditing, "idx")
                ? isEditing!.value
                : tagsToSentence(tags)
            }
          />
          <CommonIcon
            small={true}
            src={addIcon}
            pointer={true}
            onClick={() => this.addSentenceAfter(i)}
          />
          <CommonIcon
            small={true}
            src={deleteIcon}
            pointer={true}
            onClick={() => this.removeSentence(i)}
          />
        </FlexedDiv>
      )

    return (
      <PassageContainer>
        {sentences.map(wordComponent)}
        <br />
        <br />
        {sentences.map(sentenceComponent)}
        <br />
        <FlexedDiv justifyContent="flex-start">
          <input
            type="checkbox"
            checked={passage.factoidOnCorrect}
            onChange={this.changedFactoidOnCorrect.bind(this)}
          />
          <Text.s margin="0 0 0 5px">Factoid on correct</Text.s>
        </FlexedDiv>
        <Icons>
          <Icon
            disable={idx === 0}
            onClick={() => this.props.nextPassage(idx - 1, passage)}
            flipHorizontal={true}
            src={nextImg}
          />
          <Icon
            onClick={() => this.props.nextPassage(idx + 1, passage, true)}
            src={deleteIcon}
          />
          <Icon
            onClick={() => this.props.nextPassage(idx + 1, passage)}
            src={nextImg}
          />
        </Icons>
      </PassageContainer>
    )
  }
}

export default EnrichComponent
