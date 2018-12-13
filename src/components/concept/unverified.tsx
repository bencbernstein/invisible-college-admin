import * as React from "react"
import styled from "styled-components"

import Button from "../common/button"
import Header from "../common/header"
import Text from "../common/text"

import { colors } from "../../lib/colors"

const Container = styled.div`
  margin-top: 30px;
  position: relative;
  padding: 10px 0px;
`

const Suggestions = styled.div`
  position: relative;
  z-index: 3;
`

const Heading = styled.div`
  margin-bottom: 10px;
  position: relative;
  z-index: 3;
`

const Background = styled.div`
  position: absolute;
  background-color: ${colors.lightGray};
  margin-left: calc(50% - 50vw);
  width: 100vw;
  height: 100%;
  left: 0;
  z-index: 1;
`

interface Props {
  word: any
  attr: string
  addUnverified: (attr: string, value: string) => {}
}

interface State {
  unverified: string[]
}

class UnverifiedComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      unverified: []
    }
  }

  public async componentDidMount() {
    this.enrich(this.props.word.value)
  }

  public componentWillReceiveProps(nextProps: Props) {
    const { value } = nextProps.word
    if (this.props.word.value && this.props.word.value !== value) {
      this.setState({ unverified: [] }, () => this.enrich(value))
    }
  }

  public async enrich(value: string) {
    const { attr } = this.props
    console.log(attr)
    // const enriched = await enrichWord(value)
    // if (enriched[attr]) {
    //   const unverified = Array.isArray(enriched[attr])
    //     ? enriched[attr]
    //     : [enriched[attr]]
    //   this.setState({ unverified })
    // }
  }

  public render() {
    const { unverified } = this.state

    const { attr } = this.props

    const suggestions = unverified.map(value => (
      <Button.regular
        margin={"0 5px 0 0"}
        key={value}
        onClick={() => this.props.addUnverified(attr, value)}
        marginRight={"5px"}
      >
        {value}
      </Button.regular>
    ))

    if (suggestions.length === 0) {
      return null
    }

    return (
      <Container>
        <Background />

        <Heading>
          <Header.m style={{ display: "inline-block" }}>unverified</Header.m>
          <Text.regular style={{ display: "inline-block", marginLeft: "10px" }}>
            *click to add
          </Text.regular>
        </Heading>

        <Suggestions>{suggestions}</Suggestions>
      </Container>
    )
  }
}

export default UnverifiedComponent
