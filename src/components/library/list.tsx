import * as React from "react"
import { Redirect } from "react-router"
import { Link } from "react-router-dom"
import styled from "styled-components"

import AddBox from "../common/addBox"
import Box from "../common/box"
import Icon from "../common/icon"
import IconsContainer from "../common/iconsContainer"
import Header from "../common/header"
import Input from "../common/input"
import ListContainer from "../common/listContainer"
import Text from "../common/text"

import { colors } from "../../lib/colors"

import { SelectedView } from "./"

import choiceSetIcon from "../../lib/images/icon-choice-set.png"
import deleteIconRed from "../../lib/images/icon-delete-red.png"
import deleteIcon from "../../lib/images/icon-delete.png"
import textIcon from "../../lib/images/icon-text.png"
import wordIcon from "../../lib/images/icon-word.png"

const Removable = styled.span`
  cursor: pointer;
  margin: 0px 3px;
  &:hover {
    color: ${colors.red};
  }
`

const Choices = Text.regular.extend`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`

interface Props {
  data: any[]
  selectedView: SelectedView
  updateChoiceSet: (i: number, choice: string, add: boolean) => {}
  remove: (i: number) => {}
}

interface State {
  isHovering?: number
  redirect?: string
  choice: string
  isHoveringDelete?: number
}

class List extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      choice: ""
    }
  }

  public render() {
    const { isHovering, isHoveringDelete, redirect, choice } = this.state

    if (redirect) {
      return <Redirect to={redirect} />
    }

    const { data, selectedView } = this.props

    const icons = (i: number) => (
      <IconsContainer>
        <Icon
          pointer={true}
          onMouseEnter={() => this.setState({ isHoveringDelete: i })}
          onMouseLeave={() => this.setState({ isHoveringDelete: undefined })}
          onClick={e => {
            this.props.remove(i)
          }}
          src={isHoveringDelete === i ? deleteIconRed : deleteIcon}
        />
        <Icon
          src={
            { Texts: textIcon, Words: wordIcon, "Choice Sets": choiceSetIcon }[
            selectedView
            ]
          }
        />
      </IconsContainer>
    )

    const textBox = (d: any, i: number) => (
      <Box.regular key={i}>
        {icons(i)}
        <Link
          key={d.id}
          style={{ textDecoration: "none" }}
          to={`/text/${d.id}`}
        >
          <Text.l>{d.name}</Text.l>
        </Link>
      </Box.regular>
    )

    const wordBox = (d: any, i: number) => (
      <Box.regular key={i}>
        {icons(i)}
        <Link
          key={d.id}
          style={{ textDecoration: "none" }}
          to={`/word/${d.id}`}
        >
          {" "}
          <Text.l>{d.value}</Text.l>
        </Link>
      </Box.regular>
    )

    const inputBox = (i: number) => (
      <AddBox>
        <Header.forInput>
          Add to Choice Set
        </Header.forInput>

        <form
          onSubmit={e => {
            e.preventDefault()
            this.props.updateChoiceSet(i, choice, true)
            this.setState({ choice: "" })
          }}
        >
          <Input.circ
            onChange={e => {
              this.setState({ choice: e.target.value })
            }}
            value={choice}
            autoCapitalize={"none"}
            autoFocus={true}
            type="text"
          />
        </form>
      </AddBox>
    )

    const choiceSetBox = (d: any, i: number) => (
      <Box.regular
        onMouseOver={() => this.setState({ isHovering: i })}
        onMouseLeave={() =>
          this.setState({ isHovering: undefined, choice: "" })
        }
        key={i}
      >
        {icons(i)}
        <Text.l>{d.name}</Text.l>
        <br />
        <Choices>
          {d.choices.map((c: string) => (
            <Removable
              onClick={() => this.props.updateChoiceSet(i, c, false)}
              key={c}
            >
              {c}
            </Removable>
          ))}
        </Choices>
        {isHovering === i && inputBox(i)}
      </Box.regular>
    )

    const constructor = {
      Texts: textBox,
      Words: wordBox,
      "Choice Sets": choiceSetBox
    }[selectedView]

    return <ListContainer>{data.map((d: any, i: number) => constructor(d, i))}</ListContainer>
  }
}

export default List
