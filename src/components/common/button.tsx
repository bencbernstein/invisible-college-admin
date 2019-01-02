import styled from "styled-components"

import { colors } from "../../lib/colors"

interface Props {
  disabled?: boolean
  color?: string
  marginRight?: string
  marginLeft?: string
  margin?: string
  width?: string
  uppercase?: boolean
  bold?: boolean
}

const RegularWC = styled.p`
  font-family: ${(p: Props) => p.bold && "BrandonGrotesqueBold"};
  text-transform: ${(p: Props) => p.uppercase && "uppercase"};
  outline: none;
  cursor: pointer;
  letter-spacing: 1px;
  max-width: 275px;
  width: ${(p: Props) => p.width};
  margin: ${(p: Props) => p.margin};
  padding: 12px 5px;
  transition: all 0.2s ease;
  font-size: 1em;
  border-radius: 5px;
  border: 2px solid ${(p: Props) => p.color || colors.blue};
  background-color: ${(p: Props) => p.color || colors.blue};
  box-sizing: border-box;
  color: white;
  text-align: center;
  margin: ${(p: Props) => p.margin || "0"};
`

const Regular = styled.p`
  border: 4px solid ${(p: Props) => p.color || colors.lightGray};
  pointer-events: ${(p: Props) => (p.disabled ? "none" : "auto")};
  background-color: ${(p: Props) =>
    p.disabled ? colors.lightestGray : "white"};
  padding: 7px 10px;
  min-width: 100px;
  border-radius: 10px;
  box-sizing: border-box;
  text-align: center
  display: inline-block;
  cursor: pointer;
  color: ${(p: Props) => (p.disabled ? colors.gray3 : "black")};
  margin: ${(p: Props) => p.margin};
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
`

export default {
  l: Large,
  regular: Regular,
  s: Small,
  regularWc: RegularWC
}
