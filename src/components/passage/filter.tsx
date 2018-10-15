import * as React from "react"
import * as _ from "underscore"

import Slider from "rc-slider"
import "rc-slider/assets/index.css"
import Header from "../common/header"
import { Span, Sentence, PassageContainer, Icons, Icon } from "./components"

import { Tag } from "../../models/text"
import { Passage } from "../../models/passage"

import nextImg from "../../lib/images/icon-next.png"
import checkImg from "../../lib/images/icon-checkmark.png"
import { colors } from "../../lib/colors"

interface Props {
  passage: Passage
  sentenceCount: number
  sentences: Tag[][]
  nextPassage: (nextIdx: number, filteredSentences?: number[]) => void
  idx: number
}

interface State {
  filteredSentences: number[]
  context: number
}

class FilterComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      filteredSentences: [],
      context: 10
    }
  }

  public componentDidMount() {
    this.setFilteredSentences(this.props)
  }

  public componentWillReceiveProps(nextProps: Props) {
    if (this.props.passage.id !== nextProps.passage.id) {
      this.setFilteredSentences(nextProps)
    }
  }

  public setFilteredSentences(props: Props) {
    this.setState({ filteredSentences: props.passage.filteredSentences || [] })
  }

  public keepAllSentences() {
    const { filteredSentences } = this.state
    const { sentenceCount } = this.props

    const updated =
      filteredSentences.length === sentenceCount
        ? []
        : _.range(0, sentenceCount)
    this.setState({ filteredSentences: updated })
  }

  public handleClickedSentence(i: number) {
    let { filteredSentences } = this.state
    filteredSentences =
      filteredSentences.indexOf(i) > -1
        ? _.without(filteredSentences, i)
        : filteredSentences.concat(i)
    this.setState({ filteredSentences })
  }

  public render() {
    const { passage, sentences, idx } = this.props
    const { filteredSentences, context } = this.state

    const span = (tag: Tag, color: string, i: number) => (
      <Span key={i} color={color} highlight={tag.wordId || tag.choiceSetId}>
        {tag.isPunctuation ? tag.value : ` ${tag.value}`}
      </Span>
    )

    const sentenceComponents = sentences
      .map((tags: Tag[], i: number) => (
        <Sentence
          onClick={() => this.handleClickedSentence(i)}
          underline={_.includes(filteredSentences, i)}
          key={i}
        >
          {tags.map((t: Tag, i2: number) =>
            span(t, i === passage.matchIdx ? "black" : colors.lighterGray, i2)
          )}
        </Sentence>
      ))
      .slice(
        Math.max(passage.matchIdx - context, 0),
        passage.matchIdx + context + 1
      )

    return (
      <PassageContainer>
        {sentenceComponents}
        <Header.s margin="20px 0 0 0">context</Header.s>
        <Slider
          value={context}
          onChange={newContext => this.setState({ context: newContext })}
          style={{ margin: "10px 0 0 0", width: "150px" }}
          min={0}
          max={10}
          marks={{ 0: "0", 5: "5", 10: "10" }}
        />
        <Icons>
          <Icon
            disable={idx === 0}
            onClick={() => this.props.nextPassage(idx - 1, filteredSentences)}
            flipHorizontal={true}
            src={nextImg}
          />
          <Icon onClick={this.keepAllSentences.bind(this)} src={checkImg} />
          <Icon
            onClick={() => this.props.nextPassage(idx + 1, filteredSentences)}
            src={nextImg}
          />
        </Icons>
      </PassageContainer>
    )
  }
}

export default FilterComponent
