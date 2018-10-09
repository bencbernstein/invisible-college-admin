import styled from "styled-components"

import Button from "../common/button"
import Text from "../common/text"
import { colors } from "../../lib/colors"

export const Removable = styled.span`
  cursor: pointer;
  margin: 0px 3px;
  &:hover {
    color: ${colors.red};
  }
`

export const LinkButton = Button.regular.extend`
  margin: 0;
  padding: 10px 0px;
  width: 100%;
`

export const Choices = Text.regular.extend`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`

export const DescriptionText = styled.div`
  position: absolute;
  bottom: 10px;
  left: 0;
  right: 0;
`

export const Container = styled.div`
  border: 0.5px solid black;
  width: 100%;
  padding: 20px;
  margin: 20px 0px;
`

export const Textarea = styled.textarea`
  width: 100%;
  color: ${colors.gray};
  padding: 10px;
  box-sizing: border-box;
  margin: 10px 0px 20px 0px;
`
