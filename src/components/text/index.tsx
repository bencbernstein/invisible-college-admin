import * as React from "react"
import { Redirect } from "react-router"
import * as _ from "underscore"

import Information from "./information"
import Menu from "./menu"

import { addPassages, fetchText, removePassage } from "../../models/text"

import Passages from "./passages"
import Read from "./read"

export interface Sentence {
  sentence: string
  found: string[]
}

export interface Passage {
  id: string
  startIdx: number
  endIdx: number
  passage: string
  found: string[]
}

export interface TextDoc {
  id: string
  name: string
  source: string
  tokenized: Sentence[]
  passages: Passage[]
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

class Text extends React.Component<any, State> {
  constructor(props: any) {
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

  public async updatePassages(id: string, ranges: number[][]) {
    const text = this.state.text
    text!.passages = (await addPassages(id, ranges)).passages
    this.setState({ text })
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

  public async removePassage(textId: string, passageId: string) {
    const result = await removePassage(textId, passageId)
    console.log(result)
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
            <Read
              updatePassages={this.updatePassages.bind(this)}
              text={text!}
            />
          )
        case Screen.Passages:
          return (
            <Passages
              removePassage={this.removePassage.bind(this)}
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
      <div>
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
      </div>
    )
  }
}

export default Text
