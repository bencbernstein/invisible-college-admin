import * as React from "react"
import styled from "styled-components"

import Header from "../common/header"
import Text from "../common/text"
import { Screen } from "./"

const Container = styled.div`
  text-align: left;
  width: 100%;
`

const Link = Text.l.extend`
  cursor: pointer;
`

const MenuItems = styled.div`
  margin-top: -30px;
`

interface Props {
  name: string
  isDisplaying: Screen
  displayScreen: (isDisplaying: Screen) => {}
}

class Menu extends React.Component<Props, any> {
  constructor(props: Props) {
    super(props)
    this.state = {}
  }

  public render() {
    const { name, isDisplaying } = this.props

    const link = (screen: Screen) => (
      <Link
        onClick={() => this.props.displayScreen(screen)}
        bold={isDisplaying === screen}
        key={screen}
      >
        {screen}
      </Link>
    )
    const links = [Screen.Information, Screen.Read, Screen.Passages].map(link)

    return (
      <Container>
        <Header.l>{name}</Header.l>
        <MenuItems>{links}</MenuItems>
      </Container>
    )
  }
}

export default Menu
