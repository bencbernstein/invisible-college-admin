/* tslint:disable:max-classes-per-file */

import * as React from "react"
import { Redirect, Route, Switch } from "react-router"
import { Router } from "react-router-dom"
import styled from "styled-components"

import history from "../../history"

import Library from "../library"
import Login from "../login"
import Nav from "../nav"
import QuestionComponent from "../question"
import Text from "../text"
import Word from "../word"
import WordModal from "../word/modal"
import "./index.css"

import {
  fetchUserFromStorage,
  saveUserToStorage,
  User
} from "../../models/user"

import { fetchKeywords } from "../../models/word"

import { fetchQuestionsForWord, Question } from "../../models/question"

import { getWordAtPoint } from "../../lib/helpers"

export interface Keywords {
  choices: string[]
  words: string[]
}

interface State {
  user?: User
  keywords?: Keywords
}

class App extends React.Component<any, State> {
  constructor(props: any) {
    super(props)
    this.state = {}
  }

  public componentDidMount() {
    this.loadUser()
    this.loadKeywords()
  }

  public loadUser() {
    const user = fetchUserFromStorage()
    this.setState({ user })
  }

  public async loadKeywords() {
    const keywords = await fetchKeywords()
    this.setState({ keywords })
  }

  public login(user: User) {
    saveUserToStorage(user)
    this.setState({ user })
  }

  public render() {
    const { keywords, user } = this.state

    return (
      <Router history={history}>
        <Switch>
          <Route
            exact={true}
            path="/login"
            render={() =>
              <Login login={this.login.bind(this)} />
            }
          />
          <Route path="/text" component={contained("text", user, keywords)} />
          <Route path="/word" component={contained("word", user, keywords)} />
          <Route
            exact={true}
            path="/library"
            component={contained("library", user)}
          />
        </Switch>
      </Router>
    )
  }
}

interface OuterContainerProps {
  isPlaying: boolean
}

const OuterContainer = styled.div`
  text-align: left;
  max-width: 900px;
  margin: 0 auto;
  margin-top: 25px;
  margin-bottom: 25px;
  position: ${(p: OuterContainerProps) => (p.isPlaying ? "fixed" : "relative")};
  overflow: ${(p: OuterContainerProps) => p.isPlaying && "hidden"};
`

const contained = (
  component: string,
  user?: User,
  keywords?: Keywords
) => () => <Container component={component} user={user} keywords={keywords} />

interface ContainerProps {
  component: string
  user?: User
  keywords?: Keywords
}

interface ContainerState {
  wordBelowCursor: string | null
  holdingShift: boolean
  questions: Question[]
}

class Container extends React.Component<ContainerProps, ContainerState> {
  constructor(props: any) {
    super(props)
    this.state = {
      holdingShift: false,
      wordBelowCursor: null,
      questions: []
    }

    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleKeyUp = this.handleKeyUp.bind(this)
  }

  public componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown)
    document.addEventListener("keyup", this.handleKeyUp)
  }

  public componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown)
    document.removeEventListener("keyup", this.handleKeyUp)
  }

  public handleKeyDown(e: any) {
    if (e.key === "Shift") {
      this.setState({ holdingShift: true })
    }
  }

  public handleKeyUp(e: any) {
    if (e.key === "Shift") {
      this.setState({ holdingShift: false })
    }
  }

  public handleMouseMove(e: React.MouseEvent) {
    if (this.state.holdingShift) {
      const wordBelowCursor = getWordAtPoint(e.target, e.clientX, e.clientY)
      if (wordBelowCursor !== this.state.wordBelowCursor) {
        this.setState({ wordBelowCursor })
      }
    }
  }

  public async play(link: string) {
    const questions = await fetchQuestionsForWord(link)
    if (!(questions instanceof Error)) {
      this.setState({ questions })
    }
  }

  public render() {
    const { holdingShift, wordBelowCursor, questions } = this.state
    const { component, user, keywords } = this.props
    const loggedIn = localStorage.getItem("user")

    if (!loggedIn && component !== "login") {
      return <Redirect to={"/login"} />
    }

    const definedWords = keywords ? keywords.words : []

    const displayWordModal =
      wordBelowCursor && definedWords.indexOf(wordBelowCursor) === -1

    const wordModal = displayWordModal && (
      <WordModal
        remove={() => this.setState({ wordBelowCursor: null })}
        value={wordBelowCursor!}
      />
    )

    const questionsModal = questions.length > 0 && (
      <QuestionComponent
        done={() => this.setState({ questions: [] })}
        questions={questions}
      />
    )

    return user ? (
      <OuterContainer
        isPlaying={questions.length > 0}
        onMouseMove={this.handleMouseMove.bind(this)}
      >
        <Nav holdingShift={holdingShift} user={user} />

        {
          {
            library: <Library />,
            text: <Text user={user} keywords={keywords} />,
            word: <Word play={this.play.bind(this)} keywords={keywords} />
          }[component]
        }

        {questionsModal}
        {wordModal}
      </OuterContainer>
    ) : null
  }
}

export default App
