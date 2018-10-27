import { isString, isEqual, findIndex } from "underscore"
import * as React from "react"

import { PromptBox, Span, PromptText, PromptImage } from "./components"

import { PromptPart } from "../../models/question"

import { isPunc } from "../../lib/helpers"

interface Props {
  prompt: PromptPart[]
  type: string
  isReadMode: boolean
  isOverflowing: (bool: boolean) => void
  bottom?: number
  isInteractive: boolean
  flex: number
  questionType: string
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
    const {
      prompt,
      type,
      isReadMode,
      isInteractive,
      flex,
      questionType
    } = this.props

    // TODO - use punctuation as in ./interactive
    const span = (p: PromptPart, i: number): any => (
      <Span hide={p.hide} key={i} highlight={p.highlight}>
        {p.value}
      </Span>
    )

    const isImage =
      type === "Word to Image (reverse)" &&
      isString(prompt[0].value) &&
      prompt[0].value!.startsWith("data:image")

    const length = prompt.map(p => p.value).join("").length

    const promptComponent = isImage ? (
      <PromptImage src={prompt[0].value} />
    ) : (
      <PromptText
        bottom={this.state.bottom}
        isReadMode={isReadMode}
        large={length < 50}
        margin={isReadMode ? "20px 0" : "0"}
      >
        {prompt
          .map(span)
          .reduce((prev: any[], curr: any, i: number) => [
            prev,
            isPunc(prompt[i].value) ? "" : " ",
            curr
          ])}
      </PromptText>
    )

    return (
      <PromptBox
        isShort={questionType === "word"}
        isInteractive={isInteractive}
        id="prompt"
        isReadMode={isReadMode}
        flex={flex}
      >
        {promptComponent}
      </PromptBox>
    )
  }
}
