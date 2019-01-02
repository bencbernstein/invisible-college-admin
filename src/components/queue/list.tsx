import * as React from "react"
import { Redirect } from "react-router"
import { connect } from "react-redux"
import { extend } from "lodash"

import Spinner from "../common/spinner"
import Text from "../common/text"
import Icon from "../common/icon"
import ProgressBar from "../question/progressBar"
import FlexedDiv from "../common/flexedDiv"

import deleteIcon from "../../lib/images/icon-delete.png"

import { User } from "../../interfaces/user"
import { colors } from "../../lib/colors"

import { fetchQueuesAction, deleteQueueAction, setEntity } from "../../actions"

import { Curriculum } from "../../interfaces/curriculum"
import { unixToDateString } from "../../lib/helpers"

interface State {
  redirect?: string
}

interface Props {
  queues: any[]
  dispatch: any
  curriculum: Curriculum
  isLoading: boolean
  user: User
}

class QueueListComponent extends React.Component<Props, State> {
  constructor(props: any) {
    super(props)
    this.state = {}
  }

  public componentDidMount() {
    this.loadData()
  }

  private loadData() {
    this.props.dispatch(setEntity({ isLoading: true }))
    this.props.dispatch(fetchQueuesAction())
  }

  private async deleteQueue(id: string) {
    await this.props.dispatch(deleteQueueAction(id))
    this.loadData()
  }

  private startQueue(queue: any) {
    this.props.dispatch(setEntity({ queue }))
    const entityId = queue.items[queue.userProgress[0]].id
    const redirect =
      "/" + queue.entity + "/" + queue.type + "/" + entityId + "?q=1"
    this.setState({ redirect })
  }

  public render() {
    const { queues, isLoading, user, curriculum } = this.props

    if (this.state.redirect) return <Redirect to={this.state.redirect} />
    if (isLoading || !curriculum) return <Spinner />

    const queuesForCurriculum = queues.filter(
      ({ curriculumId }) => curriculumId === curriculum.id
    )

    const queuesWithProgress = queuesForCurriculum.map(queue => {
      if (queue.accessLevel === 1) {
        const idx = queue.items.findIndex(
          (item: any) =>
            item.decisions.map((d: any) => d.userId).indexOf(user.id) === -1
        )
        const userProgress = [idx, queue.items.length]
        return extend({}, queue, { userProgress })
      }
    })

    const queue = (data: any, i: number) => (
      <div key={i}>
        <FlexedDiv justifyContent="flex-start">
          <Text.regular
            onClick={() => this.startQueue(data)}
            pointer={true}
            margin="0 10px 0 0"
          >
            {data.type}-{data.entity} {data.part}
          </Text.regular>
          <ProgressBar
            completion={data.userProgress[0] / data.userProgress[1]}
          />
          <Text.s color={colors.gray} margin="0 0 0 10px">
            {data.userProgress[0]} out of {data.userProgress[1]} items completed
          </Text.s>
          <Icon
            onClick={() => this.deleteQueue(data.id)}
            pointer={true}
            margin="0 0 0 10px"
            small={true}
            src={deleteIcon}
          />
        </FlexedDiv>
        <Text.s color={colors.mediumGray} margin="5px">
          created {unixToDateString(data.createdOn)}
        </Text.s>
      </div>
    )

    return (
      <div style={{ width: "600px", margin: "0 auto", marginTop: "30px" }}>
        {queuesWithProgress.map(queue)}
      </div>
    )
  }
}

const mapStateToProps = (state: any, ownProps: any) => ({
  user: state.entities.user,
  curriculum: state.entities.curriculum,
  queues: state.entities.queues || [],
  isLoading: state.entities.isLoading === true
})

export default connect(mapStateToProps)(QueueListComponent)
