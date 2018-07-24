import * as React from "react"
import styled from "styled-components"
// import * as _ from "underscore"

import { colors } from "../../lib/colors"
import { Alert } from "../app"
import Header from "../common/header"
import Text from "../common/text"

import { addWord, enrichWord } from "../../models/word"
// import { colors } from "../../lib/colors"

const Container = styled.div`
  width: 90%;
  background-color: white;
  border: 1px solid black;
  bottom: 20px;
  position: fixed;
  margin: 0 auto;
  left: 5%;
  padding: 10px 10px 20px 10px;
  box-sizing: border-box;
`

interface Props {
  value: string
  alert: (alert: Alert) => {}
}

interface State {
  isEnriching?: string
}

class WordModal extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {}

    this.handleKeyDown = this.handleKeyDown.bind(this)
  }

  public componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown)
  }

  public componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown)
  }

  public handleKeyDown(e: any) {
    if (this.state.isEnriching) {
      return
    } else if (e.key === "A") {
      this.addWord(this.props.value)
    } else if (e.key === "E") {
      // retrieve enrichment and show in create box
      const isEnriching = this.props.value
      this.setState({ isEnriching }, () => this.enrichWord(isEnriching))
    }
  }

  public async addWord(value: string) {
    await addWord(value)
    this.props.alert({ message: `Word Added! (${value})`, success: true })
  }

  public async enrichWord(value: string) {
    const result = await enrichWord(value)
    console.log(result)
  }

  public render() {
    const value = this.props.value.toLowerCase()

    const span = (str: string, color: string) => (
      <span style={{ color, fontFamily: "EBGaramondSemiBold" }}>{str}</span>
    )

    return (
      <Container>
        <Header.s>{value}</Header.s>
        <Text.garamond>
          Press {span("A", colors.green)} to {span("add", colors.green)}
        </Text.garamond>
        <Text.garamond>
          Press {span("E", colors.orange)} to {span("enrich", colors.orange)}
        </Text.garamond>
      </Container>
    )
  }
}

export default WordModal
