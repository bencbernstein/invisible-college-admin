import * as React from "react"
import styled from "styled-components"

import Button from "../common/button"
import Header from "../common/header"
import Text from "../common/text"

import { colors } from "../../lib/colors"
import { Unverified } from "./"

const Container = styled.div`
  margin-top: 30px;
  position: relative;
  padding: 10px 0px;
`

const Background = styled.div`
  position: absolute;
  background-color: ${colors.lightGray};
  margin-left: calc(50% - 50vw);
  width: 100vw;
  height: 100%;
  left: 0;
  z-index: -5;
`

interface Props {
  unverified: Unverified
  addUnverified: (attr: string, value: string) => {}
}

class UnverifiedComponent extends React.Component<Props, any> {
  constructor(props: Props) {
    super(props)
    this.state = {}
  }

  public render() {
    const { definition, tags, synonyms } = this.props.unverified

    const hasTags = tags && tags.length > 0
    const hasSynonyms = synonyms && synonyms.length > 0
    const hasContent = definition || hasTags || hasSynonyms

    if (!hasContent) {
      return null
    }

    const definitionComponent = (value: string) => (
      <div>
        <Header.s>definition</Header.s>
        <Text.l
          onClick={() => this.props.addUnverified("definition", value)}
          pointer={true}
        >
          {value}
        </Text.l>
      </div>
    )

    const listComponent = (elems: string[], type: string) => (
      <div>
        <Header.s>{type}</Header.s>
        {elems.map(value => (
          <Button.circ
            onClick={() => this.props.addUnverified(type, value)}
            marginRight={"5px"}
            key={value}
          >
            {value}
          </Button.circ>
        ))}
      </div>
    )

    return (
      <Container>
        <Background />
        <div style={{ marginBottom: "10px" }}>
          <Header.m style={{ display: "inline-block" }}>unverified</Header.m>
          <Text.regular style={{ display: "inline-block", marginLeft: "10px" }}>
            *click to use
          </Text.regular>
        </div>
        {definition && definitionComponent(definition)}
        {hasSynonyms && listComponent(synonyms!, "synonyms")}
        {hasTags && listComponent(tags!, "tags")}
      </Container>
    )
  }
}

export default UnverifiedComponent
