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
  height: 80px;
  width: auto;
  animation: ${rotate360} 2s linear infinite;
`

const Container = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

class Spinner extends React.Component<any, any> {
  public render() {
    return (
      <Container>
        <LoadingSpinner src={require("../../lib/images/spinner.png")} />
      </Container>
    )
  }
}

export default Spinner
