import * as React from "react"
import { Route, Switch } from "react-router"
import { Router } from "react-router-dom"

import Container from "./container"
import Login from "../login"

import history from "../../history"

import "./index.css"

import ProtectedRoute, { ProtectedRouteProps } from "./protectedRoute"

import {
  fetchUserFromStorage,
  saveUserToStorage,
  User
} from "../../models/user"

import { fetchKeywords, Keywords } from "../../models/word"
// import { fetchUser } from "../../models/user"

// import {
//   fetchQuestionsForWord,
//   fetchQuestionsForText,
//   Question
// } from "../../models/question"

interface State {
  user?: User
  keywords?: Keywords
  isAuthenticated: boolean
  checkedAuth: boolean
}

const contained = (
  component: string,
  user?: User,
  keywords?: Keywords
) => () => <Container component={component} user={user} keywords={keywords} />

class App extends React.Component<any, State> {
  constructor(props: any) {
    super(props)

    this.state = {
      isAuthenticated: false,
      checkedAuth: false
    }
  }

  public componentDidMount() {
    this.checkForAuth()
    this.loadKeywords()
  }

  public async checkForAuth() {
    const checkedAuth = true
    const user = fetchUserFromStorage()
    const isAuthenticated = user !== undefined
    this.setState({ user, checkedAuth, isAuthenticated })
    // const result = await fetchUser(user.id)
    // if (result instanceof Error) {
    //   localStorage.removeItem("user")
    // }
  }

  public async loadKeywords() {
    const keywords = await fetchKeywords()
    if (!(keywords instanceof Error)) {
      this.setState({ keywords: JSON.parse(keywords) })
    }
  }

  public login(user: User, cb: () => void) {
    saveUserToStorage(user)
    this.setState({ user, isAuthenticated: true }, cb)
  }

  public render() {
    const { keywords, user, checkedAuth } = this.state

    if (!checkedAuth) {
      return null
    }

    const defaultProtectedRouteProps: ProtectedRouteProps = {
      isAuthenticated: this.state.isAuthenticated,
      authenticationPath: "/login"
    }

    return (
      <Router history={history}>
        <Switch>
          <Route
            exact={true}
            path="/login"
            render={() => <Login login={this.login.bind(this)} />}
          />
          <ProtectedRoute
            {...defaultProtectedRouteProps}
            path="/text"
            component={contained("text", user, keywords)}
          />
          <ProtectedRoute
            {...defaultProtectedRouteProps}
            path="/word"
            component={contained("word", user, keywords)}
          />
          <ProtectedRoute
            {...defaultProtectedRouteProps}
            path="/sequence"
            component={contained("sequence", user)}
          />
          <ProtectedRoute
            {...defaultProtectedRouteProps}
            path="/passage-sequence"
            component={contained("passageSequence", user)}
          />
          <ProtectedRoute
            {...defaultProtectedRouteProps}
            exact={true}
            path="/library"
            component={contained("library", user)}
          />
          <ProtectedRoute
            {...defaultProtectedRouteProps}
            exact={true}
            path="/gameplay"
            component={contained("gameplay", user)}
          />
        </Switch>
      </Router>
    )
  }
}

export default App
