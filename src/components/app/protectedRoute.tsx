import * as React from "react"
import { Redirect, Route, RouteProps } from "react-router"

export interface ProtectedRouteProps extends RouteProps {
  isAuthenticated: boolean
  authenticationPath: string
  isRob: boolean
}

export default class ProtectedRoute extends Route<ProtectedRouteProps> {
  public render() {
    const { path, isRob } = this.props
    let redirectPath: string = ""

    if (!this.props.isAuthenticated) {
      redirectPath = this.props.authenticationPath
    } else if (isRob && path === "/library") {
      redirectPath = "/library/architecture"
    }

    if (redirectPath) {
      const renderComponent = () => <Redirect to={{ pathname: redirectPath }} />
      return (
        <Route {...this.props} component={renderComponent} render={undefined} />
      )
    } else {
      return <Route {...this.props} />
    }
  }
}
