import * as React from "react"
import { find, without, uniq, get } from "lodash"

import { FLEXES, Box, ReadMoreTab, ExitReadMode } from "./components"
import Information from "./information"
import Answer from "./answer"
import Choices from "./choices"
import Interactive from "./interactive"
import OnCorrect from "./onCorrect"
import Prompt from "./prompt"

import {
  Question,
  QuestionLog,
  questionsForUser,
  saveQuestionsForUser,
  userSawFactoid,
  questionsForType
} from "../../models/question"

import { sleep } from "../../lib/helpers"

export interface Image {
  base64: string
}

export interface Factoid {
  title: string
  value: string
  id: string
}

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
  gameElements: Array<Question | Image | Factoid>
  onCorrectElement?: Image | Factoid
  isInteractive: boolean
  correct: boolean
  userId?: string
  type?: string
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
      gameElements: [],
      displayAnswerSpace: false,
      userId: "",
      correct: true,
      questionLog: [],
      isBetweenQuestions: false
    }
  }

  public componentWillMount() {
    console.log("componentWillMount")
    const userId = window.location.search.split("?id=")[1]
    const type = window.location.search.split("?type=")[1]
    this.setState({ userId, type }, () =>
      this.loadQuestions(() => this.nextQuestion(0))
    )
  }

  public async loadQuestions(cb?: () => void) {
    const { userId, gameElements, type } = this.state
    const newElements = await (type
      ? questionsForType(type)
      : questionsForUser(userId!)) // TODO: - remove !
    if (!(newElements instanceof Error)) {
      const parsed = JSON.parse(newElements)
      console.log(parsed)
      console.log(`Fetched ${parsed.length} new game elements.`)
      gameElements.push(...parsed)
      this.setState({ gameElements }, cb)
    }
  }

  public record(question: Question) {
    const { correct, userId, questionLog } = this.state
    const { sources } = question
    const type = question.passageOrWord
    const { id, value } = type === "word" ? sources.word! : sources.passage!
    questionLog.push({ correct, type, id, value })
    if (questionLog.length === 1 && userId) {
      saveQuestionsForUser(userId, questionLog) // TODO: - what to do with error?
      this.setState({ questionLog: [] })
    } else {
      this.setState({ questionLog })
    }
  }

  public async nextQuestion(sleepDuration: number = 2) {
    console.log("\n* nextQuestion *")
    const { gameElements, question, onCorrectElement, userId } = this.state
    this.setState({ isBetweenQuestions: true })
    await sleep(sleepDuration)

    if (question) {
      this.record(question)
    } else if (get(onCorrectElement as Factoid, "title") && userId) {
      const factoid = onCorrectElement as Factoid
      userSawFactoid(userId, factoid.id)
    }

    const element = gameElements.shift()

    if ((element as Question).TYPE) {
      this.setQuestion(element as Question)
    } else if ((element as Image).base64) {
      this.setState({ onCorrectElement: element as Image, question: undefined })
    } else if ((element as Factoid).title) {
      this.setState({
        onCorrectElement: element as Factoid,
        question: undefined
      })
    }

    if (gameElements.length === 1) {
      this.loadQuestions()
    }

    this.setState({ gameElements })
  }

  public setQuestion(question: Question) {
    this.setState({
      question,
      onCorrectElement: undefined,
      isInteractive: question.interactive.length > 0,
      displayAnswerSpace: ["Roots", "Chars"].some(
        s => question.TYPE.indexOf(s) > -1
      ),
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

    const answers = without(answerValues, ...guessedCorrectly)
    const correctValue = find(answers, value => value === choice)
    const correct = correctValue !== undefined && this.state.correct
    const guess = { correct: correctValue !== undefined, buttonIdx }

    if (correctValue) {
      guessedCorrectly.push(correctValue)
    }

    this.setState({ guess, guessedCorrectly, correct }, async () => {
      const done = uniq(answerValues).length === guessedCorrectly.length
      if (done) {
        this.nextQuestion()
      } else {
        await sleep(correct ? 0.5 : 1)
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
      correct,
      onCorrectElement
    } = this.state

    if (onCorrectElement) {
      return (
        <OnCorrect
          nextQuestion={this.nextQuestion.bind(this)}
          element={onCorrectElement}
        />
      )
    }

    if (!question) {
      return null
    }

    const { prompt, answer, redHerrings, TYPE, interactive } = question

    const isReadMode = isViewing === IsViewing.Read

    const noPrompt = prompt.length === 0

    const showReadMoreTab = !isReadMode && promptIsOverflowing

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
            questionType={question.passageOrWord}
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
