import styled from "styled-components"

import { colors } from "../../lib/colors"

interface Props {
  disabled?: boolean
}

const Regular = styled.p`
  border: 1px solid black;
  pointer-events: ${(p: Props) => (p.disabled ? "none" : "auto")};
  background-color: ${(p: Props) =>
    p.disabled ? colors.lightestGray : "white"};
  padding: 5px 10px;
  display: inline-block;
  cursor: pointer;
  &:hover {
    color: white;
    background-color: ${(p: Props) =>
      p.disabled ? colors.lightGray : "black"};
  }
`

const Large = Regular.extend`
  font-size: 1.3em;
  padding: 5px;
`

export default {
  l: Large,
  regular: Regular
}
