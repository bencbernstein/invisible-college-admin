import * as React from "react"
import { Link } from "react-router-dom"

import history from "../../history"

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
  reset: () => void
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
    const type =
      this.props.queueType === QueueType.filter ? "unfiltered" : "accepted"
    let otherQueues = await recommendPassageQueues(type)
    if (!(otherQueues instanceof Error)) {
      otherQueues = otherQueues.filter(w => w !== this.props.word)
      console.log(otherQueues)
      this.setState({ otherQueues })
    }
  }

  public redirect(path: string) {
    history.push(path)
    this.props.reset()
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
        {queueType !== QueueType.enrich && (
          <Button.regular
            onClick={() =>
              this.redirect(window.location.search.replace("filter", "enrich"))
            }
            margin="5px"
          >
            Enrich {word}
          </Button.regular>
        )}
        {otherQueues.map(w => (
          <Button.regular
            onClick={() =>
              this.redirect(
                `/passage?${queueType.toLowerCase()}=true&word=${w}`
              )
            }
            margin="5px"
            key={w}
          >
            {queueType} {w}
          </Button.regular>
        ))}
        <Button.regular margin="5px">
          <Link style={blankLinkStyle} to="/library">
            Go to Library
          </Link>
        </Button.regular>
      </Modal>
    )
  }
}

export default CompletedModal
