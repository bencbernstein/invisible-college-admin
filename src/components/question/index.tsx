import * as React from "react"
import * as _ from "underscore"
import styled from "styled-components"

import { Question } from "../../models/question"

import Icon from "../common/icon"

import Answer from "./answer"
import Choices from "./choices"
import ProgressBar from "./progressBar"
import Prompt from "./prompt"

import DeleteIcon from "../../lib/images/icon-delete.png"

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  background-color: white;
  bottom: 0;
  left: 0;
  position: fixed;
  top: 0;
  right: 0;
  box-sizing: border-box;
  padding: 0% 5%;
`

const TopContainer = styled.div`
  height: 10%;
  align-items: center;
  display: flex;
`

const TopDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 10%;
`

export interface Guess {
  correct: boolean
  buttonIdx: number
}

interface Props {
  questions: Question[]
  done: () => void
}

interface State {
  idx: number
  guess?: Guess
  guessedCorrectly: string[]
}

class QuestionComponent extends React.Component<Props, State> {
  constructor(props: any) {
    super(props)
    this.state = {
      idx: 0,
      guessedCorrectly: []
    }

    this.handleKeyDown = this.handleKeyDown.bind(this)
  }

  public componentWillMount() {
    document.addEventListener("keydown", this.handleKeyDown, false)
  }

  public componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown, false)
  }

  public handleKeyDown(e: any) {
    let idx = this.state.idx
    if (e.key === "ArrowRight") {
      idx = Math.min(this.props.questions.length - 1, idx + 1)
    } else if (e.key === "ArrowLeft") {
      idx = Math.max(0, idx - 1)
    }
    this.setState({ idx })
  }

  public guessed(choice: string, buttonIdx: number, answerValues: string[]) {
    const { guessedCorrectly } = this.state
    const correctValue = _.find(
      _.without(answerValues, ...guessedCorrectly),
      value => value === choice
    )
    if (correctValue) {
      guessedCorrectly.push(correctValue)
    }
    const guess = { correct: correctValue !== undefined, buttonIdx }
    this.setState({ guess, guessedCorrectly })

    setTimeout(() => {
      let { idx } = this.state
      if (correctValue) {
        guessedCorrectly.push(correctValue)
        const done = this.props.questions.length === idx + 1
        if (done) {
          this.props.done()
        } else {
          idx += 1
        }
      }
      this.setState({ guess: undefined, idx, guessedCorrectly: [] })
    }, 1500)
  }

  public render() {
    const { questions } = this.props
    const { idx, guess, guessedCorrectly } = this.state

    const { prompt, answer, redHerrings, TYPE } = questions[idx]
    const noPrompt = prompt.length === 0

    return (
      <Container>
        <TopContainer>
          <TopDiv />
          <ProgressBar
            goTo={(newIdx: number) => this.setState({ idx: newIdx })}
            completion={idx / questions.length}
          />
          <TopDiv>
            <Icon
              onClick={this.props.done.bind(this)}
              pointer={true}
              large={true}
              src={DeleteIcon}
            />
          </TopDiv>
        </TopContainer>

        {!noPrompt && <Prompt type={TYPE} prompt={prompt} />}

        <Answer
          type={TYPE}
          height={noPrompt ? "45%" : "20%"}
          guessedCorrectly={guessedCorrectly}
          answer={answer}
        />

        <Choices
          answer={answer}
          guess={guess}
          guessed={this.guessed.bind(this)}
          redHerrings={redHerrings}
          type={TYPE}
        />
      </Container>
    )
  }
}

export default QuestionComponent
