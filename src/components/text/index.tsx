import * as React from "react"
import { Redirect } from "react-router"
import styled from "styled-components"
import * as _ from "underscore"

import Information from "./information"
import Menu from "./menu"
// import { seed } from "./data"

import { fetchText } from "../../models/text"

import Nav from "../nav"
import Passage from "./passage"

const Container = styled.div`
  text-align: left;
  padding: 0px 50px;
  box-sizing: border-box;
  margin: 25px 0px;
`

interface Props {
  user: any
}

export interface Sentence {
  sentence: string
  found: string[]
}

export interface TextDoc {
  name: string
  source: string
  tokenized: Sentence[]
}

interface State {
  text?: TextDoc
  redirect?: string
  isNew: boolean
  isDisplaying: Screen
}

export enum Screen {
  Information = "Information",
  Read = "Read",
  Passages = "Passages"
}

class Text extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    const isNew = _.last(window.location.pathname.split("/")) === "new"

    this.state = {
      isNew,
      isDisplaying: Screen.Information
    }
  }

  public componentDidMount() {
    if (!this.state.isNew) {
      this.loadData()
    }
  }

  public updatePassages(ranges: number[][]) {
    console.log(ranges)
  }

  public async loadData() {
    const id = _.last(window.location.pathname.split("/"))
    const result = await fetchText(id!)
    if (result instanceof Error) {
      // TODO: - handle
    } else {
      result.tokenized = JSON.parse(result.tokenized)
      this.setState({ text: result })
    }
  }

  public displayScreen(isDisplaying: Screen) {
    this.setState({ isDisplaying })
  }

  public render() {
    const { redirect, isDisplaying, text, isNew } = this.state

    if (redirect) {
      return <Redirect to={redirect} />
    }

    const screen = (() => {
      switch (isDisplaying) {
        case Screen.Read:
          return (
            <Passage
              updatePassages={this.updatePassages.bind(this)}
              text={text!}
            />
          )
        default:
          return (
            <Information
              text={text}
              isNew={isNew}
              displayScreen={this.displayScreen.bind(this)}
            />
          )
      }
    })()

    const dataLoaded = !isNew && text

    return (
      <Container>
        <Nav user={this.props.user} />

        {isNew && screen}

        {dataLoaded && (
          <div>
            <Menu
              displayScreen={this.displayScreen.bind(this)}
              isDisplaying={isDisplaying}
              name={text!.name}
            />
            {screen}
          </div>
        )}
      </Container>
    )
  }
}

export default Text
