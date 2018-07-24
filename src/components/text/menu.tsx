import * as React from "react"
import styled from "styled-components"

import { colors } from "../../lib/colors"
import Header from "../common/header"
import Text from "../common/text"
import { Screen } from "./"

const Container = styled.div`
  text-align: left;
`

const FlexedDiv = styled.div`
  display: flex;
  align-items: flex-start;
  margin: 50px 0px;
  justify-content: space-between;
`

const Link = Text.l.extend`
  cursor: pointer;
`

const MenuItems = styled.div`
  margin-top: -30px;
  width: 100px;
`

interface MinimizeProps {
  hide?: boolean
}

const Minimize = styled.div`
  visibility: ${(p: MinimizeProps) => (p.hide ? "hidden" : "visible")};
  width: 12px;
  height: 2px;
  border: 5px solid ${colors.gray};
  background-color: ${colors.gray};
  cursor: pointer;
  &:hover {
    background-color: ${colors.lightestGray};
  }
`

const HeaderL = Header.l.extend`
  margin: 0;
`

interface Props {
  name: string
  isDisplaying: Screen
  displayScreen: (isDisplaying: Screen) => {}
}

interface State {
  minimized: boolean
}

class Menu extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      minimized: false
    }
  }

  public render() {
    const { minimized } = this.state
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
        <FlexedDiv>
          <HeaderL>{!minimized && `Text // ${name}`}</HeaderL>
          <Minimize
            hide={isDisplaying !== "Read"}
            onClick={() => this.setState({ minimized: !minimized })}
          />
        </FlexedDiv>
        {!minimized && <MenuItems>{links}</MenuItems>}
      </Container>
    )
  }
}

export default Menu
