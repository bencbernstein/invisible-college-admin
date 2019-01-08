import * as React from "react"

import Header from "../../common/header"
import { Box } from "./components"
import { colors } from "../../../lib/colors"

interface Props {
  continue: () => void
}

export default class Intermission extends React.Component<Props, any> {
  constructor(props: any) {
    super(props)
    this.state = {}
  }

  public render() {
    return (
      <Box style={{ zIndex: 200 }}>
        <Header.xl margin="0" color={colors.yellow}>
          You won!
        </Header.xl>
      </Box>
    )
  }
}
