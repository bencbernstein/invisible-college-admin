import * as React from "react"
import * as _ from "underscore"
import { Redirect } from "react-router"

import Button from "../common/button"
import Header from "../common/header"
import Text from "../common/text"
import FlexedDiv from "../common/flexedDiv"
import { Container, Textarea } from "./components"

import { camelize } from "../../lib/helpers"

import { wordsToEnrich, Word } from "../../models/word"

const WORD_ATTRIBUTES = [
  "all",
  "synonyms",
  "other forms",
  "definition",
  "tags",
  "obscurity",
  "images"
]

interface Props {
  words: Word[]
}

interface State {
  isOpen: boolean
  redirect?: string
  textareaValue: string
  attr: string
}

class EnrichWordsMenu extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      textareaValue: "",
      isOpen: false,
      attr: WORD_ATTRIBUTES[0]
    }
  }

  public async beginEnrichment() {
    const attr = camelize(this.state.attr)
    const words = _.compact(
      this.state.textareaValue.split(",").map(str => str.trim())
    )
    let ids: string[] = []

    if (words.length) {
      ids = this.props.words
        .filter(word => words.indexOf(word.value) > -1)
        .map(word => word.id)
    } else {
      const docs = await wordsToEnrich(attr)
      if (!(docs instanceof Error)) {
        ids = docs.map(word => word.id)
      }
    }

    if (ids.length) {
      const id = ids.shift()
      const redirect = `/word/${id}?isEnriching=${attr}&next=${ids.join(",")}`
      this.setState({ redirect })
    }
  }

  public render() {
    const { isOpen, textareaValue, redirect } = this.state

    if (redirect) {
      return <Redirect to={redirect} />
    }

    if (!isOpen) {
      return (
        <Button.circ onClick={() => this.setState({ isOpen: true })}>
          Enrich
        </Button.circ>
      )
    }

    const radioButton = (attr: string) => (
      <FlexedDiv style={{ marginRight: "10px" }} key={attr}>
        <Text.s>{attr}</Text.s>
        <input
          type="radio"
          style={{ marginLeft: "5px" }}
          onChange={() => {
            this.setState({ attr })
          }}
          checked={attr === this.state.attr}
        />
      </FlexedDiv>
    )

    return (
      <Container>
        <Header.s>settings</Header.s>

        <Text.regular>
          Paste list of comma-separated words to enrich, if left blank random
          words will be chosen
        </Text.regular>
        <Textarea
          value={textareaValue}
          onChange={e => this.setState({ textareaValue: e.target.value })}
        />

        <Text.regular>Choose desired attributes to enrich</Text.regular>
        <FlexedDiv>{WORD_ATTRIBUTES.map(radioButton)}</FlexedDiv>

        <br />

        <Button.circ onClick={this.beginEnrichment.bind(this)}>
          Begin
        </Button.circ>
      </Container>
    )
  }
}

export default EnrichWordsMenu
