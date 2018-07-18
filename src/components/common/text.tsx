import styled from "styled-components"
import { colors } from "../../lib/colors"

interface TextProps {
  color?: string
  bold?: boolean
}

const Large = styled.p`
  color: ${(p: TextProps) => p.color || colors.gray};
  font-family: ${(p: TextProps) =>
    p.bold ? "BrandonGrotesqueBold" : "BrandonGrotesque"};
  margin: 2.5px 0px;
`

const Regular = Large.extend`
  font-size: 0.85em;
`

export default {
  l: Large,
  regular: Regular
}
