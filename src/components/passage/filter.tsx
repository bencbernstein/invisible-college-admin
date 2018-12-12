import * as React from "react"
import { connect } from "react-redux"
import { without, range } from "lodash"
import { Redirect } from "react-router"

import history from "../../history"

import Spinner from "../common/spinner"
import Text from "../common/text"
import Icon from "../common/icon"
import HitHeader from "../hit/header"

import { Icons } from "./components"

import {
  fetchEsPassageAction,
  updateQueueItemAction,
  finishedQueue
} from "../../actions"

import nextImg from "../../lib/images/icon-next.png"
import checkImg from "../../lib/images/icon-checkmark.png"

import { User } from "../../interfaces/user"

import { lastPath } from "../../lib/helpers"

interface State {
  saved: number[]
}

interface Props {
  queue: any
  passage: any
  user: User
  dispatch: any
  isLoading: boolean
}

class FilterPassageComponent extends React.Component<Props, State> {
  constructor(props: any) {
    super(props)
    this.state = {
      saved: []
    }
  }

  public componentDidMount() {
    this.loadData(lastPath(window))
  }

  private async loadData(id: string) {
    const { queue } = this.props
    await this.props.dispatch(fetchEsPassageAction(id))
    if (!queue) return
    const decision = queue.items[this.queueItemIndex(id)].decisions[0]
    const saved = decision ? decision.indexes : []
    this.setState({ saved })
  }

  private clickedSentence(i: number) {
    let { saved } = this.state
    saved = saved.indexOf(i) > -1 ? without(saved, i) : saved.concat(i)
    this.setState({ saved })
  }

  private queueItemIndex(id: string) {
    return this.props.queue.items.findIndex((item: any) => item.id === id)
  }

  private async nextPassage(current: number, next: number) {
    const { queue, user } = this.props

    const currentItem = queue.items[current]
    const nextItem = queue.items[next]

    const decision: any = {}
    decision.indexes = this.state.saved
    decision.accepted = decision.indexes.length > 0
    decision.userId = user.id
    decision.userAccessLevel = user.accessLevel || 1
    currentItem.decisions = currentItem.decisions
      .filter((d: any) => d.userId !== user.id)
      .concat(decision)

    await this.props.dispatch(
      updateQueueItemAction(queue.id, current, currentItem)
    )

    if (nextItem) {
      this.loadData(nextItem.id)
      history.push("/passage/filter/" + nextItem.id)
    } else {
      this.props.dispatch(finishedQueue(queue.id))
    }
  }

  private keepAllSentences() {
    const length = this.props.passage._source.sentences.length
    const saved = this.state.saved.length === length ? [] : range(0, length)
    this.setState({ saved })
  }

  public render() {
    const { passage, isLoading, queue } = this.props
    const { saved } = this.state

    if (!passage) return null
    if (!queue) return <Redirect to={"/queues"} />
    if (isLoading) return <Spinner />

    const itemIdx = this.queueItemIndex(passage._id)
    const tags = itemIdx > -1 ? queue.items[itemIdx].tags : []

    return (
      <div>
        <HitHeader passage={passage} />
        <Text.s>tags: {tags.join(", ")}</Text.s>

        {passage._source.sentences.map((text: string, i: number) => (
          <Text.garamond
            pointer={true}
            style={{
              textDecoration: saved.indexOf(i) > -1 ? "underline" : "none"
            }}
            onClick={() => this.clickedSentence(i)}
            key={i}
          >
            {text}
          </Text.garamond>
        ))}

        <Icons>
          <Icon
            pointer={true}
            large={true}
            disable={itemIdx === 0}
            onClick={() => this.nextPassage(itemIdx, itemIdx - 1)}
            flipHorizontal={true}
            src={nextImg}
          />
          <Icon
            margin="0 75px"
            pointer={true}
            large={true}
            onClick={this.keepAllSentences.bind(this)}
            src={checkImg}
          />
          <Icon
            pointer={true}
            large={true}
            onClick={() => this.nextPassage(itemIdx, itemIdx + 1)}
            src={nextImg}
          />
        </Icons>
      </div>
    )
  }
}

const mapStateToProps = (state: any, ownProps: any) => ({
  passage: state.entities.passage,
  isLoading: state.entities.isLoading,
  queue: state.entities.queue,
  user: state.entities.user
})

export default connect(mapStateToProps)(FilterPassageComponent)
