import * as React from "react"
import styled from "styled-components"

import { colors } from "../../lib/colors"
import Text from "../common/text"
import { SelectedSortBy, SelectedView } from "./"

const Container = styled.div`
  text-align: center;
  width: 100%;
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
  selectedView: SelectedView
  selectedSortBy: SelectedSortBy
  didSelectView: (selectedView: SelectedView) => void
  didSelectSortBy: (selectedSortBy: SelectedSortBy) => void
}

class Menus extends React.Component<Props, any> {
  constructor(props: Props) {
    super(props)
    this.state = {}
  }

  public render() {
    const { selectedSortBy, selectedView } = this.props

    const sortByMenuButtons = [SelectedSortBy.Added, SelectedSortBy.Random].map(
      (value: SelectedSortBy) => {
        const color = value === selectedSortBy ? colors.black : undefined
        return (
          <MenuButton
            onClick={() => this.props.didSelectSortBy(value)}
            key={value}
            color={color}
          >
            {value}
          </MenuButton>
        )
      }
    )

    const viewMenuButtons = [
      SelectedView.ChoiceSets,
      SelectedView.Texts,
      SelectedView.Words
    ].map((value: SelectedView) => {
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

        <Menu>
          <Text.regular>Sort By</Text.regular>
          <Line />
          {sortByMenuButtons}
        </Menu>
      </Container>
    )
  }
}

export default Menus
