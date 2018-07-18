import { get } from "lodash"
import * as React from "react"
import { Redirect } from "react-router"
import styled from "styled-components"
import * as _ from "underscore"

import Button from "../common/button"
import Header from "../common/header"
import Nav from "../nav"
import List from "./list"
import Menus from "./menus"

import { fetchTexts } from "../../models/text"
import { fetchWords } from "../../models/word"

const Container = styled.div`
  text-align: left;
  padding: 0px 50px;
  box-sizing: border-box;
  margin: 25px 0px;
`

interface Props {
  user: any
}

export enum SelectedView {
  All = "All",
  Texts = "Texts",
  Words = "Words"
}

export enum SelectedSortBy {
  Added = "Added",
  Random = "Random"
}

interface State {
  selectedView: SelectedView
  selectedSortBy: SelectedSortBy
  redirect?: string
  words: any[]
  texts: any[]
}

class Library extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      selectedView: SelectedView.Texts,
      selectedSortBy: SelectedSortBy.Added,
      words: [],
      texts: []
    }
  }

  public componentDidMount() {
    this.loadWords()
    this.loadTexts()
  }

  public async loadTexts() {
    const texts = await fetchTexts()
    this.setState({ texts })
  }

  public async loadWords() {
    const after = get(_.last(this.state.words), "value")
    const words = this.state.words.concat(await fetchWords(30, after))
    this.setState({ words })
  }

  public didSelectView(selectedView: SelectedView): void {
    this.setState({ selectedView })
  }

  public didSelectSortBy(selectedSortBy: SelectedSortBy): void {
    this.setState({ selectedSortBy })
  }

  public render() {
    const { selectedView, selectedSortBy, redirect, texts, words } = this.state

    if (redirect) {
      return <Redirect to={redirect} />
    }

    return (
      <Container>
        <Nav user={this.props.user} />

        <Header.l>Library</Header.l>

        <Menus
          didSelectView={this.didSelectView.bind(this)}
          didSelectSortBy={this.didSelectSortBy.bind(this)}
          selectedView={selectedView}
          selectedSortBy={selectedSortBy}
        />

        <List
          selectedView={selectedView}
          data={selectedView === "Words" ? words : texts}
        />

        {selectedView === "Words" && (
          <Button.regular onClick={() => this.loadWords()}>
            load more
          </Button.regular>
        )}
      </Container>
    )
  }
}

export default Library
