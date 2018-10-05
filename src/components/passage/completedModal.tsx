import * as React from "react"
import { Link } from "react-router-dom"

import Header from "../common/header"
import Modal from "../common/modal"
import Button from "../common/button"
import Text from "../common/text"

import { recommendPassageQueues } from "../../models/word"

import blankLinkStyle from "../common/blankLinkStyle"
import { colors } from "../../lib/colors"
import { QueueType } from "./"

interface Props {
  passagesCount: number
  queueType: QueueType
  word: string
}

interface State {
  otherQueues: string[]
}

class CompletedModal extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      otherQueues: []
    }
  }

  public async componentDidMount() {
    const type = `un${this.props.queueType}ed`
    const otherQueues = await recommendPassageQueues(type)
    if (!(otherQueues instanceof Error)) {
      this.setState({ otherQueues })
    }
  }

  public render() {
    const { passagesCount, word, queueType } = this.props
    const { otherQueues } = this.state

    return (
      <Modal>
        <Header.m margin={"8px"}>{word} queue complete!</Header.m>
        <Text.garamond color={colors.gray}>
          {passagesCount} passages {queueType}
          ed
        </Text.garamond>
        <br />
        <Header.s>options</Header.s>
        <Button.regular>
          <Link
            style={blankLinkStyle}
            to={window.location.search.replace("filter", "enrich")}
          >
            Enrich {word}
          </Link>
        </Button.regular>
        {otherQueues.map(w => (
          <Button.regular key={w}>
            <Link
              style={blankLinkStyle}
              to={`/passage?${queueType}=true&word=${w}`}
            >
              {queueType} {w}
            </Link>
          </Button.regular>
        ))}
        <Button.regular>
          <Link style={blankLinkStyle} to="/library">
            Go to Library
          </Link>
        </Button.regular>
      </Modal>
    )
  }
}

export default CompletedModal
