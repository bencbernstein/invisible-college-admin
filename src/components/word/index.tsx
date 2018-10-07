import * as React from "react"
import * as _ from "underscore"

import history from "../../history"

import DefinitionComponent from "./definition"
import Gallery from "./gallery"
import OtherFormsComponent from "./otherForms"
import RootsComponent from "./roots"
import SynonymsComponent from "./synonyms"
import TagsComponent from "./tags"
import UnverifiedComponent from "./unverified"

import Subnav from "../nav/subnav"

import Header from "../common/header"
import Input from "../common/input"

import { addImage, fetchImages, removeImage } from "../../models/image"
import { Word, fetchWord, updateWord } from "../../models/word"

import { parseQueryString } from "../../lib/helpers"

import { Redirect } from "react-router"

interface Props {
  keywordValues: string[]
  play: (id: string) => {}
}

interface Enriching {
  isEnriching: string
  next: string
}
const objIsEnriching = (obj: any): obj is Enriching =>
  "isEnriching" in obj && "next" in obj

interface State {
  word?: Word
  redirect?: string
  imagesBase64: string[]
  enriching?: Enriching
  imageSearchSource: string
}

class WordComponent extends React.Component<Props, State> {
  constructor(props: any) {
    super(props)

    this.state = {
      imagesBase64: [],
      imageSearchSource: "All"
    }
  }

  public componentDidMount() {
    this.loadData()
  }

  public componentWillUnmount() {
    this.updateWord()
  }

  public async loadData() {
    const query = parseQueryString(window.location.search)
    const enriching: Enriching | undefined = objIsEnriching(query)
      ? query
      : undefined

    const id = _.last(window.location.pathname.split("/"))
    const word = await fetchWord(id!)

    if (!(word instanceof Error)) {
      this.setState({ word, enriching }, this.loadImages)
    }
  }

  public updateWord() {
    if (this.state.word) {
      updateWord(this.state.word)
    }
  }

  public async loadImages() {
    const { word } = this.state
    if (word && word.images.length) {
      const imagesBase64 = await fetchImages(word.images)
      this.setState({ imagesBase64 })
    }
  }

  public async addImage(file: File) {
    const response = await addImage(file, this.state.word!.id)
    if (response.error) {
      console.log(response.error)
    } else {
      // Need to change ID because it's coming from a regular express (not graphql) route
      response.word.id = response.word._id
      this.setState({ word: response.word }, this.loadImages)
    }
  }

  public removeImage(imageId: string) {
    const word = this.state.word!
    removeImage(word.id, imageId)
    word.images = word.images.filter((id: any) => id !== imageId)
    this.setState({ word }, this.loadImages)
  }

  public editObscurity(value: string, obscurity: number) {
    value = value === "10" ? value : value.replace(obscurity.toString(), "")
    obscurity = parseInt(value, 10)
    if (_.range(1, 11).indexOf(obscurity) > -1) {
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

  public next() {
    this.updateWord()

    const { isEnriching, next } = this.state.enriching!
    const split = next.split(",")
    const [id, ids] = [split.shift(), split.join(",")]

    if (id) {
      const path = `/word/${id}?isEnriching=${isEnriching}&next=${ids}`
      history.push(path)
      this.loadData()
    } else {
      const redirect = "/library?view=words"
      this.setState({ redirect })
    }
  }

  public render() {
    const { word, imagesBase64, enriching, redirect } = this.state

    if (!word) {
      return null
    } else if (redirect) {
      return <Redirect to={redirect} />
    }

    const roots = <RootsComponent word={word} />
    const definition = (
      <DefinitionComponent
        update={updated => this.setState({ word: updated })}
        word={word}
      />
    )
    const otherForms = (
      <OtherFormsComponent
        update={updated => this.setState({ word: updated })}
        word={word}
      />
    )
    const synonyms = (
      <SynonymsComponent
        keywordValues={this.props.keywordValues}
        update={updated => this.setState({ word: updated })}
        word={word}
      />
    )
    const tags = (
      <TagsComponent
        keywordValues={this.props.keywordValues}
        update={updated => this.setState({ word: updated })}
        word={word}
      />
    )
    const unverifiedComponent = (attr: string) => (
      <UnverifiedComponent
        attr={attr}
        word={word}
        addUnverified={this.addUnverified.bind(this)}
      />
    )
    const obscurity = (
      <div>
        <Header.s style={{ marginTop: "30px" }}>obscurity</Header.s>
        <Input.m
          type="text"
          value={word.obscurity}
          onChange={e => this.editObscurity(e.target.value, word.obscurity)}
        />
      </div>
    )

    const images = (
      <Gallery
        word={word.value}
        source={this.state.imageSearchSource}
        changeSource={imageSearchSource => this.setState({ imageSearchSource })}
        removeImage={this.removeImage.bind(this)}
        addImage={this.addImage.bind(this)}
        imagesBase64={imagesBase64}
      />
    )

    const attrComponents = {
      roots,
      definition,
      otherForms,
      synonyms,
      tags,
      obscurity,
      images
    }

    return (
      <div>
        <Subnav
          minimized={false}
          title={word!.value}
          subtitle={"words"}
          subtitleLink={"/library?view=words"}
          play={() => this.props.play(word!.id)}
          isEnriching={enriching !== undefined}
          next={enriching && this.next.bind(this)}
          invert={true}
        />

        {enriching && enriching.isEnriching !== "all"
          ? [
              attrComponents[enriching.isEnriching],
              unverifiedComponent(enriching.isEnriching)
            ]
          : _.values(attrComponents)}
      </div>
    )
  }
}

export default WordComponent
