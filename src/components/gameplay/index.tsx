import { get } from "lodash"
import styled from "styled-components"
import * as React from "react"
import * as _ from "underscore"
import { Redirect } from "react-router"

import List from "./list"
import Subnav from "../nav/subnav"
import FilterMenu from "./filterMenu"

import Button from "../common/button"
import Menus from "../common/menu"

import { fetchQuestions, Question } from "../../models/question"
import {
  createQuestionSequence,
  updateQuestionSequence,
  fetchQuestionSequences,
  removeQuestionSequence,
  QuestionSequence
} from "../../models/questionSequence"

const MenusContainer = styled.div`
  display: flex;
`

export enum SelectedView {
  Questions = "Questions",
  Sequences = "Sequences"
}

interface State {
  selectedView: SelectedView
  redirect?: string
  questions: Question[]
  questionSequences: QuestionSequence[]
  filters: any[]
}

class Gameplay extends React.Component<any, State> {
  constructor(props: any) {
    super(props)
    this.state = {
      selectedView: SelectedView.Questions,
      questions: [],
      questionSequences: [],
      filters: []
    }
  }

  public componentDidMount() {
    this.loadQuestions()
    this.loadQuestionSequences()
  }

  public async loadQuestions(changedFilter?: boolean) {
    const questionType = this.state.filters[0]
    let after
    if (changedFilter !== true) {
      after = get(_.last(this.state.questions), "id")
    }
    let questions = await fetchQuestions(questionType, after)
    if (!(questions instanceof Error)) {
      if (after) {
        questions = this.state.questions.concat(questions)
      }
      this.setState({ questions })
    }
  }

  public async loadQuestionSequences() {
    const questionSequences = await fetchQuestionSequences()
    if (!(questionSequences instanceof Error)) {
      this.setState({ questionSequences })
    }
  }

  public didSelectView(selectedView: SelectedView) {
    this.setState({ selectedView })
  }

  public removeSequence(idx: number) {
    let questionSequences = this.state.questionSequences
    const id = questionSequences[idx].id
    removeQuestionSequence(id)
    questionSequences = questionSequences.filter(s => s.id !== id)
    this.setState({ questionSequences })
  }

  public async addQuestionToSequence(
    questionId: string,
    sequence?: QuestionSequence,
    sequenceName?: string
  ) {
    let questionSequences = this.state.questionSequences

    if (sequence) {
      const questions = sequence.questions.concat(questionId)
      const questionSequence = await updateQuestionSequence(
        sequence.id,
        questions
      )
      if (!(questionSequence instanceof Error)) {
        questionSequences = questionSequences.map(
          q => (q.id === questionSequence.id ? questionSequence : q)
        )
      }
    } else if (sequenceName) {
      const questionSequence = await createQuestionSequence(
        sequenceName,
        questionId
      )
      if (!(questionSequence instanceof Error)) {
        questionSequences.push(questionSequence)
      }
    }

    this.setState({ questionSequences })
  }

  public filterBy(questionType: string) {
    if (questionType === "ALL") {
      this.setState({ filters: [] }, () => this.loadQuestions(true))
    } else {
      this.setState({ filters: [questionType] }, () => this.loadQuestions(true))
    }
  }

  public render() {
    const {
      questions,
      questionSequences,
      redirect,
      selectedView,
      filters
    } = this.state

    if (redirect) {
      return <Redirect to={redirect} />
    }

    return (
      <div>
        <Subnav
          subtitle={"library"}
          subtitleLink={"/library"}
          title={"gameplay"}
        />

        <MenusContainer>
          <Menus
            title={"View"}
            didSelect={this.didSelectView.bind(this)}
            chosen={selectedView}
            options={[SelectedView.Questions, SelectedView.Sequences]}
          />

          {selectedView === "Questions" && (
            <FilterMenu filterBy={this.filterBy.bind(this)} filters={filters} />
          )}
        </MenusContainer>

        <List
          questionSequences={questionSequences}
          removeSequence={this.removeSequence.bind(this)}
          addQuestionToSequence={this.addQuestionToSequence.bind(this)}
          data={
            { Questions: questions, Sequences: questionSequences }[selectedView]
          }
          selectedView={selectedView}
        />

        {selectedView === "Questions" && (
          <Button.regular onClick={this.loadQuestions.bind(this)}>
            load more
          </Button.regular>
        )}
      </div>
    )
  }
}

export default Gameplay
