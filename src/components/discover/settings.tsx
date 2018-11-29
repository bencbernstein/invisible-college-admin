import { connect } from "react-redux"
import * as React from "react"

import Button from "../common/button"
import Text from "../common/text"

import { Textarea, Divider, SettingsHeader } from "./components"

import { colors } from "../../lib/colors"
import COLLECTIONS from "../../lib/collections"

import { PassageResult } from "../../models/discover"
import FlexedDiv from "../common/flexedDiv"

interface Props {
  editedSearchWords: (str: string) => void
  hasSearchWords: boolean
  isLoading: boolean
  searchWords: string[]
  hasSearchCollections: boolean
  runPassageSearch: () => void
  exportPassages: () => void
  editedSearchCollections: (name: string) => void
  canExport: boolean
  passageResults: PassageResult[]
  searchCollections: string[]
}

class Settings extends React.Component<Props, any> {
  constructor(props: Props) {
    super(props)
    this.state = {}
  }

  public render() {
    const {
      hasSearchWords,
      searchWords,
      canExport,
      isLoading,
      searchCollections,
      hasSearchCollections
    } = this.props

    const passageSearchDirections = (
      <div>
        <Text.regular
          style={{ marginTop: "10px" }}
          color={hasSearchCollections ? colors.blue : colors.lightGray}
        >
          <span style={{ marginRight: "10px" }}>1</span>
          Select collections to search
        </Text.regular>
        <Text.regular
          color={hasSearchWords ? colors.blue : colors.lightGray}
          style={{ marginTop: "10px" }}
        >
          <span style={{ marginRight: "10px" }}>2</span>
          Enter search words
        </Text.regular>

        <Button.regular
          margin={"10px 0px 3px 0px"}
          onClick={this.props.runPassageSearch.bind(this)}
          disabled={!hasSearchCollections || !hasSearchWords || isLoading}
          style={{ width: "100%" }}
        >
          Search
        </Button.regular>

        <Button.regular
          margin={"3px 0"}
          onClick={this.props.exportPassages.bind(this)}
          disabled={!canExport || isLoading}
          style={{ width: "100%" }}
        >
          Create Queue
        </Button.regular>

        <Button.regular
          margin={"3px 0"}
          disabled={!canExport || isLoading}
          style={{ width: "100%" }}
        >
          <a
            style={{ color: colors.gray, textDecoration: "none" }}
            download="data.json"
            href={`data: text/json;charset=utf-8,${encodeURIComponent(
              JSON.stringify(this.props.passageResults)
            )}`}
          >
            Download
          </a>
        </Button.regular>
      </div>
    )

    return (
      <div>
        <SettingsHeader>COLLECTIONS</SettingsHeader>
        {COLLECTIONS.map((name: string) => (
          <FlexedDiv
            key={name}
            justifyContent="flex-start"
            style={{ marginTop: "5px" }}
          >
            <input
              readOnly={true}
              checked={searchCollections.indexOf(name) > -1}
              onClick={() => this.props.editedSearchCollections(name)}
              type="radio"
            />
            <Text.s style={{ textTransform: "capitalize", marginLeft: "5px" }}>
              {name}
            </Text.s>
          </FlexedDiv>
        ))}
        <Divider />
        <Textarea
          spellCheck={false}
          value={searchWords.join(", ")}
          onChange={e => this.props.editedSearchWords(e.target.value)}
          placeholder="Search words"
        />
        <Divider />
        <SettingsHeader>DIRECTIONS</SettingsHeader>
        {passageSearchDirections}
      </div>
    )
  }
}

const mapStateToProps = (state: any, ownProps: any) => ({
  isLoading: state.entities.isLoading === true
})

export default connect(mapStateToProps)(Settings)
