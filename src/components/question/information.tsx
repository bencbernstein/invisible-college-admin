import * as React from "react"
import { Redirect } from "react-router"
import { range } from "lodash"

import Icon from "../common/icon"
import { StarContainer } from "./components"
import FlexedDiv from "../common/flexedDiv"
import ProgressBar from "./progressBar"

import DeleteIcon from "../../lib/images/icon-delete.png"
import Binoculars from "../../lib/images/gameplay/icon-binoculars.png"

import { Question } from "../../models/question"

import grayStar from "../../lib/images/gameplay/icon-star-gray.png"
import yellowStar from "../../lib/images/gameplay/icon-star-yellow.png"

import { sleep } from "../../lib/helpers"

interface Props {
  isReadMode: boolean
  flex: number
  completion: number
  isBetweenQuestions: boolean
  question: Question
  correct: boolean
}

interface State {
  redirect?: string
  notification?: Notification
  starCount?: number
}

interface Notification {
  title: string
  img: any
}

const NOTIFICATIONS = {
  wordDiscovered: {
    title: "Word discovered!",
    img: Binoculars
  }
}

export default class Prompt extends React.Component<Props, State> {
  constructor(props: any) {
    super(props)
    this.state = {}
  }

  public componentWillReceiveProps(nextProps: Props) {
    const { isBetweenQuestions, question, correct } = this.props
    if (nextProps.isBetweenQuestions && !isBetweenQuestions) {
      this.displayNotifications(correct, question)
    }
  }

  public async displayNotifications(correct: boolean, question: Question) {
    const { experience } = question
    let notification: Notification | undefined
    if (experience === null) {
      notification = NOTIFICATIONS.wordDiscovered
    }

    if (notification) {
      this.setState({ notification })
      await sleep(1)
    }

    const starCount = Math.min((experience || 0) + (correct ? 1 : 0), 10)
    this.setState({ notification: undefined, starCount })
    await sleep(notification ? 1 : 2)
    this.setState({ starCount: undefined })
  }

  public render() {
    const { flex, isReadMode, completion } = this.props
    const { notification, redirect, starCount } = this.state

    if (redirect) {
      return <Redirect to={redirect} />
    }

    return (
      <div style={{ flex }}>
        <FlexedDiv justifyContent="space-between">
          {!isReadMode && (
            <Icon
              onClick={() =>
                this.setState({
                  redirect:
                    window.location.search.indexOf("type") > -1
                      ? "/admin-home"
                      : "/home"
                })
              }
              pointer={true}
              src={DeleteIcon}
            />
          )}

          <ProgressBar completion={completion} />

          {notification ? <Icon src={notification.img} /> : <div />}
        </FlexedDiv>

        <StarContainer justifyContent="center">
          {starCount !== undefined &&
            range(1, 11).map(n => (
              <Icon
                margin="2px 1px"
                small={true}
                key={n}
                src={n <= 5 ? yellowStar : grayStar}
              />
            ))}
        </StarContainer>
      </div>
    )
  }
}
