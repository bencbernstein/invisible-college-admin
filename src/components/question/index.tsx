import * as React from "react"
import { find, without, includes } from "lodash"

import { FLEXES, Box, ReadMoreTab, ExitReadMode } from "./components"
import Information from "./information"
import Answer from "./answer"
import Choices from "./choices"
import Interactive from "./interactive"
// import ProgressBar from "./progressBar"
import Prompt from "./prompt"

import {
  Question,
  QuestionLog,
  questionsForUser,
  QuestionType,
  saveQuestionsForUser
} from "../../models/question"

import { sleep } from "../../lib/helpers"

export interface Guess {
  correct: boolean
  buttonIdx: number
}

export enum IsViewing {
  Question = "Question",
  Read = "Read"
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
  correct: boolean
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
      correct: true,
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

  public record(question: Question) {
    const { correct, userId, questionLog } = this.state
    const { sources } = question
    const type = sources.word ? QuestionType.word : QuestionType.passage
    const { id, value } =
      type === QuestionType.word ? sources.word! : sources.text!
    questionLog.push({ correct, type, id, value })
    if (questionLog.length === 1) {
      saveQuestionsForUser(userId, questionLog) // TODO: - what to do with error?
      this.setState({ questionLog: [] })
    } else {
      this.setState({ questionLog })
    }
  }

  public async nextQuestion() {
    this.setState({ isBetweenQuestions: true })
    await sleep(2)

    const { questions } = this.state

    if (this.state.question) {
      this.record(this.state.question)
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
      correct: true,
      guessedCorrectly: []
    })
  }

  public interactiveGuessed(correct: boolean, count: number) {
    const { question } = this.state
    if (count === question!.answerCount) {
      this.nextQuestion()
    }
    if (!correct) {
      this.setState({ correct: false })
    }
  }

  public guessed(choice: string, buttonIdx: number, answerValues: string[]) {
    const { guessedCorrectly } = this.state

    const correctValue = find(
      without(answerValues, ...guessedCorrectly),
      value => value === choice
    )
    const correct = correctValue !== undefined && this.state.correct
    const guess = { correct, buttonIdx }

    if (correctValue) {
      guessedCorrectly.push(correctValue)
    }

    this.setState({ guess, guessedCorrectly, correct }, async () => {
      if (correctValue) {
        this.nextQuestion()
      } else {
        await sleep(1)
        this.setState({ guess: undefined })
      }
    })
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
      isInteractive,
      correct
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
          correct={correct}
          isBetweenQuestions={isBetweenQuestions}
          question={question}
          isReadMode={isReadMode}
          flex={flexes.top}
        />

        {!noPrompt && (
          <Prompt
            questionType={
              question.sources.word ? QuestionType.word : QuestionType.passage
            }
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
            isBetweenQuestions={isBetweenQuestions}
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
