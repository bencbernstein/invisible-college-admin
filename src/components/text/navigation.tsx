import { get } from "lodash"
import * as React from "react"
import styled from "styled-components"
import * as _ from "underscore"

import { colors } from "../../lib/colors"

const Container = styled.div`
  text-align: left;
  width: 100%;
  display: flex;
  justify-content: space-around;
`

const ButtonContainer = styled.div`
  text-align: center;
  cursor: pointer;
  &:hover {
    color: ${colors.blue} !important;
  }
`

const Value = styled.p`
  text-transform: uppercase;
  margin: 0;
  font-size: 0.9em;
`

const Hotkey = styled.p`
  font-size: 0.85em;
  margin: 0;
  color: ${colors.lightGray};
`

const DATA = [
  { value: "previous highlight", hotkeyName: "n", hotkey: "n" },
  { value: "previous", hotkeyName: "left arrow", hotkey: "ArrowLeft" },
  { value: "keep", hotkeyName: "space", hotkey: "Space" },
  { value: "next", hotkeyName: "right arrow", hotkey: "ArrowRight" },
  { value: "next highlight", hotkeyName: "m", hotkey: "m" }
]

interface Props {
  handleNavigation: (value: string) => {}
}

class Navigation extends React.Component<Props, any> {
  constructor(props: Props) {
    super(props)
    this.state = {}
    this.handleKeyDown = this.handleKeyDown.bind(this)
  }

  public componentWillMount() {
    document.addEventListener("keydown", this.handleKeyDown, false)
  }

  public componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown, false)
  }

  public handleKeyDown(e: any) {
    const value = get(_.find(DATA, (d: any) => d.hotkey === e.key), "value")
    if (value) {
      this.props.handleNavigation(value)
    }
  }

  public render() {
    const buttons = DATA.map(d => (
      <ButtonContainer
        key={d.hotkey}
        onClick={() => this.props.handleNavigation(d.value)}
      >
        <Value>{d.value}</Value>
        <Hotkey>{d.hotkeyName}</Hotkey>
      </ButtonContainer>
    ))
    return <Container>{buttons}</Container>
  }
}

export default Navigation
