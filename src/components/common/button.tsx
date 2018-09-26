import styled from "styled-components"

import { colors } from "../../lib/colors"

interface Props {
  disabled?: boolean
  color?: string
  marginRight?: string
  marginLeft?: string
}

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
  color: ${colors.gray};
  margin-right: ${(p: Props) => p.marginRight || "0px"};
  margin-left: ${(p: Props) => p.marginLeft || ""};
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
  s: Small,
  circ: Circular
}
