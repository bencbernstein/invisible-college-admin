import styled from "styled-components"

import { colors } from "../../lib/colors"

interface Props {
  textAlign?: string
  margin?: string
}

const Large = styled.p`
  font-size: 2.3em;
  color: ${colors.gray};
  letter-spacing: 1px;
  margin: ${(p: Props) => p.margin};
  text-align: ${(p: Props) => p.textAlign};
`

const Medium = styled.h3`
  text-transform: uppercase;
  font-family: BrandonGrotesqueBold;
  letter-spacing: 1px;
  margin: ${(p: Props) => p.margin};
  text-align: ${(p: Props) => p.textAlign};
`

const Small = styled.h5`
  text-transform: uppercase;
  font-family: BrandonGrotesqueBold;
  margin: 15px 0px;
  letter-spacing: 1px;
  margin: ${(p: Props) => p.margin};
  text-align: ${(p: Props) => p.textAlign};
`

const ForInput = Small.extend`
  text-align: center;
  font-family: BrandonGrotesque;
  margin: 0px 0px 5px 0px;
  text-transform: none;
`

export default {
  l: Large,
  m: Medium,
  s: Small,
  forInput: ForInput
}
