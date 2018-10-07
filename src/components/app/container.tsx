import * as React from "react"
import * as _ from "underscore"

import Gameplay from "../gameplay"
import Library from "../library"
import Nav from "../nav"
import Discover from "../discover"
import Passage from "../passage"
import QuestionComponent from "../question"
import Sequence from "../sequence"
import PassageSequence from "../passageSequence"
import Text from "../text"
import Word from "../word"
import WordModal from "../word/modal"
import { OuterContainer } from "./components"

import { User } from "../../models/user"
import { Keywords } from "../../models/word"

import { getWordAtPoint } from "../../lib/helpers"

interface ContainerProps {
  component: string
  user?: User
  keywords?: Keywords
}

interface ContainerState {
  wordBelowCursor?: string
  holdingShift: boolean
  questions: string[]
  displayNav: boolean
  playNowIdx?: number
}

class Container extends React.Component<ContainerProps, ContainerState> {
  constructor(props: any) {
    super(props)
    this.state = {
      holdingShift: false,
      displayNav: true,
      questions: []
    }

    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleKeyUp = this.handleKeyUp.bind(this)
  }

  public componentDidMount() {
    window.scroll(0, 0)
    document.addEventListener("keydown", this.handleKeyDown)
    document.addEventListener("keyup", this.handleKeyUp)
  }

  public componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown)
    document.removeEventListener("keyup", this.handleKeyUp)
  }

  public handleKeyDown(e: any) {
    if (e.key === "Shift") {
      this.setState({ holdingShift: true })
    }
  }

  public handleKeyUp(e: any) {
    if (e.key === "Shift") {
      this.setState({ holdingShift: false })
    }
  }

  public handleMouseMove(e: React.MouseEvent) {
    const { holdingShift, wordBelowCursor } = this.state
    const updated = getWordAtPoint(e.target, e.clientX, e.clientY)
    const shouldUpdate = holdingShift && wordBelowCursor !== updated
    if (shouldUpdate) {
      this.setState({ wordBelowCursor: updated })
    }
  }

  public async play(model: string, id: string) {
    // TODO: - fix
    // const questions
    // if (model === "word") {
    //   questions = await fetchQuestionsForWord(id)
    // } else {
    //   questions = await fetchQuestionsForText(id)
    // }
    // if (!(questions instanceof Error)) {
    //   this.setState({ questions })
    // }
  }

  public render() {
    const { holdingShift, displayNav, wordBelowCursor, questions } = this.state
    const { component, user, keywords } = this.props

    // TODO: - fix
    // const definedWords = keywords ? keywords.words : []
    // const displayWordModal = wordBelowCursor && definedWords.indexOf(wordBelowCursor) === -1

    return (
      <OuterContainer
        isPlaying={questions.length > 0}
        onMouseMove={this.handleMouseMove.bind(this)}
      >
        {displayNav && <Nav holdingShift={holdingShift} user={user!} />}

        {
          {
            library: <Library />,
            discover: <Discover keywords={keywords} />,
            gameplay: (
              <Gameplay
                play={(sequenceQuestions: string[], playNowIdx?: number) =>
                  this.setState({ questions: sequenceQuestions, playNowIdx })
                }
              />
            ),
            text: (
              <Text
                displayNav={(b: boolean) => this.setState({ displayNav: b })}
                play={(id: string) => this.play("text", id)}
                user={user!}
                keywords={keywords}
              />
            ),
            passage: <Passage user={user!} keywords={keywords} />,
            word: (
              <Word
                play={(id: string) => this.play("word", id)}
                keywordValues={_.uniq(
                  _.flatten(_.values(keywords).map(_.keys))
                )}
              />
            ),
            sequence: (
              <Sequence
                play={(sequenceQuestions: string[], playNowIdx?: number) =>
                  this.setState({ questions: sequenceQuestions, playNowIdx })
                }
              />
            ),
            passageSequence: <PassageSequence />
          }[component]
        }

        {questions.length > 0 && (
          <QuestionComponent
            playNowIdx={this.state.playNowIdx}
            done={() => this.setState({ questions: [], playNowIdx: undefined })}
            questions={questions}
          />
        )}

        {wordBelowCursor && (
          <WordModal
            remove={() => this.setState({ wordBelowCursor: undefined })}
            value={wordBelowCursor!}
          />
        )}
      </OuterContainer>
    )
  }
}

export default Container
