import * as React from "react"
import { Redirect } from "react-router"
import { Link } from "react-router-dom"
import styled from "styled-components"
import { colors } from "../../lib/colors"

import Button from "../common/button"
import Header from "../common/header"

interface ContainerProps {
  minimized: boolean
}
const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${(p: ContainerProps) => (p.minimized ? "flex-end" : "space-between")};
  width: 100%;
`

const ButtonsContainer = styled.div`
  display: flex;
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
  invert?: boolean
  subtitle?: string
  subtitleLink?: string
  play?: () => void
  minimized: boolean
  next?: () => void
  isEnriching?: boolean
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
    const { title, subtitle, subtitleLink, invert, play, next, isEnriching, minimized } = this.props

    if (redirect) { return <Redirect to={redirect} /> }

    const headerComponents = () => {
      const header = <Span key={1}>
        {title}
      </Span>
      
      const subheader = <Link
        key={2}
        style={{ textDecoration: "none" }}
        to={subtitleLink!}>
        <Span key={3} color={colors.lightGray}>
          {subtitle}
        </Span>
      </Link>

      const divider = <Span key={4} color={colors.mediumGray}> // </Span>

      if (!subtitle) {
        return title
      }

      return invert
        ? [subheader, divider, header]
        : [header, divider, subheader]
    }

    const nextButton = next && <Button.circ 
      marginRight={"10px"}
      onClick={next.bind(this)}>
      Next
    </Button.circ>

    const playButton = play && <Button.circ onClick={play.bind(this)}>
      Play
    </Button.circ>

    return (
      <Container minimized={minimized}>
        {!minimized && <Header.l>
          {headerComponents()}
        </Header.l>}
        <ButtonsContainer>
          {isEnriching && nextButton}
          {playButton}
        </ButtonsContainer>
      </Container>
    )
  }
}

export default Subnav
