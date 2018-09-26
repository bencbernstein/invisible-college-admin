import * as React from "react"

import Button from "../common/button"
import Header from "../common/header"
import Text from "../common/text"
import Slider from "rc-slider"
import "rc-slider/assets/index.css"

import { Textarea, Divider, FlexedDiv, SettingsHeader } from "./components"
import { MainDisplay } from "./"
import { colors } from "../../lib/colors"

interface Props {
  editedSearchWords: (str: string) => void
  editedContext: (e: number) => void
  context: number
  mainDisplay: MainDisplay
  changeMainDisplay: (m: MainDisplay) => void
  hasLinks: boolean
  hasSearchWords: boolean
  searchWords: string[]
  hasPredictiveCorpusLinks: boolean
  isLoading: boolean
  runPassageSearch: () => void
  runPredictiveCorpus: () => void
}

class Settings extends React.Component<Props, any> {
  constructor(props: Props) {
    super(props)
    this.state = {}
  }

  public render() {
    const {
      context,
      mainDisplay,
      hasLinks,
      hasSearchWords,
      searchWords,
      isLoading,
      hasPredictiveCorpusLinks
    } = this.props

    const passageSearchDirections = (
      <div>
        <Text.regular
          style={{ marginTop: "10px" }}
          color={hasLinks ? colors.blue : colors.lightGray}
        >
          <span style={{ marginRight: "10px" }}>1</span>
          Enter search article
        </Text.regular>
        <Text.regular
          color={hasSearchWords ? colors.blue : colors.lightGray}
          style={{ marginTop: "10px" }}
        >
          <span style={{ marginRight: "10px" }}>2</span>
          Enter search words
        </Text.regular>

        <Button.regular
          onClick={this.props.runPassageSearch.bind(this)}
          disabled={!hasLinks || !hasSearchWords || isLoading}
          style={{ width: "100%" }}
        >
          Search
        </Button.regular>
      </div>
    )

    const predictiveCorpusDirections = (
      <div>
        <Text.regular
          style={{ marginTop: "10px" }}
          color={hasPredictiveCorpusLinks ? colors.blue : colors.lightGray}
        >
          <span style={{ marginRight: "10px" }}>1</span>
          Select articles (max 10)
        </Text.regular>

        <Button.regular
          onClick={this.props.runPredictiveCorpus.bind(this)}
          disabled={!hasPredictiveCorpusLinks || isLoading}
          style={{ width: "100%" }}
        >
          Search
        </Button.regular>
      </div>
    )

    return (
      <div>
        <Header.l>Discover</Header.l>

        <Divider />

        <Textarea
          spellCheck={false}
          value={searchWords.join(", ")}
          onChange={e => this.props.editedSearchWords(e.target.value)}
          placeholder="Search words"
        />

        <Divider />

        <FlexedDiv justifyContent={"space-between"}>
          <SettingsHeader>context</SettingsHeader>
          <Text.s>0 - 10 sentences</Text.s>
        </FlexedDiv>
        <Slider
          value={context}
          onChange={e => this.props.editedContext(e)}
          style={{ margin: "10px 0px 40px 0px" }}
          min={0}
          max={10}
          marks={{ 0: "0", 5: "5", 10: "10" }}
        />

        <Divider />

        <SettingsHeader>DIRECTIONS</SettingsHeader>

        {mainDisplay === MainDisplay.PredictiveCorpus
          ? predictiveCorpusDirections
          : passageSearchDirections}

        {hasLinks && (
          <div>
            <Divider />
            <SettingsHeader>VIEW</SettingsHeader>
            <FlexedDiv>
              <input
                type="radio"
                onChange={() =>
                  this.props.changeMainDisplay(MainDisplay.Passages)
                }
                checked={mainDisplay === MainDisplay.Passages}
              />
              <Text.s>Passages</Text.s>
              <input
                type="radio"
                onChange={() =>
                  this.props.changeMainDisplay(MainDisplay.PredictiveCorpus)
                }
                checked={mainDisplay === MainDisplay.PredictiveCorpus}
              />
              <Text.s>Predictive Corpus</Text.s>
            </FlexedDiv>
          </div>
        )}
      </div>
    )
  }
}

export default Settings
