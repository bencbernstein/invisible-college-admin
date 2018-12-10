import * as React from "react"

import Header from "../common/header"
import { colors } from "../../lib/colors"

interface Props {
  passage: any
}

export default class ProgressBar extends React.Component<Props, any> {
  constructor(props: Props) {
    super(props)
  }

  public render() {
    const { passage } = this.props

    return (
      <Header.s margin={"0"}>
        <a
          style={{ color: colors.blue, textDecoration: "none" }}
          href={`https://en.wikipedia.org/wiki/${passage._source.title}`}
          target={"_blank"}
        >
          {passage._source.title}
        </a>{" "}
        <span style={{ color: colors.gray }}>
          / Section {passage._source.section + 1}
        </span>
      </Header.s>
    )
  }
}
