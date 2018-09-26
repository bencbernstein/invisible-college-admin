import * as React from "react"
import { Redirect } from "react-router"
import { Link } from "react-router-dom"
import styled from "styled-components"
import { colors } from "../../lib/colors"

import { User } from "../../models/user"

const InvisibleCollege = styled.p`
  text-transform: uppercase;
  font-family: BrandonGrotesqueBold;
  letter-spacing: 1px;
  color: ${colors.gray};
`

const Container = styled.div`
  text-align: center;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

interface ButtonProps {
  bold?: boolean
}

const Button = styled.p`
  cursor: pointer;
  font-family: ${(p: ButtonProps) =>
    p.bold ? "BrandonGrotesqueBold" : "BrandonGrotesque"};
  margin-left: 20px;
  color: ${colors.gray};
`

const ModalButton = styled.p`
  color: ${colors.gray};
  cursor: pointer;
  font-family: BrandonGrotesqueBold;
  letter-spacing: 1px;
`

const Modal = styled.div`
  width: 250px;
  text-align: left;
  border: 5px solid ${colors.lightestGray};
  padding: 0px 20px;
  box-sizing: border-box;
  position: absolute;
  right: 0px;
  top: 50px;
  background-color: white;
`

const FlexDiv = styled.div`
  display: flex;
  position: relative;
`

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

const formatName = (first: string, last: string): string =>
  first.charAt(0).toUpperCase() +
  first.substr(1).toLowerCase() +
  " " +
  last.charAt(0).toUpperCase()

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
      <Container>
        <Link style={{ textDecoration: "none" }} to="/library">
          <InvisibleCollege>invisible college</InvisibleCollege>
        </Link>

        <FlexDiv onMouseLeave={this.displayModal.bind(this)}>
          <Link
            style={{ textDecoration: "none", color: colors.gray }}
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
        </FlexDiv>
      </Container>
    )
  }
}

export default Nav
