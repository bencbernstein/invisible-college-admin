import * as React from "react"
import { Redirect } from "react-router"
import { Link } from "react-router-dom"

import {
  Modal,
  ModalButton,
  InvisibleCollege,
  Button,
  NavBox,
  FlexBox
} from "./components"

import { User } from "../../models/user"

import { colors } from "../../lib/colors"
import { formatName } from "../../lib/helpers"

interface Props {
  user: User
  holdingShift: boolean
}

interface State {
  redirect?: string
  displayModal?: ModalType
}

enum ModalType {
  Create = "Create",
  Profile = "Profile"
}

class Nav extends React.Component<Props, State> {
  constructor(props: any) {
    super(props)
    this.state = {}
  }

  public displayModal(displayModal: ModalType) {
    this.setState({ displayModal })
  }

  public logout() {
    localStorage.removeItem("user")
    this.setState({ redirect: "/login" })
  }

  public addText() {
    this.setState({ redirect: "/text/new" })
  }

  public render() {
    const { user, holdingShift } = this.props

    if (!user) {
      return null
    }

    const { firstName, lastName } = user

    const { redirect, displayModal } = this.state

    if (redirect) {
      return <Redirect to={redirect} />
    }

    const createModal = (
      <Modal>
        <ModalButton onClick={this.addText.bind(this)}>Add Text</ModalButton>
        <ModalButton onClick={() => console.log("TODO")}>
          Add Word{" "}
          <span
            style={{ color: holdingShift ? colors.green : colors.lightGray }}
          >
            (Shift)
          </span>
        </ModalButton>
      </Modal>
    )

    const profileModal = (
      <Modal>
        <ModalButton onClick={this.logout.bind(this)}>Logout</ModalButton>
      </Modal>
    )

    const modal = (() => {
      if (holdingShift) {
        return createModal
      }
      switch (displayModal) {
        case "Create":
          return createModal
        case "Profile":
          return profileModal
        default:
          return null
      }
    })()

    return (
      <NavBox>
        <Link style={{ textDecoration: "none" }} to="/library">
          <InvisibleCollege>invisible college</InvisibleCollege>
        </Link>

        <FlexBox onMouseLeave={this.displayModal.bind(this)}>
          <Link
            style={{
              textDecoration: "none",
              color: colors.gray,
              visibility:
                window.location.pathname === "/discover" ? "hidden" : "visible"
            }}
            to="/discover"
          >
            <Button bold={true}>DISCOVER</Button>
          </Link>
          <Button
            bold={true}
            onMouseOver={() => this.displayModal(ModalType.Create)}
          >
            + CREATE
          </Button>
          <Button onMouseOver={() => this.displayModal(ModalType.Profile)}>
            {formatName(firstName, lastName)}
          </Button>
          {modal}
        </FlexBox>
      </NavBox>
    )
  }
}

export default Nav
