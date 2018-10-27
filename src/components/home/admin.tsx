import * as React from "react"
import { Redirect } from "react-router"
import { sortBy } from "lodash"

import Text from "../common/text"
import { Background, Box, MainHeader, Content, AvatarImg } from "./components"
import FlexedDiv from "../common/flexedDiv"

import { User } from "../../models/user"
import {
  fetchQuestionTypeCounts,
  QuestionTypeCount
} from "../../models/question"

import { colors } from "../../lib/colors"

import willow from "../../lib/images/avatars/willow.jpg"
import alejandro from "../../lib/images/avatars/alejandro.jpg"
import steve from "../../lib/images/avatars/steve.jpg"

interface Props {
  user: User
}

interface State {
  redirect?: string
  questionTypeCounts: QuestionTypeCount[]
}

class AdminHome extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      questionTypeCounts: []
    }
  }

  public async componentDidMount() {
    const questionTypeCounts = await fetchQuestionTypeCounts()
    if (!(questionTypeCounts instanceof Error)) {
      this.setState({ questionTypeCounts })
    }
  }

  public render() {
    const { redirect, questionTypeCounts } = this.state

    if (redirect) {
      return <Redirect to={redirect} />
    }

    const playQuestionType = (q: QuestionTypeCount) => (
      <Text.s
        margin="5px 0"
        onClick={() => this.setState({ redirect: `/play?type=${q.type}` })}
        pointer={true}
        key={q.type}
      >
        {q.type} <span style={{ color: colors.gray }}>({q.count})</span>
      </Text.s>
    )

    const avatar = (data: any) => (
      <FlexedDiv key={data[1]} direction="column">
        <AvatarImg src={data[0]} />
        <Text.s>{data[1]}</Text.s>
      </FlexedDiv>
    )

    return (
      <Background>
        <Box>
          <Text.regular
            pointer={true}
            onClick={() => this.setState({ redirect: "/home" })}
          >
            Back
          </Text.regular>

          <MainHeader textAlign="center">Question Types</MainHeader>
          <Content height={"60%"}>
            {sortBy(questionTypeCounts, "type").map(playQuestionType)}
          </Content>

          <MainHeader textAlign="center">Play As</MainHeader>
          <Content>
            <FlexedDiv>
              {[
                [alejandro, "Alejandro"],
                [willow, "Willow"],
                [steve, "Steve"]
              ].map(avatar)}
            </FlexedDiv>
          </Content>
        </Box>
      </Background>
    )
  }
}

export default AdminHome
