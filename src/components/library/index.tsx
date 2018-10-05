import { get } from "lodash"
import styled from "styled-components"
import * as React from "react"
import { Redirect } from "react-router"
import * as _ from "underscore"

import Button from "../common/button"
import Subnav from "../nav/subnav"
import List from "./list"
import EnrichWordsMenu from "./enrichWordsMenu"
import Menus from "../common/menu"

import {
  addChoice,
  fetchChoiceSets,
  removeChoice,
  removeChoiceSet
} from "../../models/choiceSet"
import { fetchTexts, removeText } from "../../models/text"
import { Word, fetchWords, removeWord } from "../../models/word"
import {
  PassageSequence,
  fetchPassageSequences
} from "../../models/passageSequence"

const FlexedDiv = styled.div`
  display: flex;
`

export enum SelectedView {
  ChoiceSets = "Choice Sets",
  Texts = "Texts",
  PassageSequences = "Passage Sequences",
  Words = "Words"
}

enum SelectedSortBy {
  Name = "Name",
  Passages = "# Passages",
  UnenrichedPassages = "# Unenriched Passages"
}

interface State {
  selectedView: SelectedView
  selectedSortBy: SelectedSortBy
  redirect?: string
  passageSequences: PassageSequence[]
  words: Word[]
  texts: any[]
  choiceSets: any[]
}

const viewForSearch = (search: string): SelectedView => {
  if (search.includes("choice-sets")) {
    return SelectedView.ChoiceSets
  } else if (search.includes("texts")) {
    return SelectedView.Texts
  } else if (search.includes("passage-sequences")) {
    return SelectedView.PassageSequences
  }
  return SelectedView.Words
}

class Library extends React.Component<any, State> {
  constructor(props: any) {
    super(props)

    this.state = {
      selectedView: viewForSearch(window.location.search),
      selectedSortBy: SelectedSortBy.Passages,
      passageSequences: [],
      words: [],
      texts: [],
      choiceSets: []
    }
  }

  public componentDidMount() {
    this.loadWords()
    this.loadTexts()
    this.loadChoiceSets()
    this.loadPassageSequence()
  }

  public async loadChoiceSets() {
    const choiceSets = await fetchChoiceSets(["id", "name", "choices"])
    this.setState({ choiceSets })
  }

  public async loadPassageSequence() {
    const passageSequences = await fetchPassageSequences()
    if (!(passageSequences instanceof Error)) {
      this.setState({ passageSequences })
    }
  }

  public async loadTexts() {
    const texts = await fetchTexts()
    if (!(texts instanceof Error)) {
      this.setState({ texts })
    }
  }

  public async loadWords(didChangeSort: boolean = false) {
    const { words, selectedSortBy } = this.state
    const sortBy = {
      Name: "value",
      "# Passages": "enrichedPassagesCount",
      "# Unenriched Passages": "acceptedPassagesCount"
    }[selectedSortBy]
    const last = didChangeSort ? undefined : get(_.last(words), sortBy)
    const add = await fetchWords(30, sortBy, last)
    if (!(add instanceof Error)) {
      words.push(...add)
      this.setState({ words: didChangeSort ? add : words })
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
      Texts: [texts, removeText],
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

  public didSelectView(selectedView: any): void {
    this.setState({ selectedView })
  }

  public didSelectSortBy(selectedSortBy: any): void {
    const { texts, selectedView } = this.state
    if (selectedView === "Texts") {
      const sorted =
        selectedSortBy === SelectedSortBy.Name
          ? _.sortBy(texts, "name")
          : _.sortBy(
              texts,
              selectedSortBy === SelectedSortBy.Passages
                ? "passagesCount"
                : "unenrichedPassagesCount"
            ).reverse()
      this.setState({ texts: sorted, selectedSortBy })
    } else if (selectedView === "Words") {
      console.log(selectedSortBy)
      this.setState({ selectedSortBy }, () => this.loadWords(true))
    }
  }

  public render() {
    const {
      choiceSets,
      selectedView,
      selectedSortBy,
      redirect,
      texts,
      passageSequences,
      words
    } = this.state

    if (redirect) {
      return <Redirect to={redirect} />
    }

    const data = {
      Words: words,
      Texts: texts,
      "Choice Sets": choiceSets,
      "Passage Sequences": passageSequences
    }[selectedView]

    return (
      <div>
        <Subnav
          minimized={false}
          subtitle={"gameplay"}
          subtitleLink={"/gameplay"}
          title={"library"}
        />

        <FlexedDiv>
          <Menus
            title={"View"}
            didSelect={this.didSelectView.bind(this)}
            chosen={selectedView}
            options={[
              SelectedView.ChoiceSets,
              SelectedView.PassageSequences,
              SelectedView.Texts,
              SelectedView.Words
            ]}
          />

          {selectedView !== "Choice Sets" && (
            <Menus
              title={"Sort By"}
              didSelect={this.didSelectSortBy.bind(this)}
              chosen={selectedSortBy}
              options={[
                SelectedSortBy.Name,
                SelectedSortBy.Passages,
                SelectedSortBy.UnenrichedPassages
              ]}
            />
          )}
        </FlexedDiv>

        {selectedView === "Words" && <EnrichWordsMenu words={words} />}

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
