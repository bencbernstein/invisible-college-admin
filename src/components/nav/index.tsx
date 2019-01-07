import * as React from "react"
import { connect } from "react-redux"
import { Redirect } from "react-router"
import { get, sortBy } from "lodash"
import { Link } from "react-router-dom"

import Search from "../search"
import Text from "../common/text"
import Header from "../common/header"

import { Modal, ModalButton, Button } from "./components"

import { removeEntity, setEntity } from "../../actions"
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

  public logout() {
    localStorage.removeItem("user")
    this.props.dispatch(removeEntity("isRob"))
    this.props.dispatch(removeEntity("user"))
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
      const isViewing =
        path.indexOf(window.location.pathname.split("/")[1]) > -1
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
      ? ["Concepts", "Library"]
      : [
          "Curricula",
          "Library",
          "Discover",
          "Concepts",
          "Queues",
          "Images",
          "Passages"
        ]

    const gameLinks = ["Sequences", "Questions", "Play"]

    const menuItems = (links: string[]) =>
      links
        .sort()
        .map(link)
        .reduce((prev: any, curr: any, i: number) => [prev, "/", curr])

    return (
      <div style={{ marginBottom: "25px" }}>
        <FlexedDiv style={{ marginBottom: "5px" }}>
          <FlexedDiv flex={1} justifyContent="flex-start">
            <Header.s margin="0 10px 0 0">{get(curriculum, "name")}</Header.s>
            {!isRob && (
              <select
                onChange={e => {
                  const curriculum = curricula.find(
                    ({ id }) => id === e.target.value
                  )
                  this.props.dispatch(setEntity({ curriculum }))
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
            )}
          </FlexedDiv>

          <div style={{ flex: 8 }}>
            <FlexedDiv justifyContent="center">{menuItems(links)}</FlexedDiv>
            {!isRob && (
              <FlexedDiv justifyContent="center">
                {menuItems(gameLinks)}
              </FlexedDiv>
            )}
          </div>

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
