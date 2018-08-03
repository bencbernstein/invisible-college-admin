import * as React from "react"
import * as _ from "underscore"

import DefinitionComponent from "./definition"
import Gallery from "./gallery"
import RootsComponent from "./roots"
import SynonymsComponent from "./synonyms"
import TagsComponent from "./tags"
import UnverifiedComponent from "./unverified"

import Subnav from "../nav/subnav"

import Header from "../common/header"
import Input from "../common/input"

import { addImage, fetchImages, removeImage } from "../../models/image"
import { fetchWord, updateWord } from "../../models/word"

import { Keywords } from "../app"

interface State {
  word?: Word
  imagesBase64: string[]
}

interface Props {
  keywords?: Keywords
  play: (link: string) => {}
}

export interface Component {
  value: string
  isRoot: boolean
}

export interface DefinitionPart {
  value: string
  highlight: boolean
}

export interface Unverified {
  definition?: string
  tags?: string[]
  synonyms?: string[]
}

export interface Tag {
  id?: string
  value: string
  choiceSetIds?: string[]
}

export interface Word {
  id: string
  value: string
  synonyms: string[]
  isDecomposable: boolean
  components?: Component[]
  definition: DefinitionPart[]
  obscurity: number
  images: string[]
  tags: Tag[]
  unverified: Unverified
}

class WordComponent extends React.Component<Props, State> {
  constructor(props: any) {
    super(props)
    this.state = {
      imagesBase64: []
    }
  }

  public componentDidMount() {
    this.loadData()
  }

  public componentWillUnmount() {
    updateWord(this.state.word!)
  }

  public async loadData() {
    const id = _.last(window.location.pathname.split("/"))
    const word = await fetchWord(id!)
    this.setState({ word }, this.loadImages)
  }

  public async loadImages() {
    const images = this.state.word!.images
    if (images.length) {
      const imagesBase64 = await fetchImages(images)
      this.setState({ imagesBase64 })
    }
  }

  public async addImage(filelist: FileList) {
    const response = await addImage(filelist[0], this.state.word!.id)
    this.setState({ word: response.word }, this.loadImages)
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

  public render() {
    const { word, imagesBase64 } = this.state

    if (!word) {
      return null
    }

    return (
      <div>
        <Subnav
          title={word!.value}
          subtitle={"words"}
          subtitleLink={"/library"}
          play={() => this.props.play(word!.id)}
        />

        <RootsComponent word={word!} />

        <DefinitionComponent
          update={w => this.setState({ word: w })}
          word={word!}
        />

        <SynonymsComponent
          keywords={this.props.keywords}
          update={w => this.setState({ word: w })}
          word={word!}
        />

        <TagsComponent
          keywords={this.props.keywords}
          update={w => this.setState({ word: w })}
          word={word!}
        />

        <UnverifiedComponent
          addUnverified={this.addUnverified.bind(this)}
          unverified={word!.unverified}
        />

        <Header.s style={{ marginTop: "30px" }}>obscurity</Header.s>

        <Input.m
          type="text"
          value={word!.obscurity}
          onChange={e => this.editObscurity(e.target.value, word!.obscurity)}
        />

        <Gallery
          removeImage={this.removeImage.bind(this)}
          addImage={this.addImage.bind(this)}
          imagesBase64={imagesBase64}
        />
      </div>
    )
  }
}

export default WordComponent
