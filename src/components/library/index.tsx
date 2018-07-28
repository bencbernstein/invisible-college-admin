import { get } from "lodash"
import * as React from "react"
import { Redirect } from "react-router"
import * as _ from "underscore"

import Button from "../common/button"
import Header from "../common/header"
import List from "./list"
import Menus from "./menus"

import {
  addChoice,
  fetchChoiceSets,
  removeChoice,
  removeChoiceSet
} from "../../models/choiceSet"
import { fetchTexts } from "../../models/text"
import { fetchWords, removeWord } from "../../models/word"

export enum SelectedView {
  All = "All",
  ChoiceSets = "Choice Sets",
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
  choiceSets: any[]
}

class Library extends React.Component<any, State> {
  constructor(props: any) {
    super(props)
    this.state = {
      selectedView: SelectedView.Words,
      selectedSortBy: SelectedSortBy.Added,
      words: [],
      texts: [],
      choiceSets: []
    }
  }

  public componentDidMount() {
    this.loadWords()
    this.loadTexts()
    this.loadChoiceSets()
  }

  public async loadChoiceSets() {
    const choiceSets = await fetchChoiceSets(["id", "name", "choices"])
    this.setState({ choiceSets })
  }

  public async updateChoiceSet(i: number, choice: string, add: boolean) {
    const choiceSets = this.state.choiceSets
    const id = choiceSets[i].id
    let result
    if (add) {
      result = await addChoice(id, choice)
    } else {
      result = await removeChoice(id, choice)
    }
    if (!(result instanceof Error)) {
      choiceSets[i] = result
      this.setState({ choiceSets })
    }
  }

  public async remove(i: number) {
    const { choiceSets, selectedView, words } = this.state
    if (selectedView === "Words") {
      const id = words[i].id
      const result = await removeWord(id)
      if (!(result instanceof Error)) {
        words.splice(i, 1)
        this.setState({ words })
      }
    } else {
      const id = choiceSets[i].id
      const result = await removeChoiceSet(id)
      if (!(result instanceof Error)) {
        choiceSets.splice(i, 1)
        this.setState({ choiceSets })
      }
    }
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
    const {
      choiceSets,
      selectedView,
      selectedSortBy,
      redirect,
      texts,
      words
    } = this.state

    if (redirect) {
      return <Redirect to={redirect} />
    }

    const data = {
      Words: words,
      Texts: texts,
      "Choice Sets": choiceSets
    }[selectedView]

    return (
      <div>
        <Header.l>Library</Header.l>

        <Menus
          didSelectView={this.didSelectView.bind(this)}
          didSelectSortBy={this.didSelectSortBy.bind(this)}
          selectedView={selectedView}
          selectedSortBy={selectedSortBy}
        />

        <List
          remove={this.remove.bind(this)}
          updateChoiceSet={this.updateChoiceSet.bind(this)}
          selectedView={selectedView}
          data={data}
        />

        {selectedView === "Words" && (
          <Button.regular onClick={() => this.loadWords()}>
            load more
          </Button.regular>
        )}
      </div>
    )
  }
}

export default Library
