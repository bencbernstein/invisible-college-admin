import * as React from "react"
import styled from "styled-components"
import { colors } from "../../lib/colors"

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

interface Props {
  completion: number
  goTo: (newIdx: number) => void
}

export default class ProgressBar extends React.Component<Props, any> {
  constructor(props: Props) {
    super(props)
  }

  public render() {
    const { completion } = this.props

    return (
      <Container>
        <Background />
        <Progress completion={completion} />
      </Container>
    )
  }
}
