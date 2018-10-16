import * as React from "react"
import { Redirect } from "react-router"

import Button from "../common/button"

interface State {
  redirect?: string
}

class Home extends React.Component<any, State> {
  constructor(props: any) {
    super(props)
    this.state = {}
  }

  public render() {
    const { redirect } = this.state

    if (redirect) {
      return <Redirect to={redirect} />
    }

    return (
      <div>
        <Button.regularWc onClick={() => this.setState({ redirect: "/play" })}>
          play
        </Button.regularWc>
      </div>
    )
  }
}

export default Home
