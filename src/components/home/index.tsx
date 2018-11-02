import * as React from "react"
import { Redirect } from "react-router"

import Text from "../common/text"
import FlexedDiv from "../common/flexedDiv"
import Button from "../common/button"
import { Background, Box, MainHeader, Stats, Centered } from "./components"
import Leaderboard from "./leaderboard"

import { User, getStats, Rank } from "../../models/user"
import { formatName } from "../../lib/helpers"
import { calcProgress } from "../question/helpers"
import { colors } from "../../lib/colors"

interface Props {
  user: User
}

interface State {
  redirect?: string
  questionsAnswered?: number
  wordsLearned?: number
  passagesRead?: number
  ranks: Rank[]
}

class Home extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      ranks: []
    }
  }

  public async componentDidMount() {
    const stats = await getStats(this.props.user.id)
    if (!(stats instanceof Error)) {
      const { wordsLearned, questionsAnswered, passagesRead } = stats.user
      const { ranks } = stats
      this.setState({ wordsLearned, questionsAnswered, passagesRead, ranks })
    }
  }

  public logout() {
    localStorage.removeItem("user")
    this.setState({ redirect: "/login" })
  }

  public render() {
    const {
      redirect,
      wordsLearned,
      questionsAnswered,
      passagesRead,
      ranks
    } = this.state

    const { firstName, lastName, id } = this.props.user

    if (redirect) {
      return <Redirect to={redirect} />
    }

    return (
      <Background>
        <Box>
          <FlexedDiv justifyContent="space-between">
            <Text.regular pointer={true} onClick={this.logout.bind(this)}>
              Logout
            </Text.regular>
            <Text.regular
              color={colors.red}
              pointer={true}
              onClick={() => this.setState({ redirect: "/admin-home" })}
            >
              Admin
            </Text.regular>
          </FlexedDiv>

          <Centered>
            <MainHeader margin="0 0 5px 0">
              {formatName(firstName, lastName)}
            </MainHeader>
            <MainHeader margin="0" small={true}>
              Level {calcProgress(questionsAnswered || 0).level}
            </MainHeader>
          </Centered>

          <Stats>
            <Centered>
              <Text.regular fontFamily="Averia">
                {questionsAnswered}
                <br />
                questions
              </Text.regular>
            </Centered>

            <Centered>
              <Text.regular fontFamily="Averia">
                {wordsLearned}
                <br />
                words
              </Text.regular>
            </Centered>

            <Centered>
              <Text.regular fontFamily="Averia">
                {passagesRead}
                <br />
                passages
              </Text.regular>
            </Centered>
          </Stats>

          <Leaderboard userId={id} ranks={ranks} />

          <Button.regularWc
            margin="0 auto"
            width="275px"
            uppercase={true}
            onClick={() => this.setState({ redirect: `/play?id=${id}` })}
          >
            play
          </Button.regularWc>
        </Box>
      </Background>
    )
  }
}

export default Home
