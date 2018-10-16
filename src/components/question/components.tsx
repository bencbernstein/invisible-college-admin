import styled from "styled-components"

import Text from "../common/text"

import { colors } from "../../lib/colors"

interface BoxProps {
  isReadMode: boolean
}

export const Box = styled.div`
  height: 100vh;
  width: 100vw;
  background-color: white;
  bottom: 0;
  left: 0;
  position: fixed;
  top: 0;
  right: 0;
  box-sizing: border-box;
  padding: ${(p: BoxProps) => (p.isReadMode ? "0px" : "10px")} 25px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

export const TopInfo = styled.div`
  flex: 1;
  align-items: center;
  display: flex;
`

export const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 10%;
`

// Progress Bar

export const ProgressBarBox = styled.div`
  width: 80%;
  position: relative;
`

export const Background = styled.div`
  height: 10px;
  width: 100%;
  border-radius: 5px;
  background-color: ${colors.lightGray};
`

interface ProgressProps {
  completion: number
}

export const Progress = styled.div`
  height: 10px;
  width: ${(p: ProgressProps) => p.completion * 100}%;
  border-radius: 5px;
  background-color: ${colors.yellow};
  position: absolute;
  top: 0;
`

// Prompt

interface PromptBoxProps {
  isReadMode: boolean
}

export const PromptBox = styled.div`
  flex: ${(p: PromptBoxProps) => (p.isReadMode ? "" : "7")};
  height: ${(p: PromptBoxProps) => (p.isReadMode ? "100vh" : "")};
  box-sizing: border-box;
  overflow: ${(p: PromptBoxProps) => (p.isReadMode ? "scroll" : "hidden")};
  background-color: ${(p: PromptBoxProps) => (p.isReadMode ? "" : "#f9f9f9")};
  border-radius: ${(p: PromptBoxProps) =>
    p.isReadMode ? "" : "5px 5px 0 5px"};
  border: ${(p: PromptBoxProps) =>
    p.isReadMode ? "" : `1px solid ${colors.lightestGray}`};
  padding: ${(p: PromptBoxProps) => (p.isReadMode ? "" : "0 5px")};
  ::-webkit-scrollbar {
    display: none;
  }
`

interface PromptTextProps {
  bottom?: number
  large: boolean
  isReadMode: boolean
}

export const PromptText = Text.l.extend`
  position: relative;
  font-size: ${(p: PromptTextProps) => p.large && "1.2em"};
  bottom: ${(p: PromptTextProps) =>
    !p.isReadMode && p.bottom && `${p.bottom}px`};
`

interface SpanProps {
  highlight?: boolean
}

export const Span = styled.span`
  color: ${(p: SpanProps) => (p.highlight ? colors.warmYellow : colors.black)};
  font-family: EBGaramond;
  font-size: 1em;
  line-height: 24px;
`

export const PromptUnderline = styled.div`
  width: 100px;
  height: 4px;
  background-color: black;
  display: inline-block;
  bottom: 0;
  margin: 0px 10px;
  border-radius: 5px;
`

export const ReadMoreTab = styled.div`
  background-color: ${colors.green};
  color: white;
  border-radius: 0 0 5px 5px;
  width: 50px;
  font-size: 0.95em;
  height: 25px;
  text-align: center;
  line-height: 25px;
  float: right;
  cursor: pointer;
`

export const ExitReadMode = styled.p`
  background-color: ${colors.green};
  height: 30px;
  line-height: 30px;
  font-size: 0.95em;
  width: 60px;
  border-radius: 5px;
  color: white;
  text-align: center;
  cursor: pointer;
  position: fixed;
  bottom: 10px;
  right: 10px;
  font-size: 0.95em;
  margin: 0;
`

// Choices

interface ContainerProps {
  count: number
}

export const ChoicesFlexBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: ${(p: ContainerProps) => "center"};
  align-items: center;
  height: 40%;
  flex: 5;
`

export const ChoicesGridBox = styled.div`
  display: grid;
  grid-template-columns: ${(p: ContainerProps) => templateForCount(p.count)};
  height: 40%;
  justify-items: center;
  align-items: center;
  flex: 5;
`

interface ChoiceProps {
  disabled: boolean
  backgroundColor: string
}

const templateForCount = (count: number) =>
  ({
    2: "1fr 1fr",
    6: "1fr 1fr"
  }[count] || "1fr 1fr 1fr")

export const Button = styled.p`
  pointer-events: ${(p: ChoiceProps) => (p.disabled ? "none" : "auto")};
  background-color: ${(p: ChoiceProps) => p.backgroundColor};
  font-size: 1.1em;
  color: white;
  border-radius: 5px;
  text-align: center
  cursor: pointer;
  height: 65%;
  width: 90%;
  align-items: center;
  justify-content: center;
  display: flex;
  font-size: 0.95em;
`

export const Image = styled.img`
  pointer-events: ${(p: ChoiceProps) => (p.disabled ? "none" : "auto")};
  border: 3px solid ${(p: ChoiceProps) => p.backgroundColor};
  max-height: 150px;
  max-width: 150px;
  margin: 10px;
  cursor: pointer;
`

// ANSWER

interface AnswerBoxProps {
  height: string
}

export const AnswerBox = styled.div`
  height: ${(p: AnswerBoxProps) => p.height};
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 2;
`

interface AnswerSpaceProps {
  hide: boolean
}

export const AnswerSpace = styled.span`
  color: ${(p: AnswerSpaceProps) => (p.hide ? "white" : "black")};
  display: ${(p: AnswerSpaceProps) => p.hide && "inline-block"};
`

export const AnswerUnderline = styled.span`
  height: 4px;
  background-color: black;
  border-radius: 5px;
`
