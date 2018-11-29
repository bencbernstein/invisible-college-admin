import * as React from "react"
import { connect } from "react-redux"
import { Redirect } from "react-router"
import { Link } from "react-router-dom"
import { last } from "lodash"

import Search from "../search"
import Text from "../common/text"
import Header from "../common/header"

import {
  Modal,
  ModalButton,
  InvisibleCollege,
  Button,
  NavBox,
  FlexBox
} from "./components"

import { setCollectionAction } from "../../actions"
import { User } from "../../interfaces/user"

import { formatName } from "../../lib/helpers"
import { colors } from "../../lib/colors"
import COLLECTIONS from "../../lib/collections"
import FlexedDiv from "../common/flexedDiv"

interface Props {
  user?: User
  collection?: string
  dispatch: any
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
    if (!this.props.collection) {
      this.setCollection(COLLECTIONS[1])
    }
  }

  private setCollection(collection: string) {
    this.props.dispatch(setCollectionAction(collection))
  }

  public logout() {
    localStorage.removeItem("user")
    this.setState({ redirect: "/login" })
  }

  public render() {
    if (this.state.redirect) return <Redirect to={this.state.redirect} />
    const { collection, user } = this.props
    if (!user) return null
    const { displayModal } = this.state

    const { firstName, lastName } = user

    const link = (item: any): any => {
      const path = item.toLowerCase().replace(" ", "-")
      const color =
        path === last(window.location.pathname.split("/"))
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
          <Text.regular>{item}</Text.regular>
        </Link>
      )
    }

    const menuItems = [
      "Concepts",
      "Discover",
      "Images",
      "Library",
      "Ontology",
      "Passages",
      "Queues"
    ]
      .map(link)
      .reduce((prev: any, curr: any, i: number) => [prev, "/", curr])

    const displaySearch = window.location.pathname.split("/")[1] !== "discover"

    return (
      <div>
        <NavBox>
          <Link style={{ textDecoration: "none", flex: 1 }} to="/library">
            <InvisibleCollege>Wordcraft</InvisibleCollege>
          </Link>

          <FlexedDiv>
            <Header.m margin="0 10px 0 0">{collection}</Header.m>
            <select
              onChange={e => this.setCollection(e.target.value)}
              style={{ width: "15px" }}
              value={collection}
            >
              {COLLECTIONS.map(c => (
                <option key={c} value={c}>
                  {c}
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

        {displaySearch && <Search />}
        <br />
      </div>
    )
  }
}

const mapStateToProps = (state: any, ownProps: any) => ({
  user: state.entities.user,
  collection: state.entities.collection
})

export default connect(mapStateToProps)(Nav)
