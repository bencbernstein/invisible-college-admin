import styled from "styled-components"

import Text from "../../common/text"
import { colors } from "../../../lib/colors"

export const Box = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const StyledImage = styled.img`
  max-height: 80%;
  max-width: 80%;
  height: auto;
  width: auto;
`

export const StyledText = Text.l.extend`
  overflow: scroll;
  font-family: EBGaramond;
  ::-webkit-scrollbar {
    display: none;
  }
  height: 100%;
  line-height: 24px;
  padding: 20px;
  box-sizing: border-box;
`

export const Source = styled.span`
  display: block;
  color: ${colors.gray};
  margin: 5px 0 0 10px;
  text-transform: capitalize;
`

export const NextButton = styled.img`
  height: 30px;
  width: 30px;
  position absolute;
  right: 15px;
  bottom: 15px;
  cursor: pointer
`
