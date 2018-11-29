import * as React from "react"
import styled from "styled-components"
import { flatten } from "lodash"

import Text from "../common/text"
import Header from "../common/header"
import Box from "../common/box"
import ListContainer from "../common/listContainer"

import Subnav from "../nav/subnav"

import { Passage, fetchEnrichedPassages } from "../../models/passage"
import { Tag } from "../../models/passage"

import { highlight, toSentences } from "../../lib/helpers"

interface State {
  passages: Passage[]
}

interface SpanProps {
  color: string
  tag: Tag
  marginLeft: boolean
}
const Span = styled.span`
  display: inline-block;
  color: ${(p: SpanProps) => p.color};
  margin-left: ${(p: SpanProps) => (p.marginLeft ? "2.5px" : "0px")};
  text-decoration: ${(p: SpanProps) =>
    p.tag.isUnfocused
      ? "line-through"
      : p.tag.isFocusWord
      ? "underline"
      : "none"};
`

class PassagesComponent extends React.Component<any, State> {
  constructor(props: any) {
    super(props)

    this.state = {
      passages: []
    }
  }

  public async componentDidMount() {
    const passages = await fetchEnrichedPassages()
    if (!(passages instanceof Error)) {
      passages.sort((a, b) => a.difficulty - b.difficulty)
      this.setState({ passages })
    }
  }

  public render() {
    const { passages } = this.state

    const span = (tag: Tag, i: number) => (
      <Span
        marginLeft={!tag.isPunctuation}
        tag={tag}
        color={highlight(tag)}
        key={i}
      >
        {tag.value}
      </Span>
    )

    const box = (p: Passage, idx: number) => (
      <Box.regular key={idx}>
        <Text.regular>
          {flatten(
            toSentences(p.tagged).filter(
              (tags: Tag[], i: number) => p.filteredSentences.indexOf(i) > -1
            )
          ).map(span)}
        </Text.regular>
        <Header.s>{`difficulty - ${p.difficulty}`}</Header.s>
      </Box.regular>
    )

    return (
      <div>
        <Subnav
          minimized={false}
          title={"Passages"}
          subtitle="Library"
          subtitleLink="/library"
        />
        <ListContainer>{passages.map(box)}</ListContainer>
      </div>
    )
  }
}

export default PassagesComponent
