import * as React from "react"

import { StyledImage, Box, NextButton, StyledText, Source } from "./components"
import { Image, Factoid } from "../"

import next from "../../../lib/images/gameplay/icon-next.png"

interface Props {
  element: Image | Factoid
  nextQuestion: (sleepDuration: number) => void
}

export default class Prompt extends React.Component<Props, any> {
  constructor(props: any) {
    super(props)
    this.state = {}
  }

  public render() {
    const { element } = this.props

    const { base64 } = element as Image
    const { title, value } = element as Factoid

    return (
      <Box>
        {base64 && <StyledImage src={base64} />}

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
