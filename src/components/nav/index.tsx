import * as React from "react"
import { connect } from "react-redux"
import { Redirect } from "react-router"
import { get } from "lodash"
import { Link } from "react-router-dom"

import Search from "../search"
import Text from "../common/text"
import Header from "../common/header"

import { Modal, ModalButton, Button, NavBox, FlexBox } from "./components"

import { setEntity } from "../../actions"
import { User } from "../../interfaces/user"

import { formatName, lastPath } from "../../lib/helpers"
import { colors } from "../../lib/colors"
import FlexedDiv from "../common/flexedDiv"

import { Curriculum } from "../../interfaces/curriculum"

interface Props {
  user?: User
  curriculum?: Curriculum
  noSearch: boolean
  dispatch: any
  curricula: Curriculum[]
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
    const { curricula, curriculum } = this.props
    if (curricula.length && !curriculum) {
      this.setCurriculum(curricula[0])
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
    this.setState({ redirect: "/login" })
  }

  public render() {
    const { curriculum, user, curricula } = this.props
    const { displayModal, redirect } = this.state

    if (redirect) return <Redirect to={redirect} />
    if (!user) return null

    const { firstName, lastName } = user

    const link = (item: any): any => {
      const path = item.toLowerCase().replace(" ", "-")
      const isViewing = path === lastPath(window)
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

    const menuItems = [
      "Curricula",
      "Library",
      "Discover",
      "Concepts",
      "Images",
      "Passages",
      "Queues",
      "Play"
    ]
      .map(link)
      .reduce((prev: any, curr: any, i: number) => [prev, "/", curr])

    return (
      <div style={{ height: "75px" }}>
        <NavBox>
          <Link style={{ textDecoration: "none", flex: 1 }} to="/library">
            <Header.s
              style={{
                color: colors.gray,
                textAlign: "left",
                margin: "0"
              }}
            >
              Wordcraft
            </Header.s>
          </Link>

          <FlexedDiv>
            <Header.m margin="0 10px 0 0">{get(curriculum, "name")}</Header.m>
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
                <option key={id} value={id}>
                  {name}
                </option>
              ))}
            </select>
          </FlexedDiv>

          <FlexBox style={{ flex: 1, justifyContent: "flex-end" }}>
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
          </FlexBox>
        </NavBox>

        <div
          style={{
            flex: 4,
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          {menuItems}
        </div>

        {!this.props.noSearch && <Search />}
        <br />
      </div>
    )
  }
}

const mapStateToProps = (state: any, ownProps: any) => ({
  user: state.entities.user,
  curriculum: state.entities.curriculum,
  curricula: state.entities.curricula || []
})

export default connect(mapStateToProps)(Nav)
