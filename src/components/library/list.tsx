import * as React from "react"
import { Redirect } from "react-router"
import { Link } from "react-router-dom"
import styled from "styled-components"

import AddBox from "../common/addBox"
import Box from "../common/box"
import Button from "../common/button"
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
import passageSequencesIcon from "../../lib/images/icon-passage-sequence.png"

const Removable = styled.span`
  cursor: pointer;
  margin: 0px 3px;
  &:hover {
    color: ${colors.red};
  }
`

const LinkButton = Button.regular.extend`
  border: 0;
  margin: 0;
  padding: 10px 0px;
  width: 100%;
`

const Choices = Text.regular.extend`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`

const DescriptionText = styled.div`
  position: absolute;
  bottom: 10px;
  left: 0;
  right: 0;
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

    const icons = (i: number, deletable: boolean = true) => (
      <IconsContainer>
        <Icon
          style={{ visibility: deletable ? "visible" : "hidden" }}
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
            {
              Texts: textIcon,
              Words: wordIcon,
              "Choice Sets": choiceSetIcon,
              "Passage Sequences": passageSequencesIcon
            }[selectedView]
          }
        />
      </IconsContainer>
    )

    const textLinksBox = (id: string) => (
      <AddBox style={{ display: "flex", padding: "0" }} key={id}>
        <Link
          style={{ textDecoration: "none", color: "black", width: "50%" }}
          to={`/text/${id}`}
        >
          <LinkButton>View</LinkButton>
        </Link>
        <Link
          style={{ textDecoration: "none", color: "black", width: "50%" }}
          to={`/text/${id}?enriching=true`}
        >
          <LinkButton>Enrich</LinkButton>
        </Link>
      </AddBox>
    )

    const textBox = (d: any, i: number) => (
      <Box.regular
        onMouseOver={() => this.setState({ isHovering: i })}
        onMouseLeave={() =>
          this.setState({ isHovering: undefined, choice: "" })
        }
        key={i}
      >
        {icons(i)}
        <Text.l center={true}>{d.name}</Text.l>
        <DescriptionText>
          <Text.s center={true}>{d.source}</Text.s>
          <Text.xs center={true}>
            {d.passagesCount} passages / {d.unenrichedPassagesCount} unenriched
          </Text.xs>
        </DescriptionText>
        {isHovering === i && textLinksBox(d.id)}
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
        <Header.forInput>Add to Choice Set</Header.forInput>

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

    const passageSequencesBox = (d: any, i: number) => (
      <Box.regular key={i}>
        {icons(i, false)}
        <Link
          key={d.id}
          style={{ textDecoration: "none" }}
          to={`/passage-sequence/${d.id}`}
        >
          <Text.l center={true}>{d.name}</Text.l>
          <Text.s center={true}>{d.count} passages</Text.s>
        </Link>
      </Box.regular>
    )

    const constructor = {
      Texts: textBox,
      Words: wordBox,
      "Choice Sets": choiceSetBox,
      "Passage Sequences": passageSequencesBox
    }[selectedView]

    return <ListContainer>{data.map(constructor)}</ListContainer>
  }
}

export default List
