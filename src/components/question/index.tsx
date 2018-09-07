import * as React from "react"
import * as _ from "underscore"
import styled from "styled-components"

import { Question, fetchQuestion } from "../../models/question"

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
  questions: string[]
  done: () => void
  playNowIdx?: number
}

interface State {
  idx: number
  question?: Question
  guess?: Guess
  guessedCorrectly: string[]
}

class QuestionComponent extends React.Component<Props, State> {
  constructor(props: any) {
    super(props)

    this.state = {
      idx: this.props.playNowIdx || 0,
      guessedCorrectly: []
    }

    this.handleKeyDown = this.handleKeyDown.bind(this)
  }

  public componentWillMount() {
    document.addEventListener("keydown", this.handleKeyDown, false)
    this.loadQuestion(this.state.idx)
  }

  public componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown, false)
  }

  public async loadQuestion(idx: number) {
    const id = this.props.questions[idx]
    if (id) {
      const question = await fetchQuestion(id)
      if (!(question instanceof Error)) {
        this.setState({ question, guess: undefined, idx, guessedCorrectly: [] })
      }
    }
  }

  public handleKeyDown(e: any) {
    const { idx } = this.state
    if (e.key === "ArrowRight") {
      this.loadQuestion(Math.min(this.props.questions.length - 1, idx + 1))
    } else if (e.key === "ArrowLeft") {
      this.loadQuestion(Math.max(0, idx - 1))
    }
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

      this.loadQuestion(idx)
    }, 1500)
  }

  public render() {
    const { questions } = this.props
    const { idx, guess, guessedCorrectly, question } = this.state

    if (!question) {
      return null
    }

    const { prompt, answer, redHerrings, TYPE } = question
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
