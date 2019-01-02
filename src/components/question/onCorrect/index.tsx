import * as React from "react"

import { StyledImage, Box, NextButton, StyledText, Source } from "./components"
import { Image, Factoid } from "../"

import next from "../../../lib/images/gameplay/icon-next.png"

interface Props {
  element: Image | Factoid
  nextQuestion: (sleepDuration: number) => void
}

export default class Prompt extends React.Component<Props, any> {
  public render() {
    const { element } = this.props

    const { url } = element as Image
    const { title, value } = element as Factoid

    return (
      <Box>
        {url && <StyledImage src={`https://s3.amazonaws.com/${url}`} />}

        {value && (
          <StyledText>
            {value}
            <br />
            <Source>- {title}</Source>
          </StyledText>
        )}

        <NextButton onClick={() => this.props.nextQuestion(0)} src={next} />
      </Box>
    )
  }
}
