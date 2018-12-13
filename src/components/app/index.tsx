import * as React from "react"
import styled from "styled-components"
import { Route, Redirect, Switch } from "react-router"
import { Router } from "react-router-dom"
import { connect } from "react-redux"

import history from "../../history"
import "./index.css"

import Login from "../login"
import Curriculum from "../curriculum"
import Concepts from "../concept/list"
import Concept from "../concept"
import Passages from "../passage/list"
import Queues from "../queue/list"
import FilterPassage from "../passage/filter"
import EnrichPassage from "../passage/enrich"
import Images from "../image/list"
import Discover from "../discover"
import Nav from "../nav"
import TextList from "../text/list"
import IndexesList from "../text/indexesList"
import Text from "../text"

import ProtectedRoute, { ProtectedRouteProps } from "./protectedRoute"

import { User } from "../../interfaces/user"
import { setEntity, fetchCurriculaAction } from "../../actions"

const Container = styled.div`
  text-align: left;
  max-width: 900px;
  padding: 20px;
  margin: 0 auto;
  position: relative;
`

const contained = (Component: any, noSearch: boolean = false) => (
  <Container>
    <Nav noSearch={noSearch} />
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
    this.loadCurricula()
  }

  public componentWillReceiveProps(nextProps: Props) {
    if (nextProps.user && !this.props.user) {
      this.setState({ isAuthenticated: true })
    }
  }

  private async checkForAuth() {
    const json = localStorage.getItem("user")
    const user = json ? JSON.parse(json) : undefined
    console.log(user)
    if (user) {
      this.props.dispatch(setEntity({ user }))
    }
    this.setState({ checkedAuth: true, isAuthenticated: user !== undefined })
  }

  private loadCurricula() {
    this.props.dispatch(fetchCurriculaAction())
  }

  public render() {
    const { checkedAuth, isAuthenticated } = this.state
    if (!checkedAuth) return null

    const defaultProtectedRouteProps: ProtectedRouteProps = {
      isAuthenticated,
      authenticationPath: "/login"
    }

    const ROUTES = [
      {
        path: "/curricula",
        Component: Curriculum,
        exact: true,
        noSearch: true
      },
      { path: "/concepts", Component: Concepts, exact: true },
      { path: "/concept/enrich/:id", Component: Concept, noSearch: true },
      { path: "/images", Component: Images, exact: true },
      { path: "/queues", Component: Queues, exact: true, noSearch: true },
      { path: "/discover", Component: Discover, exact: true, noSearch: true },
      { path: "/passages", Component: Passages, exact: true, noSearch: true },
      { path: "/library", Component: IndexesList, exact: true, noSearch: true },
      { path: "/library/:id", Component: TextList, exact: true },
      { path: "/library/text/:id", Component: Text, noSearch: true },
      { path: "/passage/filter/:id", Component: FilterPassage, noSearch: true },
      { path: "/passage/enrich/:id", Component: EnrichPassage, noSearch: true },
      {
        path: "/login",
        Component: Login,
        noNav: true,
        publicRoute: true,
        exact: true
      }
    ]

    const routes = ROUTES.map(
      ({ path, Component, noNav, publicRoute, exact, noSearch }) => {
        const PublicOrPrivateRoute = publicRoute ? Route : ProtectedRoute
        return (
          <PublicOrPrivateRoute
            exact={exact || false}
            key={path}
            {...defaultProtectedRouteProps}
            path={path}
            render={() =>
              noNav ? <Component /> : contained(Component, noSearch)
            }
          />
        )
      }
    ).concat(<Route key="0" render={() => <Redirect to="/login" />} />)

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
