import * as React from "react"
import styled from "styled-components"
import { colors } from "../../lib/colors"

import Text from "../common/text"

const Container = styled.div`
  width: 80%;
  position: relative;
`

const Background = styled.div`
  height: 10px;
  width: 100%;
  border-radius: 5px;
  background-color: ${colors.lightGray};
`

interface ProgressProps {
  completion: number
}

const Progress = styled.div`
  height: 10px;
  width: ${(p: ProgressProps) => p.completion * 100}%;
  border-radius: 5px;
  background-color: ${colors.yellow};
  position: absolute;
  top: 0;
`

const LinksContainer = styled.div`
  margin-top: 20px;
  width: 100%;
  position: absolute;
  display: flex;
  justify-content: space-between;
`

const Link = Text.s.extend`
  transform: rotate(20deg);
  cursor: pointer;
`

interface Props {
  completion: number
  questionLinks: string[]
  goTo: (newIdx: number) => void
}

export default class ProgressBar extends React.Component<Props, any> {
  constructor(props: Props) {
    super(props)
  }

  public render() {
    const { completion, questionLinks } = this.props

    const linkComponents = questionLinks.map((l: string, i: number) => (
      <Link onClick={() => this.props.goTo(i)} key={i}>
        {l}
      </Link>
    ))

    return (
      <Container>
        <Background />
        <Progress completion={completion} />
        <LinksContainer>{linkComponents}</LinksContainer>
      </Container>
    )
  }
}
