import * as React from "react"
import { Redirect } from "react-router"
import { connect } from "react-redux"
import { extend, groupBy, values, sortBy } from "lodash"

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
  queues: any[]
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
    this.state = {
      queues: []
    }
  }

  public componentDidMount() {
    this.loadData()
  }

  private async loadData() {
    this.props.dispatch(setEntity({ isLoading: true }))
    await this.props.dispatch(fetchQueuesAction())
    const queues = values(groupBy(this.props.queues, "createdOn")).map(
      (group: any[]) => {
        const sorted = sortBy(group, "part")
        const next = sorted[0]
        next.total = sorted[sorted.length - 1].part
        return next
      }
    )
    this.setState({ queues })
  }

  private async deleteQueue(id: string) {
    await this.props.dispatch(deleteQueueAction(id))
    this.loadData()
  }

  private startQueue(queue: any) {
    this.props.dispatch(setEntity({ queue }))
    const entityId = queue.items[queue.userProgress[0]].id
    const entity = queue.entity.replace("word", "concept")
    const redirect = "/" + entity + "/" + queue.type + "/" + entityId + "?q=1"
    this.setState({ redirect })
  }

  public render() {
    const { isLoading, user, curriculum } = this.props
    const { queues, redirect } = this.state

    if (redirect) return <Redirect to={redirect} />
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
      <div style={{ margin: "35px 0", textAlign: "center" }} key={i}>
        <Text.l
          onClick={() => this.startQueue(data)}
          pointer={true}
          style={{ textTransform: "capitalize" }}
        >
          {data.type}-{data.entity}
          <span style={{ marginLeft: "5px" }}>
            {data.part}/{data.total}
          </span>
        </Text.l>

        <Text.garamond color={colors.lighterGray}>
          {data.description}
        </Text.garamond>

        <ProgressBar completion={data.userProgress[0] / data.userProgress[1]} />

        <FlexedDiv style={{ marginTop: "5px" }}>
          <Text.s color={colors.gray}>
            {data.userProgress[0]}/{data.userProgress[1]}
          </Text.s>

          <Text.s color={colors.mediumGray} margin="5px">
            Created {unixToDateString(data.createdOn)}
          </Text.s>

          <Icon
            onClick={() => this.deleteQueue(data.id)}
            pointer={true}
            margin="0 0 0 10px"
            small={true}
            src={deleteIcon}
          />
        </FlexedDiv>
      </div>
    )

    return (
      <div style={{ width: "400px", margin: "0 auto", marginTop: "30px" }}>
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
