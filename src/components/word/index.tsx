import * as React from "react"
import styled from "styled-components"
import * as _ from "underscore"

import Header from "../common/header"
import Text from "../common/text"

import { colors } from "../../lib/colors";
import { fetchWord } from "../../models/word"

const Interpunct = styled.div`
  width: 3px;
  height: 3px;
  border-radius: 5px;
  margin: 0px 4px;
  background-color: ${colors.gray};
`

const ComponentText = Text.l.extend`
  display: flex;
  align-items: center;
`

interface SpanProps {
  highlight: boolean
}

const Span = styled.span`
  color: ${(p: SpanProps) => p.highlight ? colors.warmYellow : colors.gray};
`

interface State {
  word?: any
}

class Word extends React.Component<any, State> {
  constructor(props: any) {
    super(props)
    this.state = {}
  }

  public componentDidMount() {
    this.loadData()
  }

  public async loadData() {
    const id = _.last(window.location.pathname.split("/"))
    const word = await fetchWord(id!)
    if (word instanceof Error) {
      // TODO: - handle
    } else {
      console.log(word)
      this.setState({ word })
    }
  }

  public render() {
    const word = this.state.word

    const componentsOfWord = (components: any[]): JSX.Element => <ComponentText>
      {components.map((c: any): any => <Span key={c.value} highlight={c.isRoot}>
        {c.value}
      </Span>).reduce((prev: any, curr: any, i: number) => [prev, <Interpunct key={i} />, curr])}
    </ComponentText>

    const definitionOfWord = (definition: any[]): JSX.Element => <Text.l>
      {definition.map((d: any, i: number) => <Span key={i} highlight={d.highlight}>
        {d.value}
      </Span>)}
    </Text.l>

    const content = (data: any) => (
      <div>
        <Header.l>Word // {data.value}</Header.l>
        {data.isDecomposable && componentsOfWord(data.components)}
        <br />
        {definitionOfWord(data.definition)}
        <br />
        {data.obscurity && <Text.l>{`obscurity : ${data.obscurity}`}</Text.l>}
      </div>
    )

    return word ? content(word) : null
  }
}

export default Word
