import * as React from "react"
import styled from "styled-components"

import { colors } from "../../lib/colors"
import Text from "../common/text"

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

const Dropdown = styled.select`
  border: 1px solid ${colors.lightGray};
  background-color: white;
  position: absolute;
  box-sizing: border-box;
  padding: 5px;
  font-family: BrandonGrotesque;
  min-height: 150px;
  z-index: 100;
  cursor: pointer;
  outline: none;
`

interface Props {
  filters: any[]
  filterBy: (questionType: string) => {}
}

interface State {
  displayDropdown: boolean
}

class FilterMenu extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      displayDropdown: false
    }
  }

  public render() {
    const { displayDropdown } = this.state
    const { filters } = this.props

    const filter = filters[0]

    const TYPES = [
      "ALL",
      "WORD_TO_DEF",
      "WORD_TO_ROOTS",
      "WORD_TO_SYN",
      "WORD_TO_TAG",
      "WORD_TO_IMG",
      "SENTENCE_TO_POS",
      "SENTENCE_TO_TRUTH"]

    const dropdown = <Dropdown
      value={[filter]}
      multiple={true}
      onChange={e => {
        this.setState({ displayDropdown: false })
        this.props.filterBy(e.target.value)
      }}>
      {TYPES.map(t => <option value={t} key={t}>
        {t}
      </option>)}
    </Dropdown>

    return (
      <Container>
        <Menu>
          <Text.regular>Filter</Text.regular>
          <Line />
          {displayDropdown
            ?
            dropdown
            :
            <MenuButton onClick={() => this.setState({ displayDropdown: true })}>
              {"Question Type"}
              {filter && ` - ${filter}`}
            </MenuButton>
          }
        </Menu>
      </Container>
    )
  }
}

export default FilterMenu
