import styled from "styled-components"

import Header from "../common/header"
import { colors } from "../../lib/colors"

export const Container = styled.div`
  display: flex;
`

export const LeftPane = styled.div`
  width: 200px;
  min-width: 200px;
  margin-right: 20px;
`

export const RightPane = styled.div`
  width: 640px;
  margin-left: 20px;
`

export const Textarea = styled.textarea`
  width: 100%;
  height: 150px;
  color: ${colors.gray};
  padding: 10px;
  border: 0.5px solid ${colors.lightestGray};
  box-sizing: border-box;
`

export const Divider = styled.div`
  margin: 15px 0px 20px 0px;
  width: 100%;
  height: 1px;
  background-color: ${colors.lightGray};
`

interface FlexedDivProps {
  justifyContent?: string
  alignItems?: string
}

export const FlexedDiv = styled.div`
  display: flex;
  align-items: ${(p: FlexedDivProps) => p.alignItems || "center"};
  justify-content: ${(p: FlexedDivProps) =>
    p.justifyContent || "space-between"};
`

export const SettingsHeader = Header.s.extend`
  margin: 0;
`

interface SearchContainerProps {
  expanded: boolean
}

export const SearchContainer = styled.div`
  box-sizing: border-box;
  width: 49%;
  padding: ${(p: SearchContainerProps) => (p.expanded ? "10px" : "")};
  border: ${(p: SearchContainerProps) =>
    p.expanded ? `4px solid ${colors.lightGray}` : ""};
`

export const SearchForm = styled.form`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const PredictiveCorpusResults = styled.div`
  display: flex;
  flex-wrap: wrap;
  text-align: center;
  justify-content: center;
`

interface SpanProps {
  hoverColor: string
  color: string
}

export const Span = styled.span`
  cursor: pointer;
  color: ${(p: SpanProps) => p.color};
  &:hover {
    color: ${(p: SpanProps) => p.hoverColor};
  }
`

export const PassageContainer = styled.div`
  margin: 30px 0px;
`

interface ImageProps {
  isDisabled: boolean
}

export const Image = styled.img`
  width: 50px;
  opacity: ${(p: ImageProps) => (p.isDisabled ? 0.5 : 1)};
  height: 50px;
  cursor: ${(p: ImageProps) => (p.isDisabled ? "" : "pointer")};
`

interface SentenceProps {
  isMatch: boolean
  isHeader: boolean
}

export const Sentence = styled.span`
  margin-right: 5px;
  text-transform: ${(p: SentenceProps) => (p.isHeader ? "uppercase" : "")};
  margin: ${(p: SentenceProps) => (p.isHeader ? "5px 0px" : "")};
  font-family: ${(p: SentenceProps) => p.isHeader && "BrandonGrotesqueBold"};
  font-size: ${(p: SentenceProps) => (p.isHeader ? "0.8em" : "1em")};
  letter-spacing: ${(p: SentenceProps) => (p.isHeader ? "1px" : "0px")};
  display: ${(p: SentenceProps) => (p.isHeader ? "block" : "")};
  color: ${(p: SentenceProps) =>
    p.isMatch || p.isHeader ? "black" : colors.lighterGray};
`
