import * as React from "react"
import pos from "pos"
import { Redirect } from "react-router"
import { connect } from "react-redux"
import { last, extend, get, flatten, isEqual } from "lodash"

import history from "../../history"

import Spinner from "../common/spinner"
import Text from "../common/text"
import FlexedDiv from "../common/flexedDiv"
import Header from "../common/header"
import CommonIcon from "../common/icon"

import { Tagged, Textarea, Icon, Icons } from "./components"

import {
  fetchPassageAction,
  fetchKeywords,
  updatePassageAction,
  updateQueueItemAction
} from "../../actions"

import { User } from "../../interfaces/user"

import {
  highlight,
  toSentences,
  flattenSentences,
  tagsToSentence,
  cleanObj
} from "../../lib/helpers"

import addIcon from "../../lib/images/icon-add.png"
import nextImg from "../../lib/images/icon-next.png"
import deleteIcon from "../../lib/images/icon-delete.png"

import CONNECTORS from "../../lib/connectors"
const connectors = flatten(CONNECTORS.map(c => c.elements))

interface IsEditing {
  idx: number
  value: string
}

interface State {
  redirect?: string
  passage?: any
  sentences: any[][]
  isEditing?: IsEditing
}

interface Props {
  queue: any
  passage: any
  user: User
  dispatch: any
  keywords: any
}

const automaticFocus = (tag: any) =>
  tag.wordId || tag.choiceSetId || tag.isConnector

class EnrichPassageComponent extends React.Component<Props, State> {
  constructor(props: any) {
    super(props)
    this.state = {
      sentences: []
    }
  }

  public componentDidMount() {
    this.loadData(last(window.location.pathname.split("/"))!)
  }

  public componentWillReceiveProps(nextProps: Props) {
    const { passage } = nextProps
    if (passage && !isEqual(passage, this.props.passage)) {
      const sentences = toSentences(passage.tagged)
      this.setState({ sentences, passage })
    }
  }

  private async loadData(id: string) {
    await this.props.dispatch(fetchPassageAction(id))
    if (this.props.keywords) return
    this.props.dispatch(fetchKeywords())
  }

  public save() {
    const { passage } = this.props
    passage.tagged = flattenSentences(this.state.sentences)
  }

  public editValue(senIdx: number, value: string) {
    const { passage, sentences } = this.state
    const { words, choices } = this.props.keywords

    const lexed = new pos.Lexer().lex(value)
    const tagger = new pos.Tagger()

    sentences[senIdx] = tagger.tag(lexed).map((t: any) => ({
      value: t[0],
      tag: t[1],
      isPunctuation: t[0] === t[1],
      isConnector: connectors.indexOf(t[0]) > -1,
      wordId: words[t[0].toLowerCase()],
      choiceSetId: choices[t[0].toLowerCase()],
      isFocusWord: false
    }))

    passage.tagged = flattenSentences(sentences)
    this.setState({ passage, sentences, isEditing: undefined })
  }

  public switchFocus(senIdx: number, wordIdx: number) {
    const { sentences } = this.state
    const tag = sentences[senIdx][wordIdx]
    const attr = automaticFocus(tag) ? "isUnfocused" : "isFocusWord"
    sentences[senIdx][wordIdx][attr] = !tag[attr]
    this.setState({ sentences })
  }

  public removeSentence(idx: number) {
    const { passage, sentences } = this.state
    sentences.splice(idx, 1)
    passage.tagged = flattenSentences(sentences)
    this.setState({ passage, sentences })
  }

  public addSentenceAfter(idx: number) {
    const { passage, sentences } = this.state
    sentences.splice(idx + 1, 0, [])
    passage.tagged = flattenSentences(sentences)
    this.setState({ passage, sentences })
  }

  private queueItemIndex(id: string) {
    return this.props.queue.items.findIndex((item: any) => item.id === id)
  }

  private async nextPassage(current: number, next: number) {
    const { queue, user } = this.props
    const { passage } = this.state
    passage.tagged.forEach(cleanObj)

    const currentItem = queue.items[current]
    const nextItem = queue.items[next]

    const decision: any = {}
    decision.userId = user.id
    decision.userAccessLevel = user.accessLevel || 1
    decision.id = passage.id
    currentItem.decisions = currentItem.decisions
      .filter((d: any) => d.userId !== user.id)
      .concat(decision)

    await this.props.dispatch(updatePassageAction(passage.id, passage))
    await this.props.dispatch(
      updateQueueItemAction(queue.id, current, currentItem)
    )

    if (nextItem) {
      this.loadData(nextItem.id)
      history.push("/passage/enrich/" + nextItem.id)
    } else {
      console.log("completed!")
    }
  }

  public render() {
    const { queue } = this.props
    const { sentences, passage, isEditing } = this.state

    if (!queue) return <Redirect to={"/queues"} />
    if (!passage) return <Spinner />

    const itemIdx = this.queueItemIndex(passage.id)

    return (
      <div style={{ margin: "0", textAlign: "center" }}>
        <Header.s margin="0">{passage.title.toUpperCase()}</Header.s>

        <FlexedDiv style={{ margin: "3px 0 15px 0", justifyContent: "center" }}>
          <input
            type="checkbox"
            checked={passage.factoidOnCorrect}
            onChange={() =>
              this.setState({
                passage: extend(passage, {
                  factoidOnCorrect: !passage.factoidOnCorrect
                })
              })
            }
          />
          <Text.s margin="0 0 0 3px">factoid on correct</Text.s>
        </FlexedDiv>

        <div style={{ lineHeight: "20px", textAlign: "left" }}>
          {sentences.map((tags: any[], i: number) =>
            tags.map((tag: any, i2: number) => (
              <Tagged
                isPunctuation={tag.isPunctuation}
                key={`${i}-${i2}`}
                isUnfocused={tag.isUnfocused}
                isFocusWord={tag.isFocusWord}
                onClick={() => this.switchFocus(i, i2)}
                color={highlight(tag)}
              >
                {tag.value}
              </Tagged>
            ))
          )}
        </div>

        {sentences.map((tags: any[], i: number) => (
          <FlexedDiv
            style={{ margin: "10px 0" }}
            justifyContent={"space-between"}
            key={i}
          >
            <Text.s>{i + 1}</Text.s>
            <Textarea
              spellCheck={false}
              onChange={e =>
                this.setState({
                  isEditing: { idx: i, value: e.target.value }
                })
              }
              onBlur={() => {
                if (isEditing) {
                  this.editValue(i, isEditing.value)
                }
              }}
              value={
                i === get(isEditing, "idx")
                  ? isEditing!.value
                  : tagsToSentence(tags)
              }
            />
            <CommonIcon
              small={true}
              src={addIcon}
              pointer={true}
              onClick={() => this.addSentenceAfter(i)}
            />
            <CommonIcon
              small={true}
              src={deleteIcon}
              pointer={true}
              onClick={() => this.removeSentence(i)}
            />
          </FlexedDiv>
        ))}

        <Icons>
          <Icon
            disable={itemIdx === 0}
            onClick={() => this.nextPassage(itemIdx, itemIdx - 1)}
            flipHorizontal={true}
            src={nextImg}
          />
          <Icon
            onClick={() => console.log("TODO: - delete")}
            src={deleteIcon}
          />
          <Icon
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
  queue: state.entities.queue,
  user: state.entities.user,
  keywords: state.entities.keywords
})

export default connect(mapStateToProps)(EnrichPassageComponent)
