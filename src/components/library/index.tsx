import * as React from "react"
import { Redirect } from "react-router"

import Subnav from "../nav/subnav"
import List from "./list"
import EnrichWordsMenu from "./enrichWordsMenu"
import Menus from "../common/menu"

import {
  SelectedSortBy,
  SelectedView,
  viewForSearch,
  attrForWordSortBy
} from "./data"

import {
  addChoice,
  fetchChoiceSets,
  removeChoice,
  removeChoiceSet
} from "../../models/choiceSet"
import { Word, fetchWords, removeWord } from "../../models/word"

interface State {
  selectedView: SelectedView
  selectedSortBy: SelectedSortBy
  selectedFilterBy: string
  redirect?: string
  words: Word[]
  texts: any[]
  choiceSets: any[]
}

const ALPHABET = "abcdefghijklmnopqrstuvwxyz".split("")

class Library extends React.Component<any, State> {
  constructor(props: any) {
    super(props)

    this.state = {
      selectedView: viewForSearch(window.location.search),
      selectedSortBy: SelectedSortBy.Name,
      selectedFilterBy: ALPHABET[0],
      words: [],
      texts: [],
      choiceSets: []
    }
  }

  public componentDidMount() {
    this.loadWords()
    this.loadChoiceSets()
  }

  public async loadChoiceSets() {
    const choiceSets = await fetchChoiceSets(["id", "name", "choices"])
    this.setState({ choiceSets })
  }

  public async loadWords(didChangeSort: boolean = false) {
    const { selectedSortBy, selectedFilterBy } = this.state
    const sortBy = attrForWordSortBy(selectedSortBy)
    const words = await fetchWords(30, selectedFilterBy, sortBy)
    if (!(words instanceof Error)) {
      this.setState({ words })
    }
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
    const { choiceSets, selectedView, words, texts } = this.state

    const [data, fn] = {
      Words: [words, removeWord],
      "Choice Sets": [choiceSets, removeChoiceSet]
    }[selectedView]

    const confirm = `Are you sure you want to delete ${data[i].name ||
      data[i].value}?`
    if (window.confirm(confirm)) {
      const result = await fn(data[i].id)

      if (!(result instanceof Error)) {
        data.splice(i, 1)
        this.setState({ choiceSets, selectedView, words, texts })
      }
    }
  }

  public didSelectView(selectedView: any) {
    if (selectedView === SelectedView.Passages) {
      this.setState({ redirect: "/passages" })
    } else {
      this.setState({ selectedView })
    }
  }

  public didSelectSortBy(selectedSortBy: any) {
    const { selectedView } = this.state
    if (selectedView === "Words") {
      this.setState({ selectedSortBy }, () => this.loadWords(true))
    }
  }

  public didSelectFilterBy(character: string) {
    this.setState({ selectedFilterBy: character }, this.loadWords)
  }

  public render() {
    const {
      choiceSets,
      selectedView,
      selectedSortBy,
      selectedFilterBy,
      redirect,
      words
    } = this.state

    if (redirect) {
      return <Redirect to={redirect} />
    }

    const data = {
      Words: words,
      "Choice Sets": choiceSets
    }[selectedView]

    return (
      <div>
        <Subnav minimized={false} title={"library"} />

        <div style={{ display: "flex" }}>
          <Menus
            title={"View"}
            didSelect={this.didSelectView.bind(this)}
            chosen={selectedView}
            options={[
              SelectedView.ChoiceSets,
              SelectedView.Passages,
              SelectedView.Words
            ]}
          />

          {selectedView === "Words" && (
            <Menus
              title={"Sort By"}
              didSelect={this.didSelectSortBy.bind(this)}
              chosen={selectedSortBy}
              options={[
                SelectedSortBy.Name,
                SelectedSortBy.EnrichedPassages,
                SelectedSortBy.UnenrichedPassages,
                SelectedSortBy.UnfilteredPassages
              ]}
            />
          )}

          {selectedView === "Words" && (
            <Menus
              title={"Filter By"}
              didSelect={this.didSelectFilterBy.bind(this)}
              chosen={selectedFilterBy}
              options={ALPHABET}
            />
          )}
        </div>

        {selectedView === "Words" && <EnrichWordsMenu words={words} />}

        <List
          remove={this.remove.bind(this)}
          updateChoiceSet={this.updateChoiceSet.bind(this)}
          selectedView={selectedView}
          data={data}
        />
      </div>
    )
  }
}

export default Library
