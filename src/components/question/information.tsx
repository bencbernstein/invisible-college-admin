import * as React from "react"
import { Redirect } from "react-router"
import { range } from "lodash"
import * as moment from "moment"

import Icon from "../common/icon"
import { StarContainer } from "./components"
import FlexedDiv from "../common/flexedDiv"
import ProgressBar from "./progressBar"

import DeleteIcon from "../../lib/images/icon-delete.png"

import binoculars from "../../lib/images/gameplay/icon-binoculars.png"
import flame from "../../lib/images/gameplay/icon-speedy.png"

import { Question } from "../../models/question"

import grayStar from "../../lib/images/gameplay/icon-star-gray.png"
import yellowStar from "../../lib/images/gameplay/icon-star-yellow.png"

import { sleep } from "../../lib/helpers"

interface Props {
  flex: number
  completion: number
  isBetweenQuestions?: boolean
  question: Question
  correct?: boolean
  qStartTime: moment.Moment
  isWordQType: boolean
}

interface State {
  redirect?: string
  notifications: any[]
  starCount?: number
}

export default class Prompt extends React.Component<Props, State> {
  constructor(props: any) {
    super(props)
    this.state = {
      notifications: []
    }
  }

  public componentWillReceiveProps(nextProps: Props) {
    const {
      isBetweenQuestions,
      question,
      correct,
      qStartTime,
      isWordQType
    } = this.props

    if (nextProps.isBetweenQuestions && !isBetweenQuestions) {
      const speedy =
        Math.ceil(moment.duration(moment().diff(qStartTime)).asSeconds()) < 4 &&
        isWordQType
      this.displayNotifications(question, correct, speedy)
    }
  }

  public async displayNotifications(
    question: Question,
    correct?: boolean,
    speedy?: boolean
  ) {
    const notifications: any[] = []

    if (speedy) {
      notifications.push(flame)
    }
    if (question.experience === undefined) {
      notifications.push(binoculars)
    }
    if (correct) {
      notifications.push(yellowStar)
    }

    const starCount = Math.min(
      (question.experience || 0) + (correct === true ? 1 : 0),
      10
    )
    this.setState({ notifications, starCount })
    await sleep(2)
    this.setState({ notifications: [], starCount: undefined })
  }

  public render() {
    const { flex, completion } = this.props
    const { notifications, redirect, starCount } = this.state

    if (redirect) {
      return <Redirect to={redirect} />
    }

    return (
      <div style={{ flex }}>
        <FlexedDiv justifyContent="space-between">
          <FlexedDiv flex={1} justifyContent="start">
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
          </FlexedDiv>

          <ProgressBar completion={completion} />

          <FlexedDiv flex={1} justifyContent="center">
            {notifications.map((n, i) => (
              <img style={{ width: "18px", height: "18px" }} key={i} src={n} />
            ))}
          </FlexedDiv>
        </FlexedDiv>

        <StarContainer justifyContent="center">
          {starCount !== undefined &&
            range(1, 11).map(n => (
              <Icon
                margin="2px 1px"
                small={true}
                key={n}
                src={n <= starCount ? yellowStar : grayStar}
              />
            ))}
        </StarContainer>
      </div>
    )
  }
}
