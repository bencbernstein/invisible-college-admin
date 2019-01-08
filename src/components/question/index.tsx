import * as React from "react"
import { Redirect } from "react-router"
import { find, without, uniq } from "lodash"
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

import { Question } from "../../interfaces/question"
import { User } from "../../interfaces/user"
import { Curriculum } from "../../interfaces/curriculum"

import { fetchQuestionsForSequenceAction } from "../../actions"

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
  questions: Question[]
}

interface State {
  correct: boolean
  displayAnswerSpace?: boolean
  displayIntermission?: boolean
  guess?: Guess
  guessedCorrectly: string[]
  isBetweenQuestions?: boolean
  isInteractive?: boolean
  isReadMode?: boolean
  redirect?: string
  qStartTime: moment.Moment
  onCorrectElement?: Image | Factoid
  promptIsOverflowing?: boolean
  question?: Question
}

class QuestionComponent extends React.Component<Props, State> {
  constructor(props: any) {
    super(props)

    this.state = {
      correct: true,
      qStartTime: moment(),
      guessedCorrectly: []
    }
  }

  public componentWillMount() {
    this.setupGame()
  }

  private async setupGame() {
    const id = window.location.search.split("?id=")[1]
    await this.props.dispatch(fetchQuestionsForSequenceAction(id))
    this.nextQuestion(0)
  }

  private async nextQuestion(sleepDuration: number = 2) {
    const { questions } = this.props
    this.setState({ isBetweenQuestions: true })
    await sleep(sleepDuration)
    const question = questions.shift()
    if (!question) return
    this.setQuestion(question!)
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
      onCorrectElement,
      promptIsOverflowing,
      redirect,
      qStartTime
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
            completion={0.5}
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
          />
        )}
        {this.state.question && questionComponents(this.state.question)}
      </div>
    )
  }
}

const mapStateToProps = (state: any, ownProps: any) => ({
  user: state.entities.user,
  curriculum: state.entities.curriculum,
  questions: state.entities.questions || []
})

export default connect(mapStateToProps)(QuestionComponent)
