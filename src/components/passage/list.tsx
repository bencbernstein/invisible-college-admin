import * as React from "react"
import { Link } from "react-router-dom"
import { connect } from "react-redux"
import styled from "styled-components"
import { sortBy, isEqual } from "lodash"

import Text from "../common/text"
import Spinner from "../common/spinner"
import Input from "../common/input"
import Icon from "../common/icon"

import {
  fetchPassages,
  updatePassageAction,
  removePassageAction,
  addToSequenceAction
} from "../../actions"
import { Curriculum } from "../../interfaces/curriculum"
import { Sequence } from "../../interfaces/sequence"

import { colors } from "../../lib/colors"
import deleteIcon from "../../lib/images/icon-delete.png"
import blankLinkStyle from "../common/blankLinkStyle"

interface Props {
  queue: any
  passages: any[]
  curriculum?: Curriculum
  sequence?: Sequence
  dispatch: any
  isLoading: boolean
}

interface State {
  input: string
  isEditing?: number
}

const PassageText = styled.div`
  border-radius: 10px;
  padding: 5px 10px;
  cursor: pointer;
  &:hover {
    background-color: ${colors.lightestGray};
  }
`

class PassageListComponent extends React.Component<Props, State> {
  constructor(props: any) {
    super(props)
    this.state = {
      input: ""
    }
  }

  public async componentDidMount() {
    if (this.props.curriculum) {
      this.loadData(this.props.curriculum)
    }
  }

  public async componentWillReceiveProps(nextProps: Props) {
    const { curriculum } = nextProps
    if (curriculum && !isEqual(curriculum, this.props.curriculum)) {
      this.loadData(curriculum)
    }
  }

  private async updateDifficulty(e: any, passage: any) {
    e.preventDefault()
    const difficulty = parseInt(this.state.input || "", 10)
    if (difficulty > 0 && difficulty < 101) {
      passage.difficulty = difficulty
      await this.props.dispatch(updatePassageAction(passage.id, passage))
      this.loadData(this.props.curriculum!)
    }
    this.setState({ input: "", isEditing: undefined })
  }

  private loadData(curriculum: Curriculum) {
    this.props.dispatch(fetchPassages(curriculum.id))
  }

  public render() {
    const { passages, isLoading, curriculum, sequence, dispatch } = this.props
    const { isEditing, input } = this.state

    if (isLoading || !curriculum) return <Spinner />

    const passage = (data: any, i: number) => {
      const PassageTextBox = sequence ? PassageText : styled.div``
      const text = data.tagged.map((tag: any) => tag.value).join(" ")

      const passageText = (
        <PassageTextBox
          onClick={() => {
            if (!sequence) return
            dispatch(addToSequenceAction(sequence.id, "passage", data.id, text))
          }}
          key={i}
        >
          <Text.regular key={i}>{text}</Text.regular>
          <Text.s margin="0 5px" color={colors.mediumLGray}>
            {data.title}
          </Text.s>
        </PassageTextBox>
      )

      if (sequence) return passageText

      return (
        <div
          key={i}
          style={{ margin: "12px 0", display: "flex", alignItems: "center" }}
        >
          <Icon
            onClick={async () => {
              await dispatch(removePassageAction(data.id))
              this.loadData(curriculum)
            }}
            pointer={true}
            small={true}
            src={deleteIcon}
          />

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
              {passageText}
            </Link>
          </div>
        </div>
      )
    }

    return <div>{sortBy(passages, "difficulty").map(passage)}</div>
  }
}

const mapStateToProps = (state: any, ownProps: any) => ({
  passages: state.entities.passages || [],
  curriculum: state.entities.curriculum,
  isLoading: state.entities.isLoading,
  sequence: state.entities.sequence
})

export default connect(mapStateToProps)(PassageListComponent)
