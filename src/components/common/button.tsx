import styled from "styled-components"

import { colors } from "../../lib/colors"

interface Props {
  disabled?: boolean
  color?: string
  marginRight?: string
  marginLeft?: string
  margin?: string
  width?: string
}

const RegularWC = styled.p`
  font-family: BrandonGrotesque;
  outline: none;
  width: ${(p: Props) => p.width};
  margin: ${(p: Props) => p.margin};
  padding: 5px;
  transition: all 0.2s ease;
  font-size: 1em;
  border-radius: 5px;
  box-sizing: border-box;
  border: 2px solid ${(p: Props) => p.color || colors.blue};
  background-color: ${(p: Props) => p.color || colors.blue};
  box-sizing: broder-box;
  color: white;
  text-align: center;
  margin: 0;
`

const Regular = styled.p`
  border: 4px solid ${(p: Props) => p.color || colors.lightGray};
  pointer-events: ${(p: Props) => (p.disabled ? "none" : "auto")};
  background-color: ${(p: Props) =>
    p.disabled ? colors.lightestGray : "white"};
  padding: 10px 5px;
  min-width: 100px;
  box-sizing: border-box;
  text-align: center
  display: inline-block;
  cursor: pointer;
  color: black;
  margin-right: ${(p: Props) => p.marginRight || "0px"};
  margin-left: ${(p: Props) => p.marginLeft || ""};
  margin: ${(p: Props) => p.margin || ""};
  &:hover {
    border: 4px solid ${(p: Props) =>
      p.disabled ? colors.lightGray : p.color || colors.blue};
  }
`

const Small = Regular.extend`
  font-size: 0.8em;
  min-width: 75px;
`

const Large = Regular.extend`
  font-size: 1.2em;
  min-width: 150px;
  padding: 5px;
`

const Circular = Small.extend`
  border-radius: 20px;
`

export default {
  l: Large,
  regular: Regular,
  regularWc: RegularWC,
  s: Small,
  circ: Circular
}
