import * as React from "react"
import { Redirect } from "react-router"

import Text from "../common/text"
import Button from "../common/button"

import { Background, Box, MainHeader, Stats, Centered } from "./components"

import { User } from "../../models/user"
import { formatName } from "../../lib/helpers"

interface Props {
  user: User
}

interface State {
  redirect?: string
}

class Home extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {}
  }

  public logout() {
    localStorage.removeItem("user")
    this.setState({ redirect: "/login" })
  }

  public render() {
    const { redirect } = this.state
    const { user } = this.props
    const {
      firstName,
      lastName,
      level,
      questionsAnswered,
      wordsLearned,
      passagesRead,
      id
    } = user

    if (redirect) {
      return <Redirect to={redirect} />
    }

    return (
      <Background>
        <Box>
          <Text.regular pointer={true} onClick={this.logout.bind(this)}>
            Logout
          </Text.regular>

          <Centered>
            <MainHeader margin="0 0 5px 0">
              {formatName(firstName, lastName)}
            </MainHeader>
            <MainHeader margin="0" small={true}>
              Level {level}
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
