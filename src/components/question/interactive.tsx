import * as React from "react"
import { includes } from "lodash"

import { InteractiveBox, Span } from "./components"

import { InteractivePart } from "../../models/question"

import { isPunc } from "../../lib/helpers"

interface Props {
  data: InteractivePart[]
  guessed: (count: number) => void
}

interface State {
  guessedCorrectly: number[]
}

export default class Prompt extends React.Component<Props, State> {
  constructor(props: any) {
    super(props)
    this.state = {
      guessedCorrectly: []
    }
  }

  public clicked(part: InteractivePart, idx: number) {
    const { guessedCorrectly } = this.state
    const { correct } = part

    if (correct) {
      guessedCorrectly.push(idx)
      this.setState({ guessedCorrectly })
    }

    this.props.guessed(guessedCorrectly.length)
  }

  public render() {
    const { data } = this.props
    const { guessedCorrectly } = this.state

    const span = (p: InteractivePart, i: number): any => (
      <Span
        isInteractive={true}
        guessedCorrectly={includes(guessedCorrectly, i)}
        onClick={() => this.clicked(p, i)}
        key={i}
      >
        {p.value}
      </Span>
    )

    return (
      <InteractiveBox>
        {data
          .map(span)
          .reduce((prev: any[], curr: any, i: number) => [
            prev,
            isPunc(data[i].value) ? "" : " ",
            curr
          ])}
      </InteractiveBox>
    )
  }
}
