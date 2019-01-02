import * as React from "react"
import { Redirect } from "react-router"
import { find, without, uniq, get, extend } from "lodash"
import * as moment from "moment"
import { connect } from "react-redux"

import { FLEXES, Box, ReadMoreTab, ExitReadMode } from "./components"
import Information from "./information"
import Intermission from "./intermission"
import Answer from "./answer"
import Choices from "./choices"
import Interactive from "./interactive"
import OnCorrect from "./onCorrect"
import Prompt from "./prompt"

import { sleep } from "../../lib/helpers"
import { calcProgress } from "./helpers"

import { Question, QuestionLog } from "../../interfaces/question"
import { User } from "../../interfaces/user"
import { Curriculum } from "../../interfaces/curriculum"

import {
  fetchQuestionsForTypeAction,
  fetchQuestionsForUserAction,
  userSawFactoidAction,
  saveQuestionsForUserAction,
  clearUserHistoryAction
} from "../../actions"

export interface Image {
  url: string
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

interface Props {
  user: User
  dispatch: any
  curriculum: Curriculum
}

interface State {
  correct: boolean
  displayAnswerSpace?: boolean
  displayIntermission?: boolean
  guess?: Guess
  guessedCorrectly: string[]
  gameElements: Array<Question | Image | Factoid>
  isBetweenQuestions?: boolean
  isInteractive?: boolean
  isReadMode?: boolean
  redirect?: string
  level: number
  onCorrectElement?: Image | Factoid
  promptIsOverflowing?: boolean
  qCounter: number
  qsForLevel: number
  qsAnsweredForLevel: number
  qStartTime: moment.Moment
  question?: Question
  questions: Question[]
  questionLog: QuestionLog[]
  type?: string
}

class QuestionComponent extends React.Component<Props, State> {
  constructor(props: any) {
    super(props)

    this.state = {
      correct: true,
      gameElements: [],
      guessedCorrectly: [],
      questionLog: [],
      questions: [],
      qsAnsweredForLevel: 0,
      qCounter: 0,
      qsForLevel: 0,
      qStartTime: moment(),
      level: 0
    }
  }

  public componentWillMount() {
    if (!this.props.user) return this.setState({ redirect: "play" })
    this.setupGame(this.props.user)
  }

  private async setupGame(user: User, simulate: boolean = false) {
    const { qsForLevel, qsAnsweredForLevel, level } = calcProgress(
      user.questionsAnswered
    )
    const type = window.location.search.split("?type=")[1]
    const state = { type, qsForLevel, qsAnsweredForLevel, level }

    await this.props.dispatch(clearUserHistoryAction(user.id))

    if (simulate) {
      let i = 0
      while (true) {
        await this.loadQuestions()

        const simulatedResults = this.state.gameElements
          .filter(element => (element as Question).TYPE)
          .map((element: Question) => ({
            correct: Math.random() > 0.25,
            id:
              get(element.sources.word, "id") ||
              get(element.sources.passage, "id"),
            value: get(element.sources.word, "value"),
            type: element.sources.word ? "word" : "passage"
          }))

        await this.props.dispatch(
          saveQuestionsForUserAction(user.id, simulatedResults)
        )

        i += 1
        if (i === 5) {
          console.log("done!")
          break
        }
      }
    } else {
      this.setState(state, () => this.loadQuestions(() => this.nextQuestion(0)))
    }
  }

  private async loadQuestions(cb?: () => void): Promise<any | undefined> {
    const { gameElements, type } = this.state
    const { user, dispatch, curriculum } = this.props
    const result = type
      ? await dispatch(fetchQuestionsForTypeAction(type!))
      : await dispatch(fetchQuestionsForUserAction(user.id, curriculum.id))
    const questions = result.response.questions
    console.log(gameElements)
    gameElements.push(...questions)
    this.setState({ gameElements }, cb)
  }

  private record(question: Question) {
    const { correct, questionLog } = this.state

    const { sources } = question
    const type = question.passageOrWord
    const { id, value } = type === "word" ? sources.word! : sources.passage!
    questionLog.push({ correct, type, id, value })

    if (questionLog.length === 3) {
      this.props.dispatch(
        saveQuestionsForUserAction(this.props.user.id, questionLog)
      )
      this.setState({ questionLog: [] })
    } else {
      this.setState({ questionLog })
    }
  }

  private async nextQuestion(sleepDuration: number = 2) {
    const {
      gameElements,
      question,
      onCorrectElement,
      qsAnsweredForLevel,
      qsForLevel,
      qCounter
    } = this.state

    this.setState({ isBetweenQuestions: true })
    await sleep(sleepDuration)

    if (question) {
      this.record(question)
    } else if (get(onCorrectElement as Factoid, "title")) {
      const factoid = onCorrectElement as Factoid
      this.props.dispatch(userSawFactoidAction(this.props.user.id, factoid.id))
    }

    const element = gameElements.shift()

    if ((element as Question).TYPE) {
      this.setQuestion(element as Question)
    } else if ((element as Image).url) {
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

    const displayIntermission = qsAnsweredForLevel === qsForLevel
    const state = { gameElements, displayIntermission }
    if (displayIntermission) {
      const questionsAnswered = this.props.user!.questionsAnswered + qCounter
      extend(state, calcProgress(questionsAnswered))
    }
    this.setState(state)
  }

  private setQuestion(question: Question) {
    this.setState({
      correct: true,
      displayAnswerSpace: ["Roots", "Chars"].some(
        s => question.TYPE.indexOf(s) > -1
      ),
      isBetweenQuestions: false,
      isInteractive: question.interactive.length > 0,
      guess: undefined,
      guessedCorrectly: [],
      qStartTime: moment(),
      question
    })
  }

  private interactiveGuessed(correct: boolean, count: number) {
    const { question } = this.state
    if (count === question!.answerCount) {
      this.nextQuestion()
    }
    if (!correct) {
      this.setState({ correct: false })
    }
  }

  private guessed(choice: string, buttonIdx: number, answerValues: string[]) {
    const { guessedCorrectly } = this.state
    let { qsAnsweredForLevel, qCounter } = this.state

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
        qsAnsweredForLevel += 1
        qCounter += 1
        this.setState({ qsAnsweredForLevel, qCounter }, this.nextQuestion)
      } else {
        await sleep(correct ? 0.5 : 1)
        this.setState({ guess: undefined })
      }
    })
  }

  private onCorrectContinue() {
    this.setState({ onCorrectElement: undefined }, () => {
      if (!this.state.displayIntermission) {
        this.nextQuestion(0)
      }
    })
  }

  public render() {
    const {
      correct,
      displayAnswerSpace,
      displayIntermission,
      guess,
      guessedCorrectly,
      isBetweenQuestions,
      isReadMode,
      isInteractive,
      level,
      onCorrectElement,
      promptIsOverflowing,
      qsAnsweredForLevel,
      qsForLevel,
      qStartTime,
      redirect
    } = this.state

    if (redirect) return <Redirect to={redirect} />

    const questionComponents = (question: Question) => {
      const { prompt, answer, redHerrings, TYPE, interactive } = question

      const noPrompt = prompt.length === 0
      const showReadMoreTab = !isReadMode && promptIsOverflowing
      const flexes = isInteractive
        ? FLEXES.interactive
        : FLEXES[displayAnswerSpace ? "withAnswer" : "withoutAnswer"]

      return (
        <Box isReadMode={isReadMode}>
          <Information
            correct={correct}
            qStartTime={qStartTime}
            isBetweenQuestions={isBetweenQuestions}
            question={question}
            completion={qsAnsweredForLevel / qsForLevel}
            flex={flexes.top}
            isWordQType={question.passageOrWord === "word"}
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
              <ReadMoreTab onClick={() => this.setState({ isReadMode: true })}>
                Read
              </ReadMoreTab>
            </div>
          )}

          {isReadMode && (
            <ExitReadMode onClick={() => this.setState({ isReadMode: false })}>
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
              isBetweenQuestions={isBetweenQuestions}
              guess={guess}
              guessed={this.guessed.bind(this)}
              redHerrings={redHerrings}
              type={TYPE}
            />
          )}
        </Box>
      )
    }

    return (
      <div id="game" style={{ width: "100%", height: "100%" }}>
        {onCorrectElement && (
          <OnCorrect
            nextQuestion={this.onCorrectContinue.bind(this)}
            element={onCorrectElement}
          />
        )}
        {displayIntermission && (
          <Intermission
            continue={() => this.setState({ displayIntermission: false })}
            level={level}
          />
        )}
        {this.state.question && questionComponents(this.state.question)}
      </div>
    )
  }
}

const mapStateToProps = (state: any, ownProps: any) => ({
  user: state.entities.user,
  curriculum: state.entities.curriculum
})

export default connect(mapStateToProps)(QuestionComponent)
