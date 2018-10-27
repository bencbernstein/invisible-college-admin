import * as React from "react"

import { LeaderboardContainer, MainHeader } from "./components"

import { Rank } from "../../models/user"
import FlexedDiv from "../common/flexedDiv"
import Icon from "../common/icon"

import yellowStar from "../../lib/images/gameplay/icon-star-yellow.png"

interface Props {
  ranks: Rank[]
}

class Leaderboard extends React.Component<Props, any> {
  public render() {
    const { ranks } = this.props

    const row = (rank: Rank) => (
      <FlexedDiv key={rank.id} justifyContent="space-between">
        {`${rank.no}.  ${rank.initials}`}
        <FlexedDiv>
          {rank.questionsAnswered}
          <Icon small={true} margin="0 0 0 5px" src={yellowStar} />
        </FlexedDiv>
      </FlexedDiv>
    )

    return (
      <LeaderboardContainer>
        <MainHeader small={true}>World Leaderboard</MainHeader>
        {ranks.map(row)}
      </LeaderboardContainer>
    )
  }
}

export default Leaderboard
