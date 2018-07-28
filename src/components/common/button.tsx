import styled from "styled-components"

import { colors } from "../../lib/colors"

interface Props {
  disabled?: boolean
  color?: string
  marginRight?: string
}

const Regular = styled.p`
  border: 1px solid ${(p: Props) => p.color || "black"};
  pointer-events: ${(p: Props) => (p.disabled ? "none" : "auto")};
  background-color: ${(p: Props) =>
    p.disabled ? colors.lightestGray : "white"};
  padding: 5px 10px;
  min-width: 100px;
  text-align: center
  text-transform: uppercase;
  display: inline-block;
  cursor: pointer;
  font-size: 0.9em;
  margin-right: ${(p: Props) => p.marginRight || "0px"};
  &:hover {
    color: white;
    background-color: ${(p: Props) =>
      p.disabled ? colors.lightGray : p.color || "black"};
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
