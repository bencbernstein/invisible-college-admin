import * as React from "react"
import styled from "styled-components"

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
  tag: string
}

class TagsComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      autocomplete: [],
      tag: ""
    }
  }

  public removeTag(i: number) {
    const { word } = this.props
    word.tags.splice(i, 1)
    this.props.update(word)
  }

  public addTag(tag: string) {
    const word = this.props.word

    if (tag.length && word.tags.map((t: any) => t.value).indexOf(tag) === -1) {
      word.tags.push({ value: tag })
      this.props.update(word)
      this.setState({ autocomplete: [], tag: "" })
    }
  }

  public changeTag(tag: string) {
    // TODO: - fix
    // const { word, keywords } = this.props
    // const words = keywords ? keywords.words.concat(keywords.choices) : []
    // const autocomplete = words
    //   .filter(w => w.startsWith(tag))
    //   .filter(w => word.tags.map(t => t.value).indexOf(w) === -1)
    //   .sort()
    //   .slice(0, 5)
    // this.setState({ autocomplete, tag })
  }

  public render() {
    const { autocomplete, tag } = this.state
    const { word } = this.props

    const tags = word.tags.map((t: any, i: number) => (
      <Button.regular
        margin={"0 5px 0 0"}
        onClick={() => this.removeTag(i)}
        key={i}
      >
        {t.value}
      </Button.regular>
    ))

    return (
      <div style={{ marginTop: "30px" }}>
        <Header.s>tags</Header.s>

        {tags}

        <Form
          onSubmit={e => {
            e.preventDefault()
            this.addTag(tag)
          }}
        >
          <Input.m
            width={"150px"}
            placeholder={"+"}
            type="text"
            onChange={e => this.changeTag(e.target.value)}
            value={tag}
          />
          {autocomplete.length ? (
            <Autocomplete>
              {autocomplete.map(a => (
                <Text.l onClick={() => this.addTag(a)} key={a}>
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

export default TagsComponent
