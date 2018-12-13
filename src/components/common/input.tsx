import styled from "styled-components"
import { colors } from "../../lib/colors"

interface Props {
  marginRight?: string
  margin?: string
  width?: string
}

const Basic = styled.input`
  font-family: BrandonGrotesque;
  outline: none;
  margin-right: ${(p: Props) => p.marginRight};
  display: block;
  width: ${(p: Props) => p.width};
  margin: ${(p: Props) => p.margin};
  border: none;
  border-bottom: 1px solid black;
  box-sizing: border-box;
`

const Rounded = styled.input`
  font-family: BrandonGrotesque;
  outline: none;
  width: ${(p: Props) => p.width};
  margin: ${(p: Props) => p.margin};
  padding: 12px 5px;
  border: 3px solid ${colors.lightestGray};
  &:focus {
    border: 3px solid ${colors.blue};
  }
  &:hover {
    border: 3px solid ${colors.blue};
  }
  transition: all 0.2s ease;
  font-size: 1em;
  max-width: 275px;
  border-radius: 5px;
  box-sizing: border-box;
`

const RoundedSubmit = Rounded.extend`
  border: 3px solid ${colors.blue};
  background-color: ${colors.blue};
  text-align: center;
  color: white;
  cursor: pointer;
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
  font-size: 1.1em;
  padding: 5px;
`

const Large = Basic.extend`
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
  color: ${colors.gray};
  font-size: 0.8em;
  padding: 0px;
`

interface BoxProps {
  border: string
  padding: boolean
}

const Box = Basic.extend`
  border: ${(p: BoxProps) => p.border};
  color: ${colors.gray};
  font-size: 1em;
  padding: ${(p: BoxProps) => (p.padding ? "10px" : "0px")};
`

interface SubmitProps {
  disabled?: boolean
  margin?: string
}

const Submit = styled.input`
  font-family: BrandonGrotesque;
  font-size: 1em;
  border: 4px solid ${colors.lightGray};
  pointer-events: ${(p: SubmitProps) => (p.disabled ? "none" : "auto")};
  background-color: ${(p: SubmitProps) =>
    p.disabled ? colors.lightestGray : "white"};
  padding: 7px 10px;
  border-radius: 10px;
  min-width: 75px;
  box-sizing: border-box;
  text-align: center
  cursor: pointer;
  color: ${(p: SubmitProps) => (p.disabled ? colors.gray3 : "black")};
  margin: ${(p: SubmitProps) => p.margin};
  &:hover {
    border: 4px solid ${(p: SubmitProps) =>
      p.disabled ? colors.lightGray : colors.blue};
  }  
`

export default {
  l: Large,
  file: FileLabel,
  m: Medium,
  rounded: Rounded,
  roundedS: RoundedSubmit,
  s: Small,
  circ: Circular,
  box: Box,
  submit: Submit
}
