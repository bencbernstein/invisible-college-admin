import * as React from "react"
import { Route, Redirect, Switch } from "react-router"
import { Router } from "react-router-dom"
import { connect } from "react-redux"
import { get } from "lodash"

import CONFIG from "../../lib/config"
import history from "../../history"
import "./index.css"

import Login from "../login"
import Admin from "../home/admin"
import CurriculumComponent from "../curriculum"
import Concepts from "../concept/list"
import Concept from "../concept"
import EnrichPassage from "../passage/enrich"
import ErrorMessage from "../error"
import Play from "../home"
import Map from "../map"
import Question from "../question"
import Passages from "../passage/list"
import SequencesList from "../sequence/list"
import SequenceComponent from "../sequence"
import SequenceNav from "../sequence/nav"
import Queues from "../queue/list"
import FilterPassage from "../passage/filter"
import Images from "../image/list"
import Discover from "../discover"
import Nav from "../nav"
import TextList from "../text/list"
import IndexesList from "../text/indexesList"
import Text from "../text"

import { Container, JobModal } from "./components"

import ProtectedRoute, { ProtectedRouteProps } from "./protectedRoute"

import { User } from "../../interfaces/user"
import { Job } from "../../interfaces/job"
import { Curriculum } from "../../interfaces/curriculum"
import { Sequence } from "../../interfaces/sequence"

import {
  setEntity,
  removeEntity,
  fetchCurriculaAction,
  findAddressesAction
} from "../../actions"
import { colors } from "../../lib/colors"
import { sleep } from "../../lib/helpers"

const contained = (
  Component: any,
  noSearch: boolean = false,
  job?: any,
  sequence?: any
) => (
  <Container>
    <Nav noSearch={noSearch} />
    <Component />
    {job && <JobModal color={job.color}>{job.text}</JobModal>}
    {sequence && <SequenceNav />}
    <ErrorMessage />
  </Container>
)

interface State {
  isAuthenticated: boolean
  checkedAuth: boolean
  interval?: any
}

interface Props {
  user?: User
  isRob: boolean
  job?: Job
  sequence?: Sequence
  dispatch: any
  curricula: Curriculum[]
  curriculum?: Curriculum
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
    const { user, job, curricula, curriculum, isRob } = nextProps

    if (user && !this.props.user) {
      const isRob = user.id === CONFIG.ROB_ID
      this.props.dispatch(setEntity({ isRob }))
      this.setState({ isAuthenticated: true })
    }

    if (job && job.id && job.id !== get(this.props.job, "id")) {
      const interval = setInterval(() => this.pollTask(job), 1000)
      this.setState({ interval })
    }

    if (!curriculum && user && curricula.length) {
      const saved = localStorage.getItem("curriculum")
      if (isRob) {
        const curriculum = curricula.find(
          c => c.id === CONFIG.PINBALL_PUBLISHING_ID
        )
        this.props.dispatch(setEntity({ curriculum }))
      } else {
        const availableForUser = curricula.filter(
          c => user.admin || user.curricula.indexOf(c.id) > -1
        )
        const curriculum =
          availableForUser.find(c => c.id === saved) ||
          availableForUser[0] ||
          curricula[0]
        this.props.dispatch(setEntity({ curriculum }))
      }
    }
  }

  private async pollTask(job: Job) {
    const result = await fetch(`${CONFIG.MINE_API_URL}/tasks/${job.id}`, {
      method: "GET"
    })
      .then(res => res.json())
      .catch(error => console.log(error))
    if (!result) return
    const { status, es_id } = result.data
    if (["finished", "failed"].indexOf(status) === -1) return
    clearInterval(this.state.interval)
    const failed = status === "failed" || result.data.error

    if (!failed && this.props.isRob && job.text.includes("Processing")) {
      await this.findAddresses(job, es_id)
    }

    job.color = failed ? colors.red : colors.green
    job.text = failed ? "Task Failed" : "Success"
    this.props.dispatch(setEntity({ job }))
    await sleep(2)
    this.props.dispatch(removeEntity("job"))
    this.reloadPostUpload()
  }

  private async findAddresses(job: Job, esId: string) {
    const { curriculum, dispatch } = this.props
    job.text = job.text.replace("Processing", "Searching for addresses in")
    dispatch(setEntity({ job }))
    await sleep(2)
    return dispatch(
      findAddressesAction(CONFIG.ARCHITECTURE_INDEX, esId, curriculum!.id)
    )
  }

  private reloadPostUpload() {
    const path = window.location.pathname
    if (path.includes("/library/") && path.split("/").length === 3) {
      window.location.reload()
    }
  }

  private async checkForAuth() {
    const json = localStorage.getItem("user")
    const user = json ? JSON.parse(json) : undefined
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
    const { isRob, sequence, job } = this.props
    if (!checkedAuth) return null

    const defaultProtectedRouteProps: ProtectedRouteProps = {
      isAuthenticated,
      authenticationPath: "/login",
      isRob
    }

    const ROUTES = [
      {
        path: "/curricula",
        Component: CurriculumComponent,
        exact: true,
        noSearch: true
      },
      { path: "/concepts", Component: Concepts, exact: true },
      { path: "/concept/enrich/:id", Component: Concept, noSearch: true },
      { path: "/images", Component: Images, exact: true },
      { path: "/queues", Component: Queues, exact: true, noSearch: true },
      {
        path: "/play",
        Component: Play,
        exact: true,
        noNav: true
      },
      { path: "/admin-play", Component: Admin, exact: true, noNav: true },
      { path: "/discover", Component: Discover, exact: true, noSearch: true },
      { path: "/passages", Component: Passages, exact: true, noSearch: true },
      {
        path: "/question",
        Component: Question,
        publicRoute: true,
        noNav: true
      },
      { path: "/library", Component: IndexesList, exact: true, noSearch: true },
      { path: "/map/:id", Component: Map, exact: true, noSearch: true },
      {
        path: "/sequences",
        Component: SequencesList,
        exact: true,
        noSearch: true
      },
      { path: "/sequence/:id", Component: SequenceComponent, noSearch: true },
      { path: "/library/:index", Component: TextList, exact: true },
      { path: "/library/:index/:id", Component: Text, noSearch: true },
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
            isRob={isRob}
            render={() =>
              noNav ? (
                <Component />
              ) : (
                contained(Component, noSearch, job, sequence)
              )
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
  user: state.entities.user,
  job: state.entities.job,
  error: state.entities.error,
  curricula: state.entities.curricula || [],
  curriculum: state.entities.curriculum,
  sequence: state.entities.sequence,
  isRob: state.entities.isRob
})

export default connect(mapStateToProps)(App)
