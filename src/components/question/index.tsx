import * as React from "react"
import * as _ from "underscore"
import { Redirect } from "react-router"

import { Box, TopInfo, ReadMoreTab, ExitReadMode } from "./components"
import Icon from "../common/icon"

import Answer from "./answer"
import Choices from "./choices"
// import ProgressBar from "./progressBar"
import Prompt from "./prompt"

import { Question, fetchQuestion, fetchQuestions } from "../../models/question"

import DeleteIcon from "../../lib/images/icon-delete.png"

export interface Guess {
  correct: boolean
  buttonIdx: number
}

interface Props {
  questions?: string[]
  playNowIdx?: number
}

interface State {
  idx: number
  question?: Question
  questions: string[]
  guess?: Guess
  guessedCorrectly: string[]
  isViewing: IsViewing
  redirect?: string
  promptIsOverflowing: boolean
}

export enum IsViewing {
  Question = "Question",
  Read = "Read"
}

class QuestionComponent extends React.Component<Props, State> {
  constructor(props: any) {
    super(props)

    this.state = {
      idx: this.props.playNowIdx || 0,
      guessedCorrectly: [],
      isViewing: IsViewing.Question,
      questions: [],
      promptIsOverflowing: false
    }
  }

  public async componentWillMount() {
    const questions = await fetchQuestions("PART_OF_SPEECH")
    if (!(questions instanceof Error)) {
      const ids = questions.map(q => q.id)
      this.setState({ questions: ids }, () => this.loadQuestion(0))
    }
  }

  public async loadQuestion(idx: number) {
    const id = this.state.questions[idx]
    if (id) {
      const question = await fetchQuestion(id)
      if (!(question instanceof Error)) {
        this.setState({ question, guess: undefined, idx, guessedCorrectly: [] })
      }
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
        // const done = this.props.questions.length === idx + 1
        idx += 1
      }

      this.loadQuestion(idx)
    }, 1500)
  }

  public promptIsOverflowing(bool: boolean) {
    this.setState({ promptIsOverflowing: bool })
  }

  public render() {
    const {
      guess,
      guessedCorrectly,
      question,
      isViewing,
      redirect,
      promptIsOverflowing
    } = this.state

    if (redirect) {
      return <Redirect to={redirect} />
    } else if (!question) {
      return null
    }

    const { prompt, answer, redHerrings, TYPE } = question

    const isReadMode = isViewing === IsViewing.Read

    const noPrompt = prompt.length === 0

    const showReadMoreTab = !isReadMode && promptIsOverflowing
    // <ProgressBar completion={idx / questions.length} />

    return (
      <Box isReadMode={isReadMode}>
        <TopInfo>
          {!isReadMode && (
            <Icon
              onClick={() => this.setState({ redirect: "/home" })}
              pointer={true}
              src={DeleteIcon}
            />
          )}
        </TopInfo>

        {!noPrompt && (
          <Prompt
            isOverflowing={this.promptIsOverflowing.bind(this)}
            isReadMode={isReadMode}
            type={TYPE}
            prompt={prompt}
          />
        )}

        {showReadMoreTab && (
          <div>
            <ReadMoreTab
              onClick={() => this.setState({ isViewing: IsViewing.Read })}
            >
              Read
            </ReadMoreTab>
          </div>
        )}

        {isReadMode && (
          <ExitReadMode
            onClick={() => this.setState({ isViewing: IsViewing.Question })}
          >
            Back
          </ExitReadMode>
        )}

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
      </Box>
    )
  }
}

export default QuestionComponent
