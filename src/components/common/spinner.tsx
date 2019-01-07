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

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

const LoadingSpinner = styled.img`
  height: 40px;
  width: auto;
  opacity: 0;
  animation: ${rotate360} 5s linear infinite, ${fadeIn} 0.2s forwards;
  animation-delay: 0.2s;
`

class Spinner extends React.Component<any, any> {
  public render() {
    return <LoadingSpinner src={require("../../lib/images/spinner.png")} />
  }
}

export default Spinner
