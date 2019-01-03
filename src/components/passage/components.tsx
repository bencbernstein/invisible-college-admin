import styled from "styled-components"

import Text from "../common/text"

import { colors } from "../../lib/colors"

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