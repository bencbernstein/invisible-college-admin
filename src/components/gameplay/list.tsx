import { get } from "lodash"
import * as React from "react"
import { Redirect } from "react-router"
import { Link } from "react-router-dom"
import styled from "styled-components"

import AddBox from "../common/addBox"
import Box from "../common/box"
import Icon from "../common/icon"
import IconsContainer from "../common/iconsContainer"
import Button from "../common/button"
import Input from "../common/input"
import ListContainer from "../common/listContainer"
import Header from "../common/header"
import Text from "../common/text"

import { colors } from "../../lib/colors"
import deleteIcon from "../../lib/images/icon-delete.png"
import questionIcon from "../../lib/images/icon-question.png"
import sequenceIcon from "../../lib/images/icon-sequence.png"

import { QuestionSequence } from "../../models/questionSequence"
import { SelectedView } from "./"

const LinkButton = Button.regular.extend`
  border: 0;
  margin: 0;
  padding: 10px 0px;
  width: 100%;
`

const SuggestionContainer = styled.div`
  position: absolute;
  width: 101%;
  left: 0px;
  top: 75px;
  padding: 10px 50px;
  box-sizing: border-box;
  border: 1px solid ${colors.lightGray};
  margin: 0px -1px;
  z-index: 100;
  background-color: white;
`

interface Props {
  data: any[]
  selectedView: SelectedView
  removeSequence: (id: number) => {}
  questionSequences: QuestionSequence[]
  addQuestionToSequence: (
    questionId: string,
    sequence?: QuestionSequence,
    sequenceName?: string
  ) => {}
}

interface State {
  redirect?: string
  isHovering?: number
  questionSequenceInput: string
  matchingQuestionSequences: QuestionSequence[]
}

class List extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      questionSequenceInput: "",
      matchingQuestionSequences: []
    }
  }

  public handleQuestionSequenceInput(questionSequenceInput: string) {
    const matchingQuestionSequences = this.props.questionSequences
      .filter(s =>
        s.name.toLowerCase().startsWith(questionSequenceInput.toLowerCase())
      )
      .slice(0, 5)
    this.setState({ questionSequenceInput, matchingQuestionSequences })
  }

  public render() {
    const {
      isHovering,
      redirect,
      questionSequenceInput,
      matchingQuestionSequences
    } = this.state

    if (redirect) {
      return <Redirect to={redirect} />
    }

    const { data, selectedView } = this.props

    const icons = (i: number, hide: boolean = false) => (
      <IconsContainer>
        <Icon
          pointer={true}
          hide={hide}
          onClick={e => {
            this.props.removeSequence(i)
          }}
          src={deleteIcon}
        />
        <Icon
          src={
            { Questions: questionIcon, Sequences: sequenceIcon }[selectedView]
          }
        />
      </IconsContainer>
    )

    const suggestion = (q?: QuestionSequence) => (
      <Text.s
        pointer={true}
        onClick={() => {
          q
            ? this.props.addQuestionToSequence(data[isHovering!].id, q)
            : this.props.addQuestionToSequence(
                data[isHovering!].id,
                undefined,
                questionSequenceInput
              )
          this.setState({
            questionSequenceInput: "",
            matchingQuestionSequences: []
          })
        }}
        key={q ? q.id : "new"}
      >
        {q ? q.name : `${questionSequenceInput} (NEW)`}
      </Text.s>
    )

    const inputBox = (i: number) => (
      <AddBox>
        <Header.forInput>Add to Sequence</Header.forInput>

        <form
          onSubmit={e => {
            e.preventDefault()
          }}
        >
          <Input.circ
            onChange={e => this.handleQuestionSequenceInput(e.target.value)}
            value={questionSequenceInput}
            autoCapitalize={"none"}
            autoFocus={true}
            type="text"
          />
        </form>

        {questionSequenceInput.length > 0 && (
          <SuggestionContainer>
            {matchingQuestionSequences.map(suggestion)}
            {suggestion()}
          </SuggestionContainer>
        )}
      </AddBox>
    )

    const questionBox = (d: any, i: number) => (
      <Box.regular
        onMouseOver={() => this.setState({ isHovering: i })}
        onMouseLeave={() => this.setState({ isHovering: undefined })}
        key={i}
      >
        {icons(i, true)}
        {d.sources && (
          <Text.l>{get(d.sources.word || d.sources.text, "value")}</Text.l>
        )}
        <Text.regular>{d.TYPE}</Text.regular>
        {isHovering === i && inputBox(i)}
      </Box.regular>
    )

    const sequenceLinksBox = (sequence: QuestionSequence) => (
      <AddBox style={{ display: "flex", padding: "0" }} key={sequence.id}>
        <Link
          style={{ textDecoration: "none", color: "black", width: "50%" }}
          to={`/sequence/${sequence.id}`}
        >
          <LinkButton>View</LinkButton>
        </Link>
      </AddBox>
    )

    const sequenceBox = (sequence: QuestionSequence, i: number) => (
      <Box.regular key={i}>
        {icons(i)}
        <Text.l>{sequence.name}</Text.l>
        <Text.regular>{sequence.questions.length}</Text.regular>
        {sequenceLinksBox(sequence)}
      </Box.regular>
    )

    const box = {
      Questions: questionBox,
      Sequences: sequenceBox
    }[selectedView]

    return <ListContainer>{data.map(box)}</ListContainer>
  }
}

export default List
