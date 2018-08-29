import pos from "pos"
import * as React from "react"
import styled from "styled-components"
import * as _ from "underscore"

import Text from "../../common/text"

import { Passage, Tag, updatePassage } from "../../../models/text"
import { Keywords } from "../../app"

import { colors } from "../../../lib/colors"
import { highlight } from "../../../lib/helpers"

const Container = styled.div`
  text-align: left;
  width: 95%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 25px 0px;
`

interface TaggedProps {
  isPunctuation?: boolean
  isFocusWord?: boolean
}

const TagValue = Text.l.extend`
  line-height: 20px;
  margin-bottom: 25px;
  cursor: pointer;
  text-decoration: ${(p: TaggedProps) =>
    p.isFocusWord ? "underline" : "none"};
`

const Tag = Text.s.extend`
  position: absolute;
  cursor: pointer;
  text-align: center;
  bottom: 5px;
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
  color: ${(p: TaggedProps) =>
    p.isFocusWord ? colors.gray : colors.lightestGray};
`

const Tagged = styled.div`
  position: relative;
  display: inline-block;
  margin-left: ${(p: TaggedProps) => (p.isPunctuation ? "0px" : "5px")};
`

const Textarea = styled.textarea`
  width: 100%;
  min-height: 150px;
  font-family: BrandonGrotesque;
  font-size: 1em;
  color: ${colors.gray};
  line-height: 28px;
  padding: 10px;
  box-sizing: border-box;
  margin-top: 50px;
`

interface Props {
  keywords?: Keywords
  passage: Passage
  isEnriching: boolean
}

interface State {
  passage: Passage
  isHoveringDelete?: number
  didEdit: boolean
}

class EditPassage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      passage: this.props.passage,
      didEdit: false
    }
  }

  public componentWillUnmount() {
    if (this.state.didEdit) {
      updatePassage(this.state.passage)
    }
  }

  public componentWillReceiveProps(nextProps: Props) {
    const passage = nextProps.passage
    const currentPassage = this.state.passage

    if (this.state.didEdit) {
      updatePassage(currentPassage)
    }

    this.setState({ passage, didEdit: false })
  }

  public editValue(value: string) {
    const passage = this.state.passage
    const words = new pos.Lexer().lex(value)
    const tagger = new pos.Tagger()
    passage.value = value
    passage.tagged = tagger.tag(words).map((t: any) => ({
      value: t[0],
      tag: t[1],
      isPunctuation: t[0] === t[1],
      isFocusWord: false
    }))

    this.setState({ passage, didEdit: true })
  }

  public switchFocus(i: number) {
    const passage = this.state.passage
    passage.tagged[i].isFocusWord = !passage.tagged[i].isFocusWord
    this.setState({ passage, didEdit: true })
  }

  public render() {
    const { tagged, value } = this.state.passage
    const { keywords } = this.props

    const span = (t: Tag, i: number) => (
      <Tagged isPunctuation={t.isPunctuation} key={i}>
        <TagValue
          isFocusWord={t.isFocusWord}
          onClick={() => this.switchFocus(i)}
          color={highlight(t.value, keywords)}
        >
          {t.value}
        </TagValue>
        {!t.isPunctuation && <Tag isFocusWord={t.isFocusWord}>{t.tag}</Tag>}
      </Tagged>
    )

    return (
      <Container>
        <div>{_.flatten(tagged).map((t: Tag, i: number) => span(t, i))}</div>

        <Textarea
          spellCheck={false}
          onChange={e => this.editValue(e.target.value)}
          value={value}
        />
      </Container>
    )
  }
}

export default EditPassage
