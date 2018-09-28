import * as React from "react"
import * as _ from "underscore"

import Input from "../common/input"
import Minimize from "../common/minimize"
import Text from "../common/text"

import { SearchContainer, SearchForm, Span } from "./components"
import { MainDisplay } from "./"

import { colors } from "../../lib/colors"

interface State {
  redirect?: string
  search?: string
  expanded: boolean
}

interface Props {
  isLoading: boolean
  query: (search: string) => void
  results?: string[]
  type: string
  hasResults: boolean
  placeholder: string
  removeLink?: (result: string) => void
  addLinkToPredictiveCorpus?: (result: string) => void
  mainDisplay?: MainDisplay
  predictiveCorpusLinks?: string[]
}

class Search extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      expanded: true
    }
  }

  public submit(e: any) {
    e.preventDefault()
    if (this.state.search) {
      this.props.query(this.state.search)
    }
  }

  public componentWillReceiveProps(nextProps: Props) {
    const minimize = nextProps.isLoading && !this.props.isLoading
    const expand =
      nextProps.results && !_.isEqual(nextProps.results, this.props.results)
    if (minimize) {
      this.setState({ expanded: false })
    } else if (expand) {
      this.setState({ expanded: true })
    }
  }

  public render() {
    const { expanded, search } = this.state
    const {
      hasResults,
      results,
      placeholder,
      type,
      mainDisplay,
      predictiveCorpusLinks
    } = this.props

    const showResults = hasResults && expanded

    const resultsLength = hasResults && results!.length
    const typeText = hasResults && results!.length === 1 ? type : `${type}s`

    const placeholderText = hasResults
      ? `${resultsLength} ${typeText}`
      : placeholder

    const spanColor =
      mainDisplay === MainDisplay.Passages ? colors.red : colors.green

    const span = (result: string): any => (
      <Span
        color={
          mainDisplay === MainDisplay.PredictiveCorpus &&
          _.includes(predictiveCorpusLinks!, result)
            ? colors.green
            : colors.gray
        }
        hoverColor={spanColor}
        onClick={() =>
          mainDisplay === MainDisplay.Passages
            ? this.props.removeLink!(result)
            : this.props.addLinkToPredictiveCorpus!(result)
        }
        key={result}
      >
        {result}
      </Span>
    )

    const resultsList = () => (
      <Text.s>
        {type === "word"
          ? results!.join(", ")
          : results!
              .map(span)
              .reduce((prev: any, curr: any, i: number) => [prev, ", ", curr])}
      </Text.s>
    )

    return (
      <SearchContainer expanded={showResults}>
        <SearchForm onSubmit={this.submit.bind(this)}>
          <Input.box
            padding={!showResults}
            onFocus={() => {
              if (hasResults && !expanded) {
                this.setState({ expanded: true })
              }
            }}
            border={showResults ? "" : `4px solid ${colors.lightGray}`}
            value={search || ""}
            placeholder={placeholderText}
            onChange={e => {
              if (type !== "word") {
                this.setState({ search: e.target.value })
              }
            }}
          />

          <Minimize
            hide={!showResults}
            onClick={() => this.setState({ expanded: !expanded })}
          />
        </SearchForm>

        {showResults && resultsList()}
      </SearchContainer>
    )
  }
}

export default Search
