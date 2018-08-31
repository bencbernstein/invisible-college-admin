import * as React from "react"
import styled from "styled-components"

import Button from "../common/button"
import Header from "../common/header"
import Input from "../common/input"

import { Word } from "./"

const Form = styled.form`
  position: relative;
  width: 150px;
`

interface Props {
  word: Word
  update: (word: Word) => void
}

interface State {
  otherForm: string
}

class OtherFormsComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      otherForm: ""
    }
  }

  public removeOtherForm(i: number) {
    const { word } = this.props
    word.otherForms.splice(i, 1)
    this.props.update(word)
  }

  public addOtherForm(otherForm: string) {
    const word = this.props.word

    if (otherForm.length && word.otherForms.indexOf(otherForm) === -1) {
      word.otherForms.push(otherForm)
      this.props.update(word)
      this.setState({ otherForm: "" })
    }
  }

  public render() {
    const { otherForm } = this.state
    const { word } = this.props

    const otherForms = word.otherForms.map((o: string, i: number) => (
      <Button.circ
        marginRight={"5px"}
        onClick={() => this.removeOtherForm(i)}
        key={i}
      >
        {o}
      </Button.circ>
    ))

    return (
      <div style={{ marginTop: "30px" }}>
        <Header.s>other forms</Header.s>

        {otherForms}

        <Form
          onSubmit={e => {
            e.preventDefault()
            this.addOtherForm(otherForm)
          }}
        >
          <Input.m
            width={"150px"}
            placeholder={"+"}
            type="text"
            onChange={e => this.setState({ otherForm: e.target.value })}
            value={otherForm}
          />
        </Form>
      </div>
    )
  }
}

export default OtherFormsComponent
