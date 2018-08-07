import styled from "styled-components"

import { colors } from "../../lib/colors"

const Large = styled.p`
  font-size: 3em;
  color: ${colors.gray};
  letter-spacing: 1px;
`

const Medium = styled.h3`
  text-transform: uppercase;
  font-family: BrandonGrotesqueBold;
  letter-spacing: 1px;
`

const Small = styled.h5`
  text-transform: uppercase;
  font-family: BrandonGrotesqueBold;
  margin: 15px 0px;
  letter-spacing: 1px;
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
