import styled from "styled-components"

import Text from "../common/text"

import { colors } from "../../lib/colors"

interface BoxProps {
  isReadMode: boolean
}

export const FLEXES: any = {
  interactive: {
    top: 1,
    prompt: 2,
    interactive: 12
  },
  withAnswer: {
    top: 1,
    answer: 2,
    prompt: 7,
    choices: 5
  },
  withoutAnswer: {
    top: 1,
    prompt: 8,
    choices: 6
  }
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

export const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 10%;
`

// Progress Bar

export const ProgressBarBox = styled.div`
  width: 75%;
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
  transition: width 400ms;
  background-color: ${colors.mainBlue};
  position: absolute;
  top: 0;
`

// Prompt

export const PromptImage = styled.img`
  max-height: 80%;
  max-width: 80%;
  height: auto;
  width: auto;
`

interface PromptBoxProps {
  isReadMode: boolean
  flex: any
  isInteractive: boolean
  isShort: boolean
}

export const PromptBox = styled.div`
  display: ${(p: PromptBoxProps) => (p.isInteractive || p.isShort) && "flex"};
  align-items: ${(p: PromptBoxProps) =>
    (p.isInteractive || p.isShort) && "center"};
  justify-content: ${(p: PromptBoxProps) =>
    (p.isInteractive || p.isShort) && "center"};
  flex: ${(p: PromptBoxProps) => p.flex};
  height: ${(p: PromptBoxProps) => (p.isReadMode ? "100vh" : "")};
  box-sizing: border-box;
  overflow: ${(p: PromptBoxProps) => (p.isReadMode ? "scroll" : "hidden")};
  position: ${(p: PromptBoxProps) => p.isReadMode && "absolute"};
  top: 0;
  left: 0;
  background-color: ${(p: PromptBoxProps) =>
    !p.isReadMode && !p.isShort ? "#f9f9f9" : "white"};
  border-radius: ${(p: PromptBoxProps) =>
    p.isReadMode ? "" : "5px 5px 0 5px"};
  border: ${(p: PromptBoxProps) =>
    !p.isReadMode && !p.isShort && `1px solid ${colors.lightestGray}`};
  padding: 10px 15px;
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
  guessedCorrectly?: boolean
  isInteractive?: boolean
  hide?: boolean
}

export const Span = styled.span`
  color: ${(p: SpanProps) =>
    p.hide ? "#f9f9f9" : p.highlight ? colors.warmYellow : colors.black};
  user-select: ${(p: SpanProps) => p.hide && "none"};
  background-color: ${(p: SpanProps) =>
    p.guessedCorrectly && colors.warmYellow};
  padding: ${(p: SpanProps) => p.guessedCorrectly && "4px 2px 0 3px;"};
  font-family: EBGaramond;
  font-size: 1em;
  line-height: 24px;
  border-bottom: ${(p: SpanProps) => p.hide && "1px solid black"};
  border-radius: ${(p: SpanProps) => !p.hide && "3px"};
  box-sizing: border-box;
  cursor: ${(p: SpanProps) => p.isInteractive && "pointer"};
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
  flex: number
}

export const ChoicesFlexBox = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: ${(p: ContainerProps) => "center"};
  align-items: center;
  height: 40%;
  flex: ${(p: ContainerProps) => p.flex};
`

export const ChoicesGridBox = styled.div`
  display: grid;
  grid-template-columns: ${(p: ContainerProps) => templateForCount(p.count)};
  height: 40%;
  justify-items: center;
  align-items: center;
  flex: ${(p: ContainerProps) => p.flex};
`

interface ChoiceProps {
  disabled: boolean
  backgroundColor: string
}

const templateForCount = (count: number) =>
  ({
    2: "1fr 1fr",
    4: "1fr 1fr",
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
  max-height: 80%;
  max-width: 80%;
  width: auto;
  height: auto;
  margin: 10px;
  cursor: pointer;
`

// ANSWER

interface AnswerBoxProps {
  height: string
  flex: number
}

export const AnswerBox = styled.div`
  height: ${(p: AnswerBoxProps) => p.height};
  display: flex;
  align-items: center;
  justify-content: center;
  flex: ${(p: AnswerBoxProps) => p.flex};
`

export const AnswerText = Text.xl.extend`
  display: flex;
  align-items: center;
  justify-content: center;
  color: black
`

interface AnswerPartBoxProps {
  hide: boolean
  margin: number
}

export const AnswerPartBox = styled.span`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 2px;
  margin: 0 ${(p: AnswerPartBoxProps) => p.margin}px;
  transition: margin 200ms;
  color: ${(p: AnswerPartBoxProps) => (p.hide ? "white" : "black")};
`

interface AnswerUnderlineProps {
  color: string
}

export const AnswerUnderline = styled.span`
  height: 4px;
  border-radius: 5px;
  background-color: ${(p: AnswerUnderlineProps) => p.color};
  width: 100%;
  padding: 0 2px;
`

// INTERACTIVE

interface InteractiveBoxProps {
  flex: number
}

export const InteractiveBox = styled.div`
  flex: ${(p: InteractiveBoxProps) => p.flex};
  box-sizing: border-box;
  padding: 10px 0px;
  font-size: 1.2em;
  overflow: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
`
