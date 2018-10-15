import styled from "styled-components"
import Text from "../common/text"
import { colors } from "../../lib/colors"

import FlexedDiv from "../common/flexedDiv"

interface SpanProps {
  highlight?: string
  color: string
}

export const Span = styled.span`
  color: ${(p: SpanProps) => (p.highlight ? colors.warmYellow : p.color)};
`

interface SentenceProps {
  underline: boolean
}

export const Sentence = Text.garamond.extend`
  text-decoration: ${(p: SentenceProps) => (p.underline ? "underline" : "")};
  cursor: pointer;
  margin: 5px 0;
`

export const PassageContainer = styled.div`
  margin: 20px 50px 80px 50px;
`

interface IconProps {
  flipHorizontal?: boolean
}

export const Icons = FlexedDiv.extend`
  width: 300px;
  position: fixed;
  bottom: 30px;
  left: 50%;
  margin-left: -150px;
  justify-content: space-between;
`

interface IconProps {
  disable?: boolean
}

export const Icon = styled.img`
  height: 45px;
  width: 45px;
  cursor: pointer;
  transform: ${(p: IconProps) => p.flipHorizontal && "rotate(180deg)"};
  opacity: ${(p: IconProps) => (p.disable ? 0.5 : 1)};
  pointer-events: ${(p: IconProps) => (p.disable ? "none" : "auto")};
`

interface TaggedProps {
  isUnfocused?: boolean
  isPunctuation?: boolean
  isFocusWord?: boolean
}

export const TagValue = Text.garamond.extend`
  margin-bottom: 12px;
  cursor: pointer;
  text-decoration: ${(p: TaggedProps) =>
    p.isUnfocused ? "line-through" : p.isFocusWord ? "underline" : "none"};
`

export const PartOfSpeech = Text.s.extend`
  position: absolute;
  cursor: pointer;
  text-align: center;
  bottom: 0px;
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
  color: ${colors.gray};
`

interface TaggedProps {
  hide?: boolean
}

export const Tagged = styled.div`
  position: relative;
  display: inline-block;
  pointer-events: ${(p: TaggedProps) => (p.hide ? "none" : "auto")};
  margin-left: ${(p: TaggedProps) => (p.isPunctuation ? "0px" : "5px")};
`

export const Textarea = styled.textarea`
  font-family: EBGaramond;
  line-height: 24px;
  font-size: 0.9em;
  color: ${colors.gray};
  padding: 10px;
  box-sizing: border-box;
  height: 90px;
  margin: 5px 10px;
  width: 100%;
`
