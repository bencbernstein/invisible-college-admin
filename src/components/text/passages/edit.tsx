import pos from "pos"
import * as React from "react"
import styled from "styled-components"
import { get } from "lodash"
import * as _ from "underscore"

import Button from "../../common/button"
import Icon from "../../common/icon"
import Text from "../../common/text"

import {
  addPassageToPassageSequence,
  PassageSequence
} from "../../../models/passageSequence"
import { Passage, Tag, updatePassage } from "../../../models/text"
import { Keywords } from "../../app"

import { colors } from "../../../lib/colors"
import connectors from "./data/connectors"
import {
  highlight,
  tagsToSentence,
  cleanObj,
  toSentences
} from "../../../lib/helpers"

import addIcon from "../../../lib/images/icon-add.png"
import deleteIcon from "../../../lib/images/icon-delete.png"

const connectorValues = _.flatten(connectors.map(c => c.elements))

const Container = styled.div`
  text-align: left;
  width: 100%;
`

interface TaggedProps {
  isUnfocused?: boolean
  isPunctuation?: boolean
  isFocusWord?: boolean
}

const TagValue = Text.l.extend`
  line-height: 20px;
  margin-bottom: 20px;
  font-family: GeorgiaRegular;
  cursor: pointer;
  text-decoration: ${(p: TaggedProps) =>
    p.isUnfocused ? "line-through" : p.isFocusWord ? "underline" : "none"};
`

const TextAreasContainer = styled.div`
  width: 100%;
  margin-top: 20px;
`

interface FlexedDivProps {
  justifyContent: string
}

const FlexedDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${(p: FlexedDivProps) => p.justifyContent};
`

const PartOfSpeech = Text.s.extend`
  position: absolute;
  cursor: pointer;
  text-align: center;
  bottom: 5px;
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
  color: ${colors.gray};
`

const Tagged = styled.div`
  position: relative;
  display: inline-block;
  margin-left: ${(p: TaggedProps) => (p.isPunctuation ? "0px" : "5px")};
`

const Textarea = styled.textarea`
  width: 100%;
  font-family: GeorgiaRegular;
  line-height: 24px;
  font-size: 0.9em;
  color: ${colors.gray};
  padding: 10px;
  box-sizing: border-box;
  margin: 5px 15px;
  height: 70px;
`

interface Props {
  keywords?: Keywords
  passage: Passage
  isEnriching: boolean
  removePassage: (passageId: string) => {}
  passageSequences: PassageSequence[]
}

interface IsEditing {
  idx: number
  value: string
}

interface State {
  passage: Passage
  sentences: Tag[][]
  removed: boolean
  isEditing?: IsEditing
  didEdit: boolean
  addToSequenceChecked: boolean
}

const automaticFocus = (tag: Tag) =>
  tag.wordId || tag.choiceSetId || tag.isConnector

class EditPassage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      removed: false,
      passage: this.props.passage,
      sentences: toSentences(this.props.passage.tagged),
      addToSequenceChecked: false,
      didEdit: false
    }
  }

  public componentWillUnmount() {
    this.updatePassage()
  }

  public componentWillReceiveProps(nextProps: Props) {
    const passage = nextProps.passage
    const switchedPassage = this.props.passage.id !== passage.id
    if (switchedPassage) {
      this.updatePassage()
    }
    this.setState({ passage, didEdit: false })
  }

  public updatePassage() {
    const { addToSequenceChecked, didEdit, removed, passage } = this.state

    if (!removed && (didEdit || this.props.isEnriching)) {
      _.flatten(passage.tagged).forEach((tag: Tag) => cleanObj(tag))

      // TODO: - fix

      if (addToSequenceChecked && passage.tagged.length > 100000) {
        updatePassage(passage)

        const id = this.props.passageSequences[0].id
        addPassageToPassageSequence(id, passage.id)
      }
    }
  }

  public editValue(sentenceIdx: number, value: string) {
    const { passage } = this.state

    const [words, choices] = this.props.keywords
      ? [this.props.keywords.words, this.props.keywords.choices]
      : [{}, {}]

    const lexed = new pos.Lexer().lex(value)
    const tagger = new pos.Tagger()

    passage.tagged[sentenceIdx] = tagger.tag(lexed).map((t: any) => ({
      value: t[0],
      tag: t[1],
      isPunctuation: t[0] === t[1],
      isConnector: connectorValues.indexOf(t[0]) > -1,
      wordId: words[t[0].toLowerCase()],
      choiceSetId: choices[t[0].toLowerCase()],
      isFocusWord: false
    }))

    this.setState({ passage, didEdit: true, isEditing: undefined })
  }

  public switchFocus(sentenceIdx: number, wordIdx: number) {
    const passage = this.state.passage
    const tag = passage.tagged[sentenceIdx][wordIdx]
    const attr = automaticFocus(tag) ? "isUnfocused" : "isFocusWord"
    passage.tagged[sentenceIdx][wordIdx][attr] = !tag[attr]
    this.setState({ passage, didEdit: true })
  }

  public removeSentence(idx: number) {
    const passage = this.state.passage
    passage.tagged.splice(idx, 1)
    this.setState({ passage, didEdit: true })
  }

  public addSentenceAfter(idx: number) {
    const passage = this.state.passage
    passage.tagged.splice(idx + 1, 0, { value: "" })
    this.setState({ passage, didEdit: true })
  }

  public remove(id: string) {
    this.props.removePassage(id)
    this.setState({ removed: true })
  }

  public render() {
    const { isEnriching } = this.props

    const {
      isEditing,
      passage,
      removed,
      addToSequenceChecked,
      sentences
    } = this.state

    const { id, startIdx, endIdx } = passage

    const sentenceComponents = sentences.map((tags: Tag[], i: number) => (
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
        <Icon
          small={true}
          src={addIcon}
          pointer={true}
          onClick={() => this.addSentenceAfter(i)}
        />
        <Icon
          small={true}
          src={deleteIcon}
          pointer={true}
          onClick={() => this.removeSentence(i)}
        />
      </FlexedDiv>
    ))

    const wordComponents = sentences.map((sentence: Tag[], senIdx: number) =>
      sentence.map((tag: Tag, wordIdx: number) => (
        <Tagged isPunctuation={tag.isPunctuation} key={`${senIdx}-${wordIdx}`}>
          <TagValue
            isUnfocused={tag.isUnfocused}
            isFocusWord={tag.isFocusWord}
            onClick={() => this.switchFocus(senIdx, wordIdx)}
            color={highlight(tag)}
          >
            {tag.value}
          </TagValue>
          {(tag.isFocusWord || (automaticFocus(tag) && !tag.isUnfocused)) && (
            <PartOfSpeech>{tag.tag}</PartOfSpeech>
          )}
        </Tagged>
      ))
    )

    if (removed) {
      return <Text.l>Removed</Text.l>
    }

    return (
      <Container>
        {isEnriching && (
          <FlexedDiv justifyContent={"start"}>
            <Text.s>Add to Zoology Sequence</Text.s>
            <input
              checked={addToSequenceChecked}
              onChange={e =>
                this.setState({ addToSequenceChecked: !addToSequenceChecked })
              }
              type="checkbox"
            />
          </FlexedDiv>
        )}

        <FlexedDiv justifyContent={"start"}>
          <Text.l>
            {startIdx} - {endIdx}
          </Text.l>
          <Button.circ marginLeft={"10px"} onClick={() => this.remove(id)}>
            Remove
          </Button.circ>
        </FlexedDiv>

        <br />

        <div>{wordComponents}</div>

        <TextAreasContainer>{sentenceComponents}</TextAreasContainer>
      </Container>
    )
  }
}

export default EditPassage
