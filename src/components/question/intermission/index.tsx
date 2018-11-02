import * as React from "react"

import Header from "../../common/header"
import Button from "../../common/button"
import { Box } from "./components"
import { colors } from "../../../lib/colors"

interface Props {
  level: number
  continue: () => void
}

export default class Intermission extends React.Component<Props, any> {
  constructor(props: any) {
    super(props)
    this.state = {}
  }

  public render() {
    const { level } = this.props

    return (
      <Box>
        <div style={{ textAlign: "center" }}>
          <Header.xl margin="0" color={colors.yellow}>
            {level}
          </Header.xl>
          <Header.m margin="0" color={colors.blue}>
            Level Up!
          </Header.m>
        </div>

        <Button.regularWc
          style={{
            position: "absolute",
            bottom: "20px",
            left: 0,
            right: 0,
            margin: "0 auto"
          }}
          onClick={this.props.continue.bind(this)}
        >
          Continue
        </Button.regularWc>
      </Box>
    )
  }
}
