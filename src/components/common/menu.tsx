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
  title: string
  options: any[]
  chosen: string
  didSelect: (option: string) => void
}

class Menus extends React.Component<Props, any> {
  constructor(props: Props) {
    super(props)
    this.state = {}
  }

  public render() {
    const { chosen, options, title } = this.props

    const menuButtons = options.map((value: any) => {
      const color = value === chosen ? colors.black : undefined
      return (
        <MenuButton
          onClick={() => this.props.didSelect(value)}
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
          <Text.regular>{title}</Text.regular>
          <Line />
          {menuButtons}
        </Menu>
      </Container>
    )
  }
}

export default Menus
