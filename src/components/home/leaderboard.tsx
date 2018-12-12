import * as React from "react"

import { LeaderboardContainer, MainHeader } from "./components"

import FlexedDiv from "../common/flexedDiv"
import Icon from "../common/icon"

import yellowStar from "../../lib/images/gameplay/icon-star-yellow.png"

interface Props {
  ranks: any[]
  userId: string
}

class Leaderboard extends React.Component<Props, any> {
  public render() {
    const { ranks, userId } = this.props

    const row = (rank: any) => (
      <FlexedDiv
        bColor={userId === rank.id ? "rgba(245,222,179, 0.5)" : ""}
        padding="2px 10px"
        key={rank.id}
        justifyContent="space-between"
      >
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
