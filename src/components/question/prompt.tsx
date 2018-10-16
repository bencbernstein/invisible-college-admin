import { isString, isEqual, findIndex } from "underscore"
import * as React from "react"

import { PromptBox, Span, PromptUnderline, PromptText } from "./components"

import { PromptPart } from "../../models/question"

import { isPunc } from "../../lib/helpers"

interface Props {
  prompt: PromptPart[]
  type: string
  isReadMode: boolean
  isOverflowing: (bool: boolean) => {}
  bottom?: number
}

interface State {
  bottom?: number
}

export default class Prompt extends React.Component<Props, State> {
  constructor(props: any) {
    super(props)
    this.state = {}
  }

  public componentDidMount() {
    this.checkOverflow(this.props.prompt)
  }

  public componentDidUpdate(prevProps: Props) {
    if (!isEqual(this.props.prompt, prevProps.prompt)) {
      this.checkOverflow(this.props.prompt)
    }
  }

  public checkOverflow(prompt: PromptPart[]) {
    let isOverflowing = false
    const promptDiv = document.getElementById("prompt")

    if (promptDiv) {
      const { scrollHeight, clientHeight } = promptDiv
      const difference = scrollHeight - clientHeight
      isOverflowing = difference > 0
      const highlightIdx = findIndex(prompt, p => p.highlight)

      if (isOverflowing && highlightIdx > -1) {
        const location = highlightIdx / prompt.length
        const percentShown = clientHeight / scrollHeight
        const focusWordLikelyOutOfView = percentShown - 0.05 < location // pad 0.05 for assurance

        if (focusWordLikelyOutOfView) {
          const bottom =
            clientHeight * 0.5 + (location - percentShown) * scrollHeight
          this.setState({ bottom })
        }
      }
    }

    this.props.isOverflowing(isOverflowing)
  }

  public render() {
    const { prompt, type, isReadMode } = this.props

    const span = (p: PromptPart, i: number) =>
      p.value === "_underline_" ? (
        <PromptUnderline />
      ) : (
        <Span key={i} highlight={p.highlight}>
          {isPunc(p.value) ? p.value : ` ${p.value || ""}`}
        </Span>
      )

    const isImage =
      type === "WORD_TO_IMG" &&
      isString(prompt[0].value) &&
      prompt[0].value!.startsWith("data:image")

    const length = prompt.map(p => p.value).join("").length

    const promptComponent = isImage ? (
      <img style={{ maxHeight: "100%" }} src={prompt[0].value} />
    ) : (
      <PromptText
        bottom={this.state.bottom}
        isReadMode={isReadMode}
        large={length < 50}
        margin={isReadMode ? "20px 0" : "0"}
      >
        {prompt.map((p: PromptPart, i: number) => span(p, i))}
      </PromptText>
    )

    return (
      <PromptBox id="prompt" isReadMode={isReadMode}>
        {promptComponent}
      </PromptBox>
    )
  }
}
