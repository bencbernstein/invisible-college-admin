import * as React from "react"
import { Link } from "react-router-dom"

import Button from "../common/button"
import Header from "../common/header"

import {
  Span,
  SubnavBox,
  ButtonsBox
} from "./components"

import { colors } from "../../lib/colors"

interface Props {
  title: string
  invert?: boolean
  subtitle?: string
  subtitleLink?: string
  minimized: boolean
  next?: () => void
  isEnriching?: boolean
}


class Subnav extends React.Component<Props, any> {
  public render() {
    const { title, subtitle, subtitleLink, invert, isEnriching, minimized } = this.props

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

    const nextButton = (isEnriching && this.props.next !==  undefined) ? <Button.circ 
      marginRight={"10px"}
      onClick={this.props.next.bind(this)}>
      Next
    </Button.circ> : null

    return (
      <SubnavBox minimized={minimized}>
        {!minimized && <Header.l uppercase={true}>
          {headerComponents()}
        </Header.l>}
        <ButtonsBox>
          {nextButton}
        </ButtonsBox>
      </SubnavBox>
    )
  }
}

export default Subnav
