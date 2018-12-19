import * as React from "react"
import { Redirect } from "react-router"
import { connect } from "react-redux"
import { range, values, isEqual } from "lodash"

import DefinitionComponent from "./definition"
import Gallery from "./gallery"
import OtherFormsComponent from "./otherForms"
import RootsComponent from "./roots"
import SynonymsComponent from "./synonyms"
import TagsComponent from "./tags"
import UnverifiedComponent from "./unverified"

import Header from "../common/header"
import Input from "../common/input"

import { Word } from "../../interfaces/concept"
import {
  fetchWordAction,
  removeImageFromWordAction,
  updateWordAction,
  setEntity
} from "../../actions"

import { lastPath } from "../../lib/helpers"
import CONFIG from "../../lib/config"
import Spinner from "../common/spinner"

interface Enriching {
  isEnriching: string
  next: string
}

interface State {
  word?: Word
  redirect?: string
  enriching?: Enriching
}

interface Props {
  word?: Word
  isLoading: boolean
  images: any[]
  dispatch: any
}

class WordComponent extends React.Component<Props, State> {
  constructor(props: any) {
    super(props)
    this.state = {}
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

  public render() {
    const { word, enriching, redirect } = this.state
    const { images, isLoading } = this.props

    if (isLoading) return <Spinner />
    if (!word) return null
    if (redirect) return <Redirect to={redirect} />

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
    const unverifiedComponent = (attr: string) => (
      <UnverifiedComponent
        key={6}
        attr={attr}
        word={word}
        addUnverified={this.addUnverified.bind(this)}
      />
    )
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
      <div>
        {enriching && enriching.isEnriching !== "all"
          ? [
              attrComponents[enriching.isEnriching],
              unverifiedComponent(enriching.isEnriching)
            ]
          : values(attrComponents)}
      </div>
    )
  }
}

const mapStateToProps = (state: any, ownProps: any) => ({
  word: state.entities.word,
  images: state.entities.images || [],
  isLoading: state.entities.isLoading === true
})

export default connect(mapStateToProps)(WordComponent)
