import * as React from "react"
import { Redirect } from "react-router"
import { Link } from "react-router-dom"
import styled from "styled-components"

import Box from "../common/box"
import Icon from "../common/icon"
import Input from "../common/input"
import Text from "../common/text"

import { colors } from "../../lib/colors"

import { SelectedView } from "./"

import choiceSetIcon from "../../lib/images/icon-choice-set.png"
import deleteIconRed from "../../lib/images/icon-delete-red.png"
import deleteIcon from "../../lib/images/icon-delete.png"
import textIcon from "../../lib/images/icon-text.png"
import wordIcon from "../../lib/images/icon-word.png"

const Container = styled.div`
  text-align: center;
  width: 95%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 25px 0px;
`

const Icons = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  top: 5px;
  width: 100%;
  padding: 0px 5px;
  box-sizing: border-box;
`

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

const AddChoiceBox = styled.div`
  background-color: ${colors.lightGray};
  position: absolute;
  width: 100%;
  bottom: 0;
  padding: 10px;
  box-sizing: border-box;
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
      <Icons>
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
      </Icons>
    )

    const textBox = (d: any, i: number) => (
      <Box.regular>
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
      <Box.regular>
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
      <AddChoiceBox>
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
            autoFocus={true}
            type="text"
          />
        </form>
      </AddChoiceBox>
    )

    const choiceSetBox = (d: any, i: number) => (
      <Box.regular
        onMouseOver={() => this.setState({ isHovering: i })}
        onMouseLeave={() =>
          this.setState({ isHovering: undefined, choice: "" })
        }
        key={d.id}
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

    const box = (d: any, i: number) => constructor(d, i)

    return <Container>{data.map((d: any, i: number) => box(d, i))}</Container>
  }
}

export default List
