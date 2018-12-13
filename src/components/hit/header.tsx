import * as React from "react"

import Header from "../common/header"
import { colors } from "../../lib/colors"

interface Props {
  passage: any
}

export default class HitHeader extends React.Component<Props, any> {
  public render() {
    const { passage } = this.props

    return (
      <Header.s textAlign="center" margin="0">
        <a
          style={{ color: colors.blue, textDecoration: "none" }}
          href={`http://localhost:3000/library/text/${
            passage._source.join_field.parent
          }`}
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
