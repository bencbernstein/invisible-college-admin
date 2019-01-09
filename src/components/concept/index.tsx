import * as React from "react"
import { Redirect } from "react-router"
import { connect } from "react-redux"
import { range, values, isEqual } from "lodash"

import history from "../../history"

import DefinitionComponent from "./definition"
import Gallery from "./gallery"
import OtherFormsComponent from "./otherForms"
import RootsComponent from "./roots"
import SynonymsComponent from "./synonyms"
import TagsComponent from "./tags"
// import UnverifiedComponent from "./unverified"

import Header from "../common/header"
import FlexedDiv from "../common/flexedDiv"
import Input from "../common/input"
import CommonIcon from "../common/icon"
import BottomNav from "../common/bottomNav"
import Icon from "../common/icon"

import { Word } from "../../interfaces/concept"
import { Curriculum } from "../../interfaces/curriculum"
import { User } from "../../interfaces/user"
import {
  fetchWordAction,
  removeImageFromWordAction,
  updateWordAction,
  setEntity,
  removeCurriculumFromWordAction,
  deleteQueueAction,
  updateQueueItemAction
} from "../../actions"

import { lastPath } from "../../lib/helpers"
import CONFIG from "../../lib/config"
import Spinner from "../common/spinner"
import deleteIcon from "../../lib/images/icon-delete.png"
import backIcon from "../../lib/images/icon-back.png"
import nextImg from "../../lib/images/icon-next.png"

interface State {
  word?: Word
  redirect?: string
  isQueue: boolean
}

interface Props {
  word?: Word
  user: User
  curriculum?: Curriculum
  queue?: any
  isLoading: boolean
  images: any[]
  dispatch: any
}

class WordComponent extends React.Component<Props, State> {
  constructor(props: any) {
    super(props)
    this.state = {
      isQueue: window.location.search.includes("?q=1")
    }
  }

  public componentDidMount() {
    this.loadData()
  }

  public componentWillUnmount() {
    this.updateWord()
  }

  public componentWillReceiveProps(nextProps: Props) {
    if (nextProps.word && !isEqual(nextProps.word, this.state.word)) {
      this.setState({ word: nextProps.word })
    }
  }

  public async loadData() {
    this.props.dispatch(setEntity({ isLoading: true }))
    this.props.dispatch(fetchWordAction(lastPath(window)))
  }

  public updateWord() {
    if (this.state.word) {
      this.props.dispatch(updateWordAction(this.state.word))
    }
  }

  public async addImage(file: File) {
    const form = new FormData()
    form.append("file", file)
    const url = CONFIG.API_URL + "/image?action=POST&id=" + this.state.word!.id
    await fetch(url, {
      body: form,
      method: "POST"
    })
      .then(res => res.json())
      .then(json => console.log(json))
    this.loadData()
  }

  public async removeImage(imageId: string) {
    await this.props.dispatch(
      removeImageFromWordAction(this.state.word!.id, imageId)
    )
    this.loadData()
  }

  public editObscurity(value: string, obscurity: number) {
    value = value === "10" ? value : value.replace(obscurity.toString(), "")
    obscurity = parseInt(value, 10)
    if (range(1, 11).indexOf(obscurity) > -1) {
      const word = this.state.word!
      word.obscurity = obscurity
      this.setState({ word })
    }
  }

  public addUnverified(attr: string, value: string) {
    const word = this.state.word!

    if (attr === "definition") {
      delete word.unverified.definition
      word.definition = [{ value, highlight: false }]
    } else if (attr === "synonyms") {
      word.unverified.synonyms = word.unverified.synonyms!.filter(
        v => v !== value
      )
      word.synonyms.push(value)
    } else {
      word.unverified.tags = word.unverified.tags!.filter(v => v !== value)
      word.tags.push({ value })
    }

    this.setState({ word })
  }

  private queueItemIndex(id: string) {
    return this.props.queue.items.findIndex((item: any) => item.id === id)
  }

  private async nextWord(current: number, next: number) {
    const { queue, user, word, dispatch } = this.props

    const currentItem = queue.items[current]
    const nextItem = queue.items[next]

    const decision: any = {}
    decision.userId = user.id
    decision.userAccessLevel = user.accessLevel || 1
    decision.id = word!.id
    currentItem.decisions = currentItem.decisions
      .filter((d: any) => d.userId !== user.id)
      .concat(decision)

    this.updateWord()
    await dispatch(updateQueueItemAction(queue.id, current, currentItem))

    if (nextItem) {
      history.push("/concept/enrich/" + nextItem.id)
      this.loadData()
    } else {
      await this.props.dispatch(setEntity({ isLoading: true }))
      await this.props.dispatch(deleteQueueAction(queue.id))
      this.setState({ redirect: "/queues" })
    }
  }

  public render() {
    const { word, redirect, isQueue } = this.state
    const { images, isLoading, curriculum } = this.props

    if (isLoading) return <Spinner />
    if (!word || !curriculum) return null
    if (redirect) return <Redirect to={redirect} />

    const itemIdx = isQueue && this.queueItemIndex(word.id)

    const queueNavigation = (
      <BottomNav>
        <CommonIcon
          pointer={true}
          large={true}
          disable={itemIdx === 0}
          margin="0 25px 0 0"
          onClick={() => this.nextWord(itemIdx, itemIdx - 1)}
          flipHorizontal={true}
          src={nextImg}
        />
        <CommonIcon
          pointer={true}
          large={true}
          margin="0 0 0 25px"
          onClick={() => this.nextWord(itemIdx, itemIdx + 1)}
          src={nextImg}
        />
      </BottomNav>
    )

    const roots = <RootsComponent key={1} word={word} />
    const definition = (
      <DefinitionComponent
        key={2}
        update={updated => this.setState({ word: updated })}
        word={word}
      />
    )
    const otherForms = (
      <OtherFormsComponent
        key={3}
        update={updated => this.setState({ word: updated })}
        word={word}
      />
    )
    const synonyms = (
      <SynonymsComponent
        key={4}
        keywordValues={[]}
        update={updated => this.setState({ word: updated })}
        word={word}
      />
    )
    const tags = (
      <TagsComponent
        key={5}
        keywordValues={[]}
        update={updated => this.setState({ word: updated })}
        word={word}
      />
    )
    // const unverifiedComponent = (attr: string) => (
    //   <UnverifiedComponent
    //     key={6}
    //     attr={attr}
    //     word={word}
    //     addUnverified={this.addUnverified.bind(this)}
    //   />
    // )
    const obscurity = (
      <div key={7}>
        <Header.s style={{ marginTop: "30px" }}>obscurity</Header.s>
        <Input.m
          type="text"
          value={word.obscurity || ""}
          onChange={e => this.editObscurity(e.target.value, word.obscurity)}
        />
      </div>
    )
    const gallery = (
      <Gallery
        key={8}
        word={word.value}
        removeImage={this.removeImage.bind(this)}
        addImage={this.addImage.bind(this)}
        images={images}
      />
    )

    const attrComponents = {
      roots,
      definition,
      otherForms,
      synonyms,
      tags,
      obscurity,
      gallery
    }

    return (
      <div style={{ marginBottom: isQueue ? "50px" : "" }}>
        <FlexedDiv justifyContent="space-between">
          <Icon
            onClick={() => this.setState({ redirect: "/concepts" })}
            pointer={true}
            src={backIcon}
          />

          <Icon
            onClick={async () => {
              if (word && window.confirm(`Delete ${word.value}?`)) {
                await this.props.dispatch(
                  removeCurriculumFromWordAction(curriculum.id, word.id)
                )
                this.setState({ redirect: "/concepts" })
              }
            }}
            pointer={true}
            src={deleteIcon}
          />
        </FlexedDiv>

        {values(attrComponents)}
        {isQueue && queueNavigation}
      </div>
    )
  }
}

const mapStateToProps = (state: any, ownProps: any) => ({
  word: state.entities.word,
  images: state.entities.images || [],
  curriculum: state.entities.curriculum,
  queue: state.entities.queue,
  user: state.entities.user,
  isLoading: state.entities.isLoading === true
})

export default connect(mapStateToProps)(WordComponent)
