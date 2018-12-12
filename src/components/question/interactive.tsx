import * as React from "react"
import { includes, isEqual } from "lodash"

import { InteractiveBox, Span } from "./components"

import { InteractivePart } from "../../interfaces/question"

import { isPunc } from "../../lib/helpers"

interface Props {
  data: InteractivePart[]
  guessed: (correct: boolean, count: number) => void
  flex: number
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

  public componentWillReceiveProps(nextProps: Props) {
    if (!isEqual(this.props.data, nextProps.data)) {
      this.setState({ guessedCorrectly: [] })
    }
  }

  public clicked(part: InteractivePart, idx: number) {
    const { guessedCorrectly } = this.state
    const { correct } = part

    if (correct) {
      guessedCorrectly.push(idx)
      this.setState({ guessedCorrectly })
    }

    this.props.guessed(correct, guessedCorrectly.length)
  }

  public render() {
    const { data, flex } = this.props
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
      <InteractiveBox flex={flex}>
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
