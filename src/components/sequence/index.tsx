import * as React from "react"
import { connect } from "react-redux"
import { uniqBy, sortBy } from "lodash"

import Header from "../common/header"
import Text from "../common/text"
import Icon from "../common/icon"
import Input from "../common/input"
import Spinner from "../common/spinner"
import FlexedDiv from "../common/flexedDiv"

import {
  fetchSequenceAction,
  removeFromSequenceAction,
  fetchSequenceQuestionTypesAction,
  updateSequenceQuestionAction,
  removeEntity
} from "../../actions"

import { Sequence, SequenceQuestion } from "../../interfaces/sequence"

import deleteIcon from "../../lib/images/icon-delete.png"
import { colors } from "../../lib/colors"

interface State {
  redirect?: string
  isEditingIndex?: number
  isEditingType?: number
  input: string
}

interface Props {
  sequence: Sequence
  sequenceQuestionTypes: SequenceQuestion[]
  dispatch: any
}

const QuestionBox = FlexedDiv.extend`
  border: 1px solid ${colors.lightestGray};
  border-radius: 10px;
  padding: 5px 20px;
  box-sizing: border-box;
  margin: 5px 25px;
  width: 100%;
`

class SequenceComponent extends React.Component<Props, State> {
  constructor(props: any) {
    super(props)
    this.state = {
      input: ""
    }
  }

  public componentDidMount() {
    this.loadData()
  }

  private loadData() {
    const id = window.location.pathname.split("/").pop()!
    this.props.dispatch(fetchSequenceAction(id))
  }

  public render() {
    const { isEditingIndex, isEditingType, input } = this.state
    const { sequence, sequenceQuestionTypes, dispatch } = this.props
    if (!sequence) return <Spinner />

    const questionComponent = (data: SequenceQuestion, idx: number) => {
      const { documentId, documentType, description, TYPE } = data

      const questionTypeOptions =
        isEditingType === idx
          ? sortBy(
              uniqBy(sequenceQuestionTypes.concat(data), d => d.TYPE),
              d => d.TYPE
            )
          : [data]

      return (
        <FlexedDiv key={idx}>
          <Input.m
            onFocus={() => this.setState({ isEditingIndex: idx })}
            onBlur={() =>
              this.setState({ isEditingIndex: undefined, input: "" })
            }
            onChange={e => this.setState({ input: e.target.value })}
            width="40px"
            margin="0 15px"
            value={isEditingIndex === idx ? input : idx + 1}
            type="text"
          />

          <QuestionBox>
            <Text.regular style={{ textAlign: "left" }}>
              {description}
            </Text.regular>

            <select
              style={{ minWidth: "150px" }}
              value={`${data.id}-${TYPE}`}
              onFocus={() => {
                this.setState({ isEditingType: idx })
                dispatch(
                  fetchSequenceQuestionTypesAction(documentId, documentType)
                )
              }}
              onBlur={() => {
                this.setState({ isEditingType: undefined })
                dispatch(removeEntity("sequenceQuestionTypes"))
              }}
              onChange={e => {
                const [id, TYPE] = e.target.value.split("-")
                dispatch(
                  updateSequenceQuestionAction(sequence.id, idx, id, TYPE)
                )
              }}
            >
              {questionTypeOptions.map(({ TYPE, id }) => (
                <option value={`${id}-${TYPE}`} key={TYPE}>
                  {TYPE}
                </option>
              ))}
            </select>
          </QuestionBox>

          <Icon
            margin="0 10px 0 0"
            small={true}
            src={deleteIcon}
            pointer={true}
            onClick={() => {
              sequence.questions.splice(idx, 1)
              dispatch(removeFromSequenceAction(sequence.id, idx))
            }}
          />
        </FlexedDiv>
      )
    }

    return (
      <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
        <Header.largeThin style={{ marginBottom: "25px" }} id="textTitle">
          {sequence.name}
        </Header.largeThin>
        {sequence.questions.map(questionComponent)}
      </div>
    )
  }
}

const mapStateToProps = (state: any, ownProps: any) => ({
  sequence: state.entities.sequence,
  sequenceQuestionTypes: state.entities.sequenceQuestionTypes || []
})

export default connect(mapStateToProps)(SequenceComponent)
