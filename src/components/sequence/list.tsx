import * as React from "react"
import { connect } from "react-redux"

import Spinner from "../common/spinner"
import Text from "../common/text"
import Input from "../common/input"
import Icon from "../common/icon"
import FlexedDiv from "../common/flexedDiv"

import {
  fetchSequencesAction,
  setEntity,
  createSequenceAction,
  deleteSequenceAction
} from "../../actions"

import { Sequence } from "../../interfaces/sequence"

import deleteIcon from "../../lib/images/icon-delete.png"
import { unixToDateString } from "../../lib/helpers"
import { colors } from "../../lib/colors"
import { Link } from "react-router-dom"
import blankLinkStyle from "../common/blankLinkStyle"

interface State {
  redirect?: string
  newSequenceName?: string
}

interface Props {
  sequences: Sequence[]
  isLoading: boolean
  dispatch: any
}

class CurriculumComponent extends React.Component<Props, State> {
  constructor(props: any) {
    super(props)
    this.state = {}
  }

  public componentDidMount() {
    this.loadData()
  }

  private async loadData() {
    this.props.dispatch(setEntity({ isLoading: true }))
    this.props.dispatch(fetchSequencesAction())
  }

  private async createSequence(e: any) {
    e.preventDefault()
    const { newSequenceName } = this.state
    if (newSequenceName && newSequenceName.length) {
      this.setState({ newSequenceName: undefined })
      await this.props.dispatch(createSequenceAction(newSequenceName))
      this.loadData()
    }
  }

  public render() {
    const { sequences, isLoading } = this.props
    const { newSequenceName } = this.state

    if (isLoading) return <Spinner />

    const sequenceComponent = (sequence: Sequence) => (
      <FlexedDiv justifyContent="flex-start" key={sequence.id}>
        <Icon
          margin="0 10px 0 0"
          small={true}
          src={deleteIcon}
          pointer={true}
          onClick={async () => {
            await this.props.dispatch(deleteSequenceAction(sequence.id))
            await this.loadData()
          }}
        />
        <Link style={blankLinkStyle} to={`/sequence/${sequence.id}`}>
          <FlexedDiv>
            <Text.l margin="0 15px 0 0">{sequence.name}</Text.l>
            <Text.regular color={colors.darkGray} margin="0 10px 0 0">
              {sequence.questions.length} questions, created on{" "}
              {unixToDateString(sequence.createdOn)}
            </Text.regular>
          </FlexedDiv>
        </Link>
      </FlexedDiv>
    )

    const createNewForm = (
      <form
        onSubmit={this.createSequence.bind(this)}
        style={{ display: "flex", justifyContent: "center" }}
      >
        <Input.m
          margin="0 25px 0 0"
          type="text"
          spellCheck={false}
          placeholder="New"
          value={newSequenceName || ""}
          onChange={e => this.setState({ newSequenceName: e.target.value })}
        />
        <Input.submit type="submit" />
      </form>
    )

    return (
      <div style={{ width: "600px", margin: "0 auto", marginTop: "30px" }}>
        {sequences.map(sequenceComponent)}
        {createNewForm}
      </div>
    )
  }
}

const mapStateToProps = (state: any, ownProps: any) => ({
  sequences: state.entities.sequences || [],
  isLoading: state.entities.isLoading === true
})

export default connect(mapStateToProps)(CurriculumComponent)
