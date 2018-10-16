import * as React from "react"

import { ProgressBarBox, Background, Progress } from "./components"

interface Props {
  completion: number
}

export default class ProgressBar extends React.Component<Props, any> {
  constructor(props: Props) {
    super(props)
  }

  public render() {
    const { completion } = this.props

    return (
      <ProgressBarBox>
        <Background />
        <Progress completion={completion} />
      </ProgressBarBox>
    )
  }
}
