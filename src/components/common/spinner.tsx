import * as React from "react"
import styled, { keyframes } from "styled-components"

const rotate360 = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const LoadingSpinner = styled.img`
  height: 40px;
  width: auto;
  animation: ${rotate360} 5s linear infinite;
`

class Spinner extends React.Component<any, any> {
  public render() {
    return <LoadingSpinner src={require("../../lib/images/spinner.png")} />
  }
}

export default Spinner
