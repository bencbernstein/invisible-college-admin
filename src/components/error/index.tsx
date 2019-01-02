import * as React from "react"
import { connect } from "react-redux"
import styled from "styled-components"

import Text from "../common/text"
import { ErrorMessage } from "../../interfaces/errorMessage"
import { colors } from "../../lib/colors"

import { removeEntity } from "../../actions"

interface Props {
  error?: ErrorMessage
  dispatch: any
}

const Box = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  cursor: pointer;
`

const ErrorBox = styled.div`
  position: absolute;
  padding: 25px 50px;
  background-color: white;
  text-align: center;
  top: 50%;
  border: 0.5px solid black;
  left: 50%;
  margin-right: -50%;
  transform: translate(-50%, -50%);
  min-width: 250px;
  z-index: 15;
`

export const DarkBackground = styled.div`
  background-color: rgb(0, 0, 0);
  background-repeat: repeat;
  filter: alpha(opacity=20);
  height: 100%;
  left: 0px;
  -moz-opacity: 0.2;
  opacity: 0.2;
  position: fixed;
  top: 0px;
  width: 100%;
  z-index: 5;
`

class ErrorComponent extends React.Component<Props, any> {
  public render() {
    const { error } = this.props
    if (!error) return null

    return (
      <Box onClick={() => this.props.dispatch(removeEntity("error"))}>
        <ErrorBox>
          <Text.garamond
            style={{ textTransform: "capitalize" }}
            color={colors.red}
          >
            {error.type}
          </Text.garamond>
          {error.message && (
            <Text.garamond margin="15px 0 0 0">{error.message}</Text.garamond>
          )}
        </ErrorBox>
        <DarkBackground />
      </Box>
    )
  }
}

const mapStateToProps = (state: any, ownProps: any) => ({
  error: state.entities.error
})

export default connect(mapStateToProps)(ErrorComponent)
