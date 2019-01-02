import * as React from "react"
import { connect } from "react-redux"
import { Redirect } from "react-router"
import { get, sortBy } from "lodash"
import { Link } from "react-router-dom"

import Search from "../search"
import Text from "../common/text"
import Header from "../common/header"

import { Modal, ModalButton, Button } from "./components"

import { setEntity } from "../../actions"
import { User } from "../../interfaces/user"

import { formatName } from "../../lib/helpers"
import { colors } from "../../lib/colors"
import FlexedDiv from "../common/flexedDiv"

import { Curriculum } from "../../interfaces/curriculum"

interface Props {
  user?: User
  curriculum?: Curriculum
  noSearch: boolean
  dispatch: any
  curricula: Curriculum[]
  isRob: boolean
}

interface State {
  redirect?: string
  displayModal: boolean
}

class Nav extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      displayModal: false
    }
  }

  public componentDidMount() {
    const { curricula, user } = this.props
    if (curricula.length && !this.props.curriculum && user) {
      const curriculum = curricula.filter(
        ({ id }) => user.curricula.indexOf(id) > -1
      )[0]
      this.setCurriculum(curriculum)
    }
  }

  public componentWillReceiveProps(nextProps: Props) {
    const { curricula, curriculum } = nextProps
    if (curricula.length && !curriculum) {
      this.setCurriculum(curricula[0])
    }
  }

  private setCurriculum(curriculum: Curriculum) {
    this.props.dispatch(setEntity({ curriculum }))
  }

  public logout() {
    localStorage.removeItem("user")
    this.props.dispatch(setEntity({ isRob: false }))
    this.setState({ redirect: "/login" })
  }

  public render() {
    const { curriculum, user, curricula, isRob } = this.props
    const { displayModal, redirect } = this.state

    if (redirect) return <Redirect to={redirect} />
    if (!user) return null

    const { firstName, lastName } = user

    const link = (item: any): any => {
      const path = item.toLowerCase().replace(" ", "-")
      const isViewing = window.location.pathname.indexOf(path) > -1
      const color =
        item === "Play"
          ? colors.green
          : isViewing
          ? colors.blue
          : colors.darkGray
      return (
        <Link
          style={{
            margin: "0px 5px",
            textDecoration: "none",
            color
          }}
          key={item}
          to={`/${path}`}
        >
          <Text.regular bold={isViewing}>{item}</Text.regular>
        </Link>
      )
    }

    const links = isRob
      ? ["Concepts", "Library", "Passages"]
      : [
          "Curricula",
          "Library",
          "Discover",
          "Concepts",
          "Images",
          "Passages",
          "Queues",
          "Play"
        ]

    const menuItems = links
      .map(link)
      .reduce((prev: any, curr: any, i: number) => [prev, "/", curr])

    return (
      <div style={{ marginBottom: "25px" }}>
        <FlexedDiv style={{ marginBottom: "5px" }}>
          <FlexedDiv flex={1} justifyContent="flex-start">
            <Header.s margin="0 10px 0 0">{get(curriculum, "name")}</Header.s>
            <select
              onChange={e => {
                const curriculum = curricula.find(
                  ({ id }) => id === e.target.value
                )
                this.setCurriculum(curriculum!)
              }}
              style={{ width: "15px" }}
              value={get(curriculum, "id")}
            >
              {curricula.map(({ id, name }) => (
                <option
                  disabled={!user.admin && user.curricula.indexOf(id) === -1}
                  key={id}
                  value={id}
                >
                  {name}
                </option>
              ))}
            </select>
          </FlexedDiv>

          <FlexedDiv>{menuItems}</FlexedDiv>

          <FlexedDiv
            flex={1}
            justifyContent="flex-end"
            style={{ position: "relative" }}
          >
            <Button
              style={{ margin: 0 }}
              onClick={() => this.setState({ displayModal: !displayModal })}
            >
              {formatName(firstName, lastName)}
            </Button>
            {displayModal && (
              <Modal>
                <ModalButton onClick={this.logout.bind(this)}>
                  Logout
                </ModalButton>
              </Modal>
            )}
          </FlexedDiv>
        </FlexedDiv>

        {!this.props.noSearch && <Search />}
      </div>
    )
  }
}

const mapStateToProps = (state: any, ownProps: any) => ({
  user: state.entities.user,
  curriculum: state.entities.curriculum,
  curricula: sortBy(state.entities.curricula, "name") || [],
  isRob: state.entities.isRob === true
})

export default connect(mapStateToProps)(Nav)
