import * as React from "react"
import { connect } from "react-redux"

import Spinner from "../common/spinner"

import { fetchQueuesAction, setIsLoading } from "../../actions"

interface Props {
  queues: any[]
  dispatch: any
  isLoading: boolean
}

class QueueListComponent extends React.Component<Props, any> {
  constructor(props: any) {
    super(props)
    this.state = {}
  }

  public componentDidMount() {
    this.loadData()
  }

  public loadData() {
    this.props.dispatch(setIsLoading(true))
    this.props.dispatch(fetchQueuesAction())
  }

  public render() {
    const { queues, isLoading } = this.props
    return <div>{isLoading ? <Spinner /> : <div>{queues.length}</div>}</div>
  }
}

const mapStateToProps = (state: any, ownProps: any) => ({
  queues: state.entities.queues || [],
  isLoading: state.entities.isLoading === true
})

export default connect(mapStateToProps)(QueueListComponent)
