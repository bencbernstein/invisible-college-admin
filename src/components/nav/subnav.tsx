import * as React from "react"
import { Redirect } from "react-router"
import { Link } from "react-router-dom"
import styled from "styled-components"
import { colors } from "../../lib/colors"

import Button from "../common/button"
import Header from "../common/header"

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

interface SpanProps {
  color?: string
}

const Span = styled.span`
  text-transform: capitalize;
  color: ${(p: SpanProps) => p.color};
`

interface Props {
  title: string
  subtitle?: string
  subtitleLink?: string
  play?: () => {}
}

interface State {
  redirect?: string
}

class Subnav extends React.Component<Props, State> {
  constructor(props: any) {
    super(props)
    this.state = {}
  }


  public render() {
    const { redirect } = this.state
    const { title, subtitle, subtitleLink, play } = this.props

    if (redirect) {
      return <Redirect to={redirect} />
    }
    
    const subtitleComponent = subtitle && subtitleLink && <span>
      <Link style={{ textDecoration: "none" }} to={subtitleLink}>
        <Span color={colors.lightGray}>{subtitle}</Span>
      </Link>
      <Span color={colors.mediumGray}> // </Span>
    </span>

    const playButton = play && <Button.circ onClick={() => play()}>
      Play
    </Button.circ>

    return (
      <Container>
        <Header.l>
          {subtitleComponent}
          <Span>{title}</Span>
        </Header.l>
        {playButton}
      </Container>
    )
  }
}

export default Subnav
