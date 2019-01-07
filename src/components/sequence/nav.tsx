import * as React from "react"
import { connect } from "react-redux"
import styled from "styled-components"
import { Redirect } from "react-router"

// import Spinner from "../common/spinner"
import Button from "../common/button"
// import Icon from "../common/icon"
// import FlexedDiv from "../common/flexedDiv"

import { removeEntity } from "../../actions"

import { Sequence } from "../../interfaces/sequence"
import Spinner from "../common/spinner"

import { colors } from "../../lib/colors"

interface State {
  redirect?: string
  isAddingQuestions: boolean
}

interface Props {
  sequence: Sequence
  dispatch: any
}

const Box = styled.div`
  position: fixed;
  width: 600px;
  border: 4px solid ${colors.lightGray};
  border-radius: 10px;
  left: 0;
  right: 0;
  margin: 0 auto;
  bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  background-color: white;
`

class SequenceComponent extends React.Component<Props, State> {
  constructor(props: any) {
    super(props)
    this.state = {
      isAddingQuestions: false
    }
  }

  public componentWillUnmount() {
    if (!this.state.isAddingQuestions) {
      this.props.dispatch(removeEntity("sequence"))
    }
  }

  private redirect(redirect: string) {
    this.setState({ redirect, isAddingQuestions: true })
  }

  public render() {
    const { redirect } = this.state
    const { sequence } = this.props

    if (!sequence) return <Spinner />
    if (redirect) return <Redirect to={redirect} />

    const path = window.location.pathname.split("/")[1]

    return (
      <Box>
        <div
          style={{
            flex: 1,
            textAlign: "center",
            backgroundColor: colors.lightestGray
          }}
        >
          <Button.regular
            disabled={path === "sequence"}
            onClick={() => this.redirect(`/sequence/${sequence.id}`)}
          >
            Sequence ({sequence.questions.length} questions)
          </Button.regular>
        </div>
        <div style={{ flex: 1, textAlign: "center", position: "relative" }}>
          <Button.regular
            disabled={path === "concepts"}
            onClick={() => this.redirect("/concepts")}
          >
            Add Concepts
          </Button.regular>
        </div>
        <div style={{ flex: 1, textAlign: "center" }}>
          <Button.regular
            disabled={path === "passages"}
            onClick={() => this.redirect("/passages")}
          >
            Add Passages
          </Button.regular>
        </div>
      </Box>
    )
  }
}

const mapStateToProps = (state: any, ownProps: any) => ({
  sequence: state.entities.sequence
})

export default connect(mapStateToProps)(SequenceComponent)
