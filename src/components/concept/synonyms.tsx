import * as React from "react"
import styled from "styled-components"
import * as _ from "underscore"

import Button from "../common/button"
import Header from "../common/header"
import Input from "../common/input"
import Text from "../common/text"

import { colors } from "../../lib/colors"

const Form = styled.form`
  position: relative;
  width: 150px;
`

const Autocomplete = styled.div`
  border: 1px solid ${colors.gray};
  position: absolute;
  box-sizing: border-box;
  width: 100%;
  background-color: white;
  padding: 8px;
  cursor: pointer;
`

interface Props {
  word: any
  keywordValues: string[]
  update: (word: any) => void
}

interface State {
  autocomplete: string[]
  synonym: string
}

class SynonymsComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      autocomplete: [],
      synonym: ""
    }
  }

  public removeSynonym(i: number) {
    const { word } = this.props
    word.synonyms.splice(i, 1)
    this.props.update(word)
  }

  public addSynonym(synonym: string) {
    const word = this.props.word

    if (synonym.length && word.synonyms.indexOf(synonym) === -1) {
      word.synonyms.push(synonym)
      this.props.update(word)
      this.setState({ autocomplete: [], synonym: "" })
    }
  }

  public changeSynonym(synonym: string) {
    const autocomplete = synonym.length
      ? this.props.keywordValues
          .filter(k => k.startsWith(synonym))
          .filter(k => !_.includes(this.props.word.synonyms, k))
          .sort()
          .slice(0, 5)
      : []
    this.setState({ autocomplete, synonym })
  }

  public render() {
    const { autocomplete, synonym } = this.state
    const { word } = this.props

    const synonyms = word.synonyms.map((s: string, i: number) => (
      <Button.circ
        marginRight={"5px"}
        onClick={() => this.removeSynonym(i)}
        key={i}
      >
        {s}
      </Button.circ>
    ))

    return (
      <div style={{ marginTop: "30px" }}>
        <Header.s>synonyms</Header.s>

        {synonyms}

        <Form
          onSubmit={e => {
            e.preventDefault()
            this.addSynonym(synonym)
          }}
        >
          <Input.m
            width={"150px"}
            placeholder={"+"}
            type="text"
            onChange={e => this.changeSynonym(e.target.value)}
            value={synonym}
          />
          {autocomplete.length ? (
            <Autocomplete>
              {autocomplete.map(a => (
                <Text.l onClick={() => this.addSynonym(a)} key={a}>
                  {a}
                </Text.l>
              ))}
            </Autocomplete>
          ) : null}
        </Form>
      </div>
    )
  }
}

export default SynonymsComponent
