import * as React from "react"
import * as _ from "underscore"

import Header from "../common/header"
import Text from "../common/text"

import { PredictiveCorpus, PredictiveCorpusResult } from "../../models/discover"

import { PredictiveCorpusResults } from "./components"
import { colors } from "../../lib/colors"

interface Props {
  predictiveCorpus: PredictiveCorpus
  addResult: (str: string) => void
  selected: string[]
}

class PredictiveCorpusComponent extends React.Component<Props, any> {
  constructor(props: Props) {
    super(props)
    this.state = {}
  }

  public render() {
    const { predictiveCorpus, selected } = this.props

    const isEmpty = !_.values(predictiveCorpus).some(p => p.results)

    if (isEmpty) {
      return null
    }

    const result = (str: string) => (
      <Text.s
        margin={"2.5px 10px"}
        pointer={true}
        color={_.includes(selected, str) ? colors.blue : colors.gray}
        key={str}
        onClick={() => this.props.addResult(str)}
      >
        {str}
      </Text.s>
    )

    const container = (v: PredictiveCorpusResult, k: string) => (
      <div key={k} style={{ marginTop: "10px" }}>
        <Header.s>{v.name}</Header.s>
        <PredictiveCorpusResults>
          {v.results && v.results.sort().map(result)}
        </PredictiveCorpusResults>
      </div>
    )

    return (
      <div style={{ width: "100%" }}>
        {_.values(_.mapObject(predictiveCorpus, container))}
      </div>
    )
  }
}

export default PredictiveCorpusComponent
