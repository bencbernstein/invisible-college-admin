/* tslint:disable:max-classes-per-file */

import * as React from "react"
import { Redirect, Route, Switch } from "react-router"
import { BrowserRouter } from "react-router-dom"
import styled from "styled-components"

import { alertModal } from "../common/modal"
import Library from "../library"
import Login from "../login"
import Nav from "../nav"
import Text from "../text"
import Word from "../word"
import WordModal from "../word/modal"
import "./index.css"

import { getWordAtPoint } from "../../lib/helpers"

interface State {
  user?: any
}

class App extends React.Component<any, State> {
  constructor(props: any) {
    super(props)
    this.state = {}
  }

  public componentDidMount() {
    const user = localStorage.getItem("user")
    if (user) {
      this.setState({ user: JSON.parse(user) })
    }
  }

  public login(user: any) {
    localStorage.setItem("user", JSON.stringify(user))
    this.setState({ user })
  }

  public render() {
    const { user } = this.state

    return (
      <BrowserRouter>
        <Switch>
          <Route
            exact={true}
            path="/login"
            render={() => <Login login={this.login.bind(this)} />}
          />
          <Route path="/text" component={contained("text", user)} />
          <Route path="/word" component={contained("word", user)} />
          <Route
            exact={true}
            path="/library"
            component={contained("library", user)}
          />
        </Switch>
      </BrowserRouter>
    )
  }
}

const OuterContainer = styled.div`
  text-align: left;
  max-width: 900px;
  margin: 0 auto;
  margin-top: 25px;
  margin-bottom: 25px;
  position: relative;
`

const contained = (component: string, user: any) => () => (
  <Container component={component} user={user} />
)

interface ContainerProps {
  component: string
  user: any
}

export interface Alert {
  message: string
  success: boolean
}

interface ContainerState {
  wordBelowCursor: string | null
  holdingShift: boolean
  alert?: Alert
}

class Container extends React.Component<ContainerProps, ContainerState> {
  constructor(props: any) {
    super(props)
    this.state = {
      holdingShift: false,
      wordBelowCursor: null
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

  public alert(alert: Alert) {
    this.setState({ alert })
    setTimeout(() => {
      this.setState({ alert: undefined })
    }, 1000)
  }

  public render() {
    const { alert, holdingShift, wordBelowCursor } = this.state

    const { component, user } = this.props

    const loggedIn = localStorage.getItem("user") || true

    if (!loggedIn && component !== "login") {
      return <Redirect to={"/login"} />
    }

    return (
      <OuterContainer onMouseMove={this.handleMouseMove.bind(this)}>
        <Nav holdingShift={holdingShift} user={user} />

        {
          {
            library: <Library />,
            text: <Text />,
            word: <Word />
          }[component]
        }

        {wordBelowCursor && (
          <WordModal alert={this.alert.bind(this)} value={wordBelowCursor} />
        )}

        {alert && alertModal(alert)}
      </OuterContainer>
    )
  }
}

export default App
