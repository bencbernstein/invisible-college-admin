import * as React from "react"
import styled from "styled-components"
import { Route, Switch } from "react-router"
import { Router } from "react-router-dom"
import { connect } from "react-redux"

import history from "../../history"
import "./index.css"

import Login from "../login"
import Concepts from "../concept/list"
import Queues from "../queue/list"
import Images from "../image/list"
import Discover from "../discover"
import Nav from "../nav"
import TextList from "../text/list"

import ProtectedRoute, { ProtectedRouteProps } from "./protectedRoute"

import { User } from "../../models/user"
import { setUserAction } from "../../actions"

export const Container = styled.div`
  text-align: left;
  max-width: 900px;
  padding: 20px;
  margin: 0 auto;
  position: relative;
`

const contained = (Component: any) => (
  <Container>
    <Nav />
    <Component />
  </Container>
)

interface State {
  isAuthenticated: boolean
  checkedAuth: boolean
}

interface Props {
  user?: User
  dispatch: any
}

class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      isAuthenticated: true,
      checkedAuth: true
    }
  }

  public componentDidMount() {
    this.checkForAuth()
  }

  public componentWillReceiveProps(nextProps: Props) {
    if (nextProps.user && !this.props.user) {
      this.setState({ isAuthenticated: true })
    }
  }

  public async checkForAuth() {
    const json = localStorage.getItem("user")
    const user = json ? JSON.parse(json) : undefined
    if (user) {
      this.props.dispatch(setUserAction(user))
    }
    this.setState({ checkedAuth: true, isAuthenticated: user !== undefined })
  }

  public render() {
    const { checkedAuth, isAuthenticated } = this.state
    if (!checkedAuth) return null

    const defaultProtectedRouteProps: ProtectedRouteProps = {
      isAuthenticated,
      authenticationPath: "/login"
    }

    const ROUTES = [
      { path: "/concepts", Component: Concepts, exact: true },
      { path: "/images", Component: Images, exact: true },
      { path: "/queues", Component: Queues, exact: true },
      { path: "/discover", Component: Discover, exact: true },
      { path: "/library", Component: TextList },
      {
        path: "/login",
        Component: Login,
        noNav: true,
        publicRoute: true,
        exact: true
      }
    ]

    const routes = ROUTES.map(
      ({ path, Component, noNav, publicRoute, exact }) => {
        const PublicOrPrivateRoute = publicRoute ? Route : ProtectedRoute
        return (
          <PublicOrPrivateRoute
            exact={exact || false}
            key={path}
            {...defaultProtectedRouteProps}
            path={path}
            render={() => (noNav ? <Component /> : contained(Component))}
          />
        )
      }
    )

    return (
      <Router history={history}>
        <Switch>{routes}</Switch>
      </Router>
    )
  }
}

const mapStateToProps = (state: any, ownProps: any) => ({
  user: state.entities.user
})

export default connect(mapStateToProps)(App)

/*
<Route
              exact={true}
              path="/login"
              render={() => <Login login={this.login.bind(this)} />}
            />
            <ProtectedRoute
              {...defaultProtectedRouteProps}
              path="/home"
              render={() => <Home user={user!} />}
            />
            <ProtectedRoute
              {...defaultProtectedRouteProps}
              path="/admin-home"
              render={() => <AdminHome user={user!} />}
            />
            <ProtectedRoute
              {...defaultProtectedRouteProps}
              exact={true}
              path="/library"
              component={contained("collections", user)}
            />
            <ProtectedRoute
              {...defaultProtectedRouteProps}
              path="/library/:id"
              component={contained("textList", user)}
            />
            <ProtectedRoute
              {...defaultProtectedRouteProps}
              path="/text/:id"
              component={contained("text", user)}
            />
            <ProtectedRoute
              {...defaultProtectedRouteProps}
              path="/word"
              component={contained("word", user)}
            />
            <ProtectedRoute
              {...defaultProtectedRouteProps}
              path="/passage"
              component={contained("passage", user)}
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
              path="/passages"
              component={contained("passages", user)}
            />
            <ProtectedRoute
              {...defaultProtectedRouteProps}
              exact={true}
              path="/discover"
              component={contained("discover", user)}
            />
            <ProtectedRoute
              {...defaultProtectedRouteProps}
              exact={true}
              path="/gameplay"
              component={contained("gameplay", user)}
            />
            <ProtectedRoute
              {...defaultProtectedRouteProps}
              exact={true}
              path="/play"
              component={() => <Play user={user!} />}
            />
            <Route render={() => <Login login={this.login.bind(this)} />} />
            */
