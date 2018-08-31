import * as React from "react"
import styled from "styled-components"

import { colors } from "../../lib/colors"

import Text from "../common/text"

import Subnav from "../nav/subnav"

import { Screen } from "./"

const Container = styled.div`
  text-align: left;
`

const FlexedDiv = styled.div`
  display: flex;
  align-items: flex-start;
  margin: ${(p: MinimizeProps) => (p.hide ? "0px" : "50px 0px")};
  justify-content: space-between;
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

interface Props {
  name: string
  isDisplaying: Screen
  displayScreen: (isDisplaying: Screen) => {}
  play: () => {}
  next: () => {}
  displayNav: (displayNav: boolean) => void
  isEnriching: boolean
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

  public minimize() {
    const minimized = !this.state.minimized
    this.setState({ minimized })
    this.props.displayNav(!minimized)
  }

  public render() {
    const { minimized } = this.state
    const { name, isDisplaying, isEnriching } = this.props

    const link = (screen: Screen) => (
      <Text.regular
        pointer={true}
        onClick={() => this.props.displayScreen(screen)}
        bold={isDisplaying === screen}
        key={screen}
      >
        {screen}
      </Text.regular>
    )

    const links = [Screen.Information, Screen.Read, Screen.Passages].map(link)

    return (
      <Container>
        <FlexedDiv hide={minimized}>
          <Subnav
            next={this.props.next.bind(this)}
            title={name}
            minimized={minimized}
            subtitle={"texts"}
            subtitleLink={"/library"}
            isEnriching={isEnriching}
            play={this.props.play.bind(this)}
            invert={true}
          />
          <Minimize
            hide={isDisplaying === "Information"}
            onClick={this.minimize.bind(this)}
          />
        </FlexedDiv>
        {!minimized && <MenuItems>{links}</MenuItems>}
      </Container>
    )
  }
}

export default Menu
