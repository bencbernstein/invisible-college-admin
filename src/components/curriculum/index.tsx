import * as React from "react"
import { connect } from "react-redux"

import Header from "../common/header"
import Spinner from "../common/spinner"
import Input from "../common/input"
import FlexedDiv from "../common/flexedDiv"
import Text from "../common/text"
import Icon from "../common/icon"

import {
  fetchCurriculaAction,
  setEntity,
  createCurriculumAction,
  removeCurriculumAction
} from "../../actions"

import { Curriculum } from "../../interfaces/curriculum"
import { User } from "../../interfaces/user"
import { colors } from "../../lib/colors"

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

  public async removeCurriculum(id: string) {
    await this.props.dispatch(removeCurriculumAction(id))
    this.loadData()
  }

  public render() {
    const { curricula, isLoading } = this.props
    const { newCurriculumName } = this.state
    if (isLoading) return <Spinner />

    return (
      <div>
        <Header.m textAlign="center">Curriculum</Header.m>

        {curricula.map((curriculum: Curriculum) => (
          <FlexedDiv
            style={{ margin: "30px 0" }}
            justifyContent="flex-start"
            key={curriculum.id}
          >
            <Icon
              onClick={() => this.removeCurriculum(curriculum.id)}
              pointer={true}
              small={true}
              src={deleteIcon}
            />
            <Text.regular margin="0 15px">{curriculum.name}</Text.regular>
            <Text.regular margin="0" color={colors.mediumGray}>
              Created on:{" "}
              {new Date(parseInt(curriculum.createdOn, 10)).toString()}
            </Text.regular>
          </FlexedDiv>
        ))}

        <form
          onSubmit={this.createCurriculum.bind(this)}
          style={{ display: "flex", justifyContent: "flex-start" }}
        >
          <Input.m
            margin="0 25px 0 0"
            type="text"
            placeholder="New"
            value={newCurriculumName || ""}
            onChange={e => this.setState({ newCurriculumName: e.target.value })}
          />
          <Input.submit type="submit" />
        </form>
      </div>
    )
  }
}

const mapStateToProps = (state: any, ownProps: any) => ({
  curricula: state.entities.curricula || [],
  isLoading: state.entities.isLoading === true
})

export default connect(mapStateToProps)(CurriculumComponent)
