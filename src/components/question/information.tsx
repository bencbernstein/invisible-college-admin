import * as React from "react"
import { Redirect } from "react-router"

import Icon from "../common/icon"
import { InformationBox } from "./components"

import DeleteIcon from "../../lib/images/icon-delete.png"

import { Question } from "../../models/question"

interface Props {
  isReadMode: boolean
  flex: number
  isBetweenQuestions: boolean
  question: Question
}

interface State {
  redirect?: string
}

export default class Prompt extends React.Component<Props, State> {
  constructor(props: any) {
    super(props)
    this.state = {}
  }

  public componentWillReceiveProps(nextProps: Props) {
    const { isBetweenQuestions, question } = this.props
    if (nextProps.isBetweenQuestions && !isBetweenQuestions) {
      this.displayNotifications(question)
    }
  }

  public displayNotifications(question: Question) {
    console.log(question)
  }

  public render() {
    const { flex, isReadMode } = this.props
    const { redirect } = this.state

    if (redirect) {
      return <Redirect to={redirect} />
    }

    return (
      <InformationBox flex={flex}>
        {!isReadMode && (
          <Icon
            onClick={() => this.setState({ redirect: "/home" })}
            pointer={true}
            src={DeleteIcon}
          />
        )}
      </InformationBox>
    )
  }
}
