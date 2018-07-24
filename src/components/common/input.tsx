import styled from "styled-components"
import { colors } from "../../lib/colors"

const Basic = styled.input`
  font-family: BrandonGrotesque;
  outline: none;
  display: block;
  border: none;
`

const FileLabel = styled.label`
  background-color: ${colors.lightGray};
  border: 1px solid black;
  font-size: 1.1em;
  font-size: 1.3em;
  cursor: pointer;
  padding: 5px;
`

const Medium = Basic.extend`
  border-bottom: 1px solid black;
  font-size: 1.1em;
  padding: 5px;
`

const Large = Basic.extend`
  border-bottom: 1px solid black;
  font-size: 1.3em;
  padding: 5px;
`

const Circular = Basic.extend`
  border-radius: 20px;
  background-color: white
  font-size: 0.9em;
  margin: 0 auto;
  padding: 5px 10px;
`

const Small = Basic.extend`
  border-bottom: 1px solid ${colors.gray};
  color: ${colors.gray};
  font-size: 0.8em;
  padding: 0px;
`

const Submit = Basic.extend`
  border: 1px solid black;
  font-size: 1.1em;
  padding: 5px;
  cursor: pointer;
  &:hover {
    background-color: black;
    color: white;
  }
`

export default {
  l: Large,
  file: FileLabel,
  m: Medium,
  s: Small,
  circ: Circular,
  submit: Submit
}
