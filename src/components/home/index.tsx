import * as React from "react"
import { Redirect } from "react-router"
import { connect } from "react-redux"
import { sortBy } from "lodash"

import Text from "../common/text"
import FlexedDiv from "../common/flexedDiv"
import Button from "../common/button"
import { Background, Box, MainHeader, Stats, Centered } from "./components"
import Leaderboard from "./leaderboard"

import { formatName } from "../../lib/helpers"
import { calcProgress } from "../question/helpers"
import { colors } from "../../lib/colors"

import { User } from "../../interfaces/user"
import { Curriculum } from "../../interfaces/curriculum"

import { getStatsAction, setEntity } from "../../actions"

interface Props {
  user: User
  curricula: Curriculum[]
  dispatch: any
  ranks: any[]
}

interface State {
  redirect?: string
  questionsAnswered?: number
  wordsLearned?: number
  passagesRead?: number
}

class Home extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {}
  }

  public async componentDidMount() {
    if (this.props.user) {
      this.loadData(this.props.user.id)
    }
  }

  public async componentWillReceiveProps(nextProps: Props) {
    if (nextProps.user && !this.props.user) {
      this.loadData(nextProps.user.id)
    }
  }

  private loadData(id: string) {
    this.props.dispatch(getStatsAction(id))
  }

  public logout() {
    localStorage.removeItem("user")
    this.setState({ redirect: "/login" })
  }

  public render() {
    const { redirect } = this.state
    const { ranks, curricula, user } = this.props

    if (redirect) return <Redirect to={redirect} />
    if (!user) return null

    const {
      firstName,
      lastName,
      id,
      wordsLearned,
      questionsAnswered,
      passagesRead
    } = user

    return (
      <Background>
        <Box>
          <FlexedDiv justifyContent="space-between">
            <Text.regular pointer={true} onClick={this.logout.bind(this)}>
              Logout
            </Text.regular>

            <FlexedDiv justifyContent="flex-end">
              <Text.regular
                margin="0 20px 0 0"
                color={colors.red}
                pointer={true}
                onClick={() => this.setState({ redirect: "/curricula" })}
              >
                KEI
              </Text.regular>
              <Text.regular
                color={colors.red}
                pointer={true}
                onClick={() => this.setState({ redirect: "/admin-play" })}
              >
                ADMIN
              </Text.regular>
            </FlexedDiv>
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

          <div style={{ margin: "0 auto" }}>
            {sortBy(curricula.filter(c => c.public), "name").map(curriculum => (
              <Button.regularWc
                key={curriculum.id}
                margin="10px 0"
                width="275px"
                uppercase={true}
                onClick={async () => {
                  await this.props.dispatch(setEntity({ curriculum }))
                  this.setState({ redirect: `/question` })
                }}
              >
                play {curriculum.name}
              </Button.regularWc>
            ))}
          </div>
        </Box>
      </Background>
    )
  }
}

const mapStateToProps = (state: any, ownProps: any) => ({
  user: state.entities.user,
  ranks: state.entities.ranks || [],
  curricula: state.entities.curricula || []
})

export default connect(mapStateToProps)(Home)
