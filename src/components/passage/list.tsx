import * as React from "react"
import { Link } from "react-router-dom"
import { connect } from "react-redux"
import { sortBy } from "lodash"

import Text from "../common/text"
import Spinner from "../common/spinner"
import Input from "../common/input"

import { fetchPassages, updatePassageAction } from "../../actions"
import { colors } from "../../lib/colors"
import Icon from "../common/icon"

import deleteIcon from "../../lib/images/icon-delete.png"
import blankLinkStyle from "../common/blankLinkStyle"

interface Props {
  queue: any
  passages: any[]
  dispatch: any
  isLoading: boolean
}

interface State {
  input: string
  isEditing?: number
}

class PassageListComponent extends React.Component<Props, State> {
  constructor(props: any) {
    super(props)
    this.state = {
      input: ""
    }
  }

  public async componentDidMount() {
    this.loadData()
  }

  private async updateDifficulty(e: any, passage: any) {
    e.preventDefault()
    const difficulty = parseInt(this.state.input || "", 10)
    if (difficulty > 0 && difficulty < 101) {
      passage.difficulty = difficulty
      await this.props.dispatch(updatePassageAction(passage.id, passage))
      this.loadData()
    }
    this.setState({ input: "", isEditing: undefined })
  }

  private loadData() {
    this.props.dispatch(fetchPassages())
  }

  public render() {
    const { passages, isLoading } = this.props
    const { isEditing, input } = this.state

    if (isLoading) return <Spinner />

    const passage = (data: any, i: number) => (
      <div
        key={i}
        style={{ margin: "12px 0", display: "flex", alignItems: "center" }}
      >
        <Icon pointer={true} small={true} src={deleteIcon} />

        <form onSubmit={e => this.updateDifficulty(e, data)}>
          <Input.m
            onFocus={() => this.setState({ isEditing: i })}
            onBlur={() => this.setState({ isEditing: undefined, input: "" })}
            onChange={e => this.setState({ input: e.target.value })}
            width="40px"
            margin="0 15px"
            value={isEditing === i ? input : data.difficulty}
            type="text"
          />
        </form>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <Link style={blankLinkStyle} to={`/passage/enrich/${data.id}`}>
            <Text.regular key={i}>
              {data.tagged.map((tag: any) => tag.value).join(" ")}
            </Text.regular>
            <Text.s margin="0 5px" color={colors.mediumLGray}>
              {data.title}
            </Text.s>
          </Link>
        </div>
      </div>
    )

    return <div>{sortBy(passages, "difficulty").map(passage)}</div>
  }
}

const mapStateToProps = (state: any, ownProps: any) => ({
  passages: state.entities.passages || [],
  isLoading: state.entities.isLoading
})

export default connect(mapStateToProps)(PassageListComponent)
