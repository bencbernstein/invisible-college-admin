import * as React from "react"
import styled from "styled-components"

import { colors } from "../../lib/colors"
import Text from "../common/text"

const Container = styled.div`
  text-align: center;
  display: flex;
`

const Menu = styled.div`
  text-align: left;
  margin-right: 50px;
`

const Line = styled.div`
  width: 200px;
  margin: 10px 0px;
  border-bottom: 1px solid ${colors.lightGray};
`

interface TextProps {
  color?: string
}

const MenuButton = Text.regular.extend`
  cursor: pointer;
  font-family: ${(p: TextProps) =>
    p.color ? "BrandonGrotesqueBold" : "BrandonGrotesque"};
`

interface Props {
  selectedViews: any[]
  selectedView: any
  didSelectView: (selectedView: any) => void
}

class Menus extends React.Component<Props, any> {
  constructor(props: Props) {
    super(props)
    this.state = {}
  }

  public render() {
    const { selectedView, selectedViews } = this.props

    const viewMenuButtons = selectedViews.map((value: any) => {
      const color = value === selectedView ? colors.black : undefined
      return (
        <MenuButton
          onClick={() => this.props.didSelectView(value)}
          key={value}
          color={color}
        >
          {value}
        </MenuButton>
      )
    })

    return (
      <Container>
        <Menu>
          <Text.regular>View</Text.regular>
          <Line />
          {viewMenuButtons}
        </Menu>
      </Container>
    )
  }
}

export default Menus
