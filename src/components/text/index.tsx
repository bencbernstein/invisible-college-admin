import * as React from "react"
import { Redirect } from "react-router"
import * as _ from "underscore"

import history from "../../history"

import Information from "./information"
import Menu from "./menu"

import { addPassages, fetchText, removePassage } from "../../models/text"
import { Text } from "../../models/text"
import { Bookmark, fetchUser, saveBookmark, User } from "../../models/user"

import Passages from "./passages"
import Read from "./read"

import { Keywords } from "../app"

interface State {
  text?: Text
  redirect?: string
  isNew: boolean
  isDisplaying: Screen
  bookmark?: Bookmark
}

interface Props {
  user: User
  keywords?: Keywords
}

export enum Screen {
  Information = "Information",
  Read = "Read",
  Passages = "Passages"
}

class TextComponent extends React.Component<Props, State> {
  constructor(props: any) {
    super(props)

    const isNew = _.last(window.location.pathname.split("/")) === "new"

    this.state = {
      isNew,
      isDisplaying: Screen.Information
    }
  }

  public componentDidMount() {
    const pathname = window.location.pathname
    const textId = pathname.split("/")[2]

    if (!this.state.isNew) {
      this.loadData(textId)
    }

    if (pathname.includes("passage")) {
      this.displayScreen(Screen.Passages)
    } else if (pathname.includes("read")) {
      this.displayScreen(Screen.Read)
    }
  }

  public async updatePassages(id: string, ranges: number[][]) {
    const text = this.state.text
    text!.passages = (await addPassages(id, ranges)).passages
    this.setState({ text })
  }

  public async loadData(id: string) {
    const text = await fetchText(id)
    text.tokenized = JSON.parse(text.tokenized)
    this.setState({ text })
    this.fetchBookmark(id)
  }

  public async fetchBookmark(textId: string) {
    const user = await fetchUser(this.props.user.id)
    const bookmark = _.find(
      user.bookmarks,
      (b: Bookmark) => b.textId === textId
    )
    this.setState({ bookmark })
  }

  public saveBookmark(sentenceIdx: number) {
    const bookmark = { textId: this.state.text!.id, sentenceIdx }
    this.setState({ bookmark })
    saveBookmark(this.props.user.id, bookmark.textId, sentenceIdx)
  }

  public displayScreen(isDisplaying: Screen) {
    const text = this.state.text
    if (window.location.pathname.includes("/passage") && text) {
      history.push("/text/" + text.id)
    }
    this.setState({ isDisplaying })
  }

  public async removePassage(textId: string, passageId: string) {
    const text = this.state.text!
    text.passages = text.passages.filter(p => p.id !== passageId)
    await removePassage(textId, passageId)
  }

  public render() {
    const { bookmark, redirect, isDisplaying, text, isNew } = this.state
    const { keywords } = this.props

    if (redirect) {
      return <Redirect to={redirect} />
    }

    const screen = (() => {
      switch (isDisplaying) {
        case Screen.Read:
          return (
            <Read
              saveBookmark={(sentenceIdx: number) =>
                this.saveBookmark(sentenceIdx)
              }
              bookmark={bookmark}
              updatePassages={this.updatePassages.bind(this)}
              keywords={keywords}
              text={text!}
            />
          )
        case Screen.Passages:
          return (
            <Passages
              removePassage={this.removePassage.bind(this)}
              keywords={keywords}
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

export default TextComponent
