import styled from "styled-components"

import FlexedDiv from "../common/flexedDiv"
import Text from "../common/text"

import { colors } from "../../lib/colors"

interface IconProps {
  disable?: boolean
  flipHorizontal?: boolean
}

export const Icon = styled.img`
  height: 45px;
  width: 45px;
  cursor: pointer;
  margin: 0 25px;
  transform: ${(p: IconProps) => p.flipHorizontal && "rotate(180deg)"};
  opacity: ${(p: IconProps) => (p.disable ? 0.5 : 1)};
  pointer-events: ${(p: IconProps) => (p.disable ? "none" : "auto")};
`

export const Icons = FlexedDiv.extend`
  margin-top: 40px;
  justify-content: center;
`

interface TaggedProps {
  isUnfocused?: boolean
  isPunctuation?: boolean
  isFocusWord?: boolean
}

export const Tagged = Text.garamond.extend`
  cursor: pointer;
  text-decoration: ${(p: TaggedProps) =>
    p.isUnfocused ? "line-through" : p.isFocusWord ? "underline" : "none"};
  position: relative;
  display: inline-block;
  margin-left: ${(p: TaggedProps) => (p.isPunctuation ? "0px" : "5px")};
`

export const Textarea = styled.textarea`
  font-family: EBGaramond;
  line-height: 24px;
  font-size: 0.9em;
  color: ${colors.gray};
  padding: 10px;
  box-sizing: border-box;
  line-height: 20px;
  height: 50px;
  margin: 5px 10px;
  width: 100%;
  padding: 6px;
`
