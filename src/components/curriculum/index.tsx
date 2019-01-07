import * as React from "react"
import { connect } from "react-redux"
import { sortBy } from "lodash"

import Spinner from "../common/spinner"
import Input from "../common/input"
import FlexedDiv from "../common/flexedDiv"
import Text from "../common/text"
import Icon from "../common/icon"

import {
  fetchCurriculaAction,
  setEntity,
  createCurriculumAction,
  removeCurriculumAction,
  updateCurriculumAction
} from "../../actions"

import { Curriculum } from "../../interfaces/curriculum"
import { User } from "../../interfaces/user"
import { colors } from "../../lib/colors"
import { unixToDateString } from "../../lib/helpers"

import deleteIcon from "../../lib/images/icon-delete.png"

interface State {
  redirect?: string
  newCurriculumName?: string
}

interface Props {
  curricula: Curriculum[]
  user: User
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
    this.props.dispatch(fetchCurriculaAction())
  }

  private async createCurriculum(e: any) {
    e.preventDefault()
    const { newCurriculumName } = this.state
    if (newCurriculumName && newCurriculumName.length) {
      this.setState({ newCurriculumName: undefined })
      await this.props.dispatch(createCurriculumAction(newCurriculumName))
      this.loadData()
    }
  }

  public render() {
    const { curricula, isLoading } = this.props
    const { newCurriculumName } = this.state

    if (isLoading) return <Spinner />

    const curriculum = (curriculum: Curriculum) => (
      <div key={curriculum.id} style={{ margin: "30px 0" }}>
        <FlexedDiv justifyContent="space-between">
          <FlexedDiv>
            <Icon
              onClick={async () => {
                const { name, id } = curriculum
                const confirm = `Are you sure you want to delete ${name}?`
                if (!window.confirm(confirm)) return
                await this.props.dispatch(removeCurriculumAction(id))
                this.loadData()
              }}
              pointer={true}
              small={true}
              src={deleteIcon}
            />
            <Text.regular margin="0 5px 0 15px">{curriculum.name}</Text.regular>
            <Text.regular margin="0 5px">
              {curriculum.questionsCount} questions
            </Text.regular>
          </FlexedDiv>

          <Text.s color={colors.mediumGray}>
            created {unixToDateString(curriculum.createdOn)}
          </Text.s>
        </FlexedDiv>
        <FlexedDiv justifyContent="flex-start">
          <input
            style={{ margin: "8px 8px 8px 40px" }}
            readOnly={true}
            checked={curriculum.public}
            type="radio"
            onClick={async () => {
              curriculum.public = !curriculum.public
              await this.props.dispatch(updateCurriculumAction(curriculum))
              this.loadData()
            }}
          />
          <Text.s>Public</Text.s>
        </FlexedDiv>
      </div>
    )

    const createNewForm = (
      <form
        onSubmit={this.createCurriculum.bind(this)}
        style={{ display: "flex", justifyContent: "center" }}
      >
        <Input.m
          margin="0 25px 0 0"
          type="text"
          spellCheck={false}
          placeholder="New"
          value={newCurriculumName || ""}
          onChange={e => this.setState({ newCurriculumName: e.target.value })}
        />
        <Input.submit type="submit" />
      </form>
    )

    return (
      <div style={{ width: "600px", margin: "0 auto", marginTop: "30px" }}>
        {sortBy(curricula, "name").map(curriculum)}
        {createNewForm}
      </div>
    )
  }
}

const mapStateToProps = (state: any, ownProps: any) => ({
  curricula: state.entities.curricula || [],
  isLoading: state.entities.isLoading === true
})

export default connect(mapStateToProps)(CurriculumComponent)
