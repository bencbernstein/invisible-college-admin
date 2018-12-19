import * as React from "react"
import { Redirect } from "react-router"
import { sortBy } from "lodash"
import { connect } from "react-redux"

import Text from "../common/text"
import { Background, Box, MainHeader, Content } from "./components"
import Button from "../common/button"

import { colors } from "../../lib/colors"

import { User } from "../../interfaces/user"

import {
  fetchQuestionTypeCountsAction,
  clearUserHistoryAction
} from "../../actions"

interface Props {
  user: User
  dispatch: any
  questionTypeCounts: any[]
}

interface State {
  redirect?: string
}

class AdminHome extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {}
  }

  public async componentDidMount() {
    this.props.dispatch(fetchQuestionTypeCountsAction())
  }

  public render() {
    const { redirect } = this.state
    const { questionTypeCounts } = this.props

    if (redirect) return <Redirect to={redirect} />

    const playQuestionType = (q: any) => (
      <Text.s
        margin="5px 0"
        onClick={() => this.setState({ redirect: `/question?type=${q.type}` })}
        pointer={true}
        key={q.type}
      >
        {q.type} <span style={{ color: colors.gray }}>({q.count})</span>
      </Text.s>
    )

    return (
      <Background>
        <Box justifyContent="flex-start">
          <Text.regular
            pointer={true}
            onClick={() => this.setState({ redirect: "/play" })}
          >
            Back
          </Text.regular>

          <MainHeader textAlign="center">Question Types</MainHeader>
          <Content height={"60%"}>
            {sortBy(questionTypeCounts, "type").map(playQuestionType)}
          </Content>

          <br />

          <Button.regularWc
            margin="0 auto"
            width="275px"
            uppercase={true}
            onClick={async () => {
              await this.props.dispatch(
                clearUserHistoryAction(this.props.user.id)
              )
              this.setState({ redirect: `/play` })
            }}
          >
            Clear My History
          </Button.regularWc>
        </Box>
      </Background>
    )
  }
}

const mapStateToProps = (state: any, ownProps: any) => ({
  user: state.entities.user,
  questionTypeCounts: state.entities.questionTypeCounts || []
})

export default connect(mapStateToProps)(AdminHome)
