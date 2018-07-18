import * as React from "react"
import { Redirect, Route, Switch } from "react-router"
import { BrowserRouter } from "react-router-dom"

import Library from "../library"
import Login from "../login"
import Text from "../text"
import "./index.css"

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
    const loggedIn = localStorage.getItem("user")

    return (
      <BrowserRouter>
        <Switch>
          <Route
            exact={true}
            path="/login"
            render={() =>
              loggedIn ? (
                <Redirect to="/library" />
              ) : (
                <Login login={this.login.bind(this)} />
              )
            }
          />
          <Route
            path="/text"
            render={() =>
              loggedIn ? <Text user={user} /> : <Redirect to="/login" />
            }
          />
          <Route
            exact={true}
            path="/library"
            render={() =>
              loggedIn ? <Library user={user} /> : <Redirect to="/login" />
            }
          />
        </Switch>
      </BrowserRouter>
    )
  }
}

export default App
