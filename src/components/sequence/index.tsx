import { get } from "lodash"
import * as React from "react"
import * as _ from "underscore"

import AddBox from "../common/addBox"
import Box from "../common/box"
import Header from "../common/header"
import Icon from "../common/icon"
import IconsContainer from "../common/iconsContainer"
import Input from "../common/input"
import ListContainer from "../common/listContainer"
import Text from "../common/text"

import Subnav from "../nav/subnav"

import { Question } from "../../models/question"
import {
  fetchQuestionSequence,
  updateQuestionSequence,
  QuestionSequence
} from "../../models/questionSequence"

import { move } from "../../lib/helpers"

import deleteIcon from "../../lib/images/icon-delete.png"
import questionIcon from "../../lib/images/icon-question.png"

const indexInputIsValid = (
  indexInput: string,
  i: number,
  questions: string[]
) => {
  const indexInputNumber = parseInt(indexInput, 10)
  return (
    indexInputNumber > -1 &&
    indexInputNumber < questions.length &&
    indexInputNumber !== i
  )
}

interface Props {
  play: (questions: Question[]) => void
}

interface State {
  isHovering?: number
  questionSequence?: QuestionSequence
  indexInput: string
}

class Sequence extends React.Component<Props, State> {
  constructor(props: any) {
    super(props)
    this.state = {
      indexInput: ""
    }
  }

  public componentDidMount() {
    this.loadSequence()
  }

  public componentWillUnmount() {
    const { questionSequence } = this.state
    if (questionSequence) {
      updateQuestionSequence(questionSequence.id, questionSequence.questions)
    }
  }

  public async loadSequence() {
    const id = _.last(window.location.pathname.split("/"))
    const questionSequence = await fetchQuestionSequence(id!)
    if (!(questionSequence instanceof Error)) {
      this.setState({ questionSequence })
    }
  }

  public removeQuestionFromSequence(id: string) {
    const questionSequence = this.state.questionSequence!
    questionSequence.questions = _.without(questionSequence.questions, id)
    this.setState({ questionSequence })
  }

  public handleIndexInput(indexInput: string, i: number, questions: string[]) {
    if (indexInputIsValid(indexInput, i, questions) || indexInput === "") {
      this.setState({ indexInput })
    }
  }

  public changeIndex(
    i: number,
    indexInput: string,
    questionSequence: QuestionSequence
  ) {
    const questions = questionSequence.questions
    if (indexInputIsValid(indexInput, i, questions)) {
      questionSequence.questions = move(questions, i, parseInt(indexInput, 10))
      this.setState({ questionSequence, indexInput: "" })
    }
  }

  public render() {
    const { isHovering, questionSequence, indexInput } = this.state

    if (!questionSequence) {
      return null
    }

    const { questions, fullQuestions } = questionSequence

    const icons = (id: string) => (
      <IconsContainer>
        <Icon
          pointer={true}
          onClick={() => this.removeQuestionFromSequence(id)}
          src={deleteIcon}
        />
        <Icon src={questionIcon} />
      </IconsContainer>
    )

    const addBox = (i: number) => (
      <AddBox key={i}>
        <Header.forInput>Change Index</Header.forInput>

        <form
          onSubmit={e => {
            e.preventDefault()
            this.changeIndex(i, indexInput, questionSequence)
          }}
        >
          <Input.circ
            onChange={e => this.handleIndexInput(e.target.value, i, questions)}
            value={indexInput}
            autoCapitalize={"none"}
            autoFocus={true}
            type="text"
          />
        </form>
      </AddBox>
    )

    const box = (q: Question, i: number) => (
      <Box.regular
        onMouseOver={() => this.setState({ isHovering: i })}
        onMouseLeave={() =>
          this.setState({ isHovering: undefined, indexInput: "" })
        }
        key={q.id}
      >
        {icons(q.id)}

        <Text.l>{get(q.sources.word || q.sources.text, "value")}</Text.l>

        <Text.regular>{q.TYPE}</Text.regular>

        <Header.s>{`no. ${i + 1}`}</Header.s>

        {isHovering === i && addBox(i)}
      </Box.regular>
    )

    return (
      <div>
        <Subnav
          title={questionSequence!.name}
          subtitle={"sequences"}
          subtitleLink={"/gameplay"}
          play={() => this.props.play(fullQuestions!)}
          invert={true}
        />

        <ListContainer>
          {questions
            .map(q => _.find(fullQuestions || [], f => f.id === q))
            .map(box)}
        </ListContainer>
      </div>
    )
  }
}

export default Sequence
