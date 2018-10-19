import * as React from "react"
import { find, without, includes } from "lodash"

import { FLEXES, Box, ReadMoreTab, ExitReadMode } from "./components"
import Information from "./information"
import Answer from "./answer"
import Choices from "./choices"
import Interactive from "./interactive"
// import ProgressBar from "./progressBar"
import Prompt from "./prompt"

import { Question, questionsForUser } from "../../models/question"

import { sleep } from "../../lib/helpers"

export interface Guess {
  correct: boolean
  buttonIdx: number
}

export enum IsViewing {
  Question = "Question",
  Read = "Read"
}

interface QuestionLog {
  value: string
  id: string
  correct: boolean
}

interface Props {
  questions?: string[]
  playNowIdx?: number
}

interface State {
  question?: Question
  questions: Question[]
  guess?: Guess
  guessedCorrectly: string[]
  isViewing: IsViewing
  promptIsOverflowing: boolean
  displayAnswerSpace: boolean
  isBetweenQuestions: boolean
  questionLog: QuestionLog[]
  isInteractive: boolean
  userId: string
}

class QuestionComponent extends React.Component<Props, State> {
  constructor(props: any) {
    super(props)

    this.state = {
      guessedCorrectly: [],
      isViewing: IsViewing.Question,
      questions: [],
      promptIsOverflowing: false,
      isInteractive: false,
      displayAnswerSpace: false,
      userId: "",
      questionLog: [],
      isBetweenQuestions: false
    }
  }

  public componentWillMount() {
    const userId = window.location.search.split("?id=")[1]
    this.setState({ userId }, () =>
      this.loadQuestions(() => this.nextQuestion())
    )
  }

  public async loadQuestions(cb?: () => void) {
    const { userId, questions } = this.state
    const newQuestions = await questionsForUser(userId)
    if (!(newQuestions instanceof Error)) {
      questions.push(...newQuestions)
      this.setState({ questions }, cb)
    }
  }

  public async nextQuestion() {
    this.setState({ isBetweenQuestions: true })
    await sleep(1.5)

    const { questions } = this.state

    if (this.state.question) {
      questions.shift()
    }

    if (questions.length === 1) {
      this.loadQuestions()
    }

    const question = questions[0]

    const isInteractive = question.interactive.length > 0
    const displayAnswerSpace = includes(
      ["WORD_TO_ROOTS", "WORD_TO_CHARS"],
      question.TYPE
    )

    this.setState({
      questions,
      question,
      isInteractive,
      displayAnswerSpace,
      isBetweenQuestions: false,
      guess: undefined,
      guessedCorrectly: []
    })
  }

  public interactiveGuessed(count: number) {
    const { question } = this.state
    if (count === question!.answerCount) {
      this.nextQuestion()
    }
  }

  public guessed(choice: string, buttonIdx: number, answerValues: string[]) {
    const { guessedCorrectly } = this.state

    const correctValue = find(
      without(answerValues, ...guessedCorrectly),
      value => value === choice
    )

    if (correctValue) {
      guessedCorrectly.push(correctValue)
    }

    const guess = { correct: correctValue !== undefined, buttonIdx }
    this.setState({ guess, guessedCorrectly })

    if (correctValue) {
      guessedCorrectly.push(correctValue)
      // const done = this.props.questions.length === idx + 1
    }

    this.nextQuestion()
  }

  public render() {
    const {
      guess,
      question,
      isViewing,
      promptIsOverflowing,
      guessedCorrectly,
      isBetweenQuestions,
      displayAnswerSpace,
      isInteractive
    } = this.state

    if (!question) {
      return null
    }

    const { prompt, answer, redHerrings, TYPE, interactive } = question

    const isReadMode = isViewing === IsViewing.Read

    const noPrompt = prompt.length === 0

    const showReadMoreTab = !isReadMode && promptIsOverflowing
    // <ProgressBar completion={idx / questions.length} />

    const flexes = isInteractive
      ? FLEXES.interactive
      : FLEXES[displayAnswerSpace ? "withAnswer" : "withoutAnswer"]

    return (
      <Box isReadMode={isReadMode}>
        <Information
          isBetweenQuestions={isBetweenQuestions}
          question={question}
          isReadMode={isReadMode}
          flex={flexes.top}
        />

        {!noPrompt && (
          <Prompt
            flex={flexes.prompt}
            isInteractive={isInteractive}
            isOverflowing={(bool: boolean) =>
              this.setState({ promptIsOverflowing: bool })
            }
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

        {displayAnswerSpace && (
          <Answer
            type={TYPE}
            flex={flexes.answer}
            height={noPrompt ? "45%" : "20%"}
            guessedCorrectly={guessedCorrectly}
            answer={answer}
          />
        )}

        {isInteractive && (
          <Interactive
            flex={flexes.interactive}
            guessed={this.interactiveGuessed.bind(this)}
            data={interactive}
          />
        )}

        {redHerrings.length > 0 && (
          <Choices
            flex={flexes.choices}
            answer={answer}
            guess={guess}
            guessed={this.guessed.bind(this)}
            redHerrings={redHerrings}
            type={TYPE}
          />
        )}
      </Box>
    )
  }
}

export default QuestionComponent
