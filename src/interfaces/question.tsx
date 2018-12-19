export interface Source {
  value: string
  id: string
}

export interface Sources {
  word?: Source
  passage?: Source
}

export interface PromptPart {
  value?: string
  highlight?: boolean
  hide?: boolean
  isSentenceConnector?: boolean
}

export interface AnswerPart {
  value?: string
  prefill?: boolean
  isSentenceConnector?: boolean
}

export interface InteractivePart {
  correct: boolean
  value: string
}

export interface Question {
  _id: string
  TYPE: string
  prompt: PromptPart[]
  answer: AnswerPart[]
  redHerrings: string[]
  passageOrWord: string
  interactive: InteractivePart[]
  sources: Sources
  answerCount: number
  experience?: number
}

export interface QuestionLog {
  type: string
  value: string
  id: string
  correct: boolean
}

const sources = `
  sources {
    passage {
      id
      value
    }
    word {
      id
      value
    }
  }
`

export const questionAttrs = `
  id
  TYPE
  passageOrWord
  prompt {
    value
    highlight
    hide
  }
  answer {
    value
    prefill
  }
  interactive {
    value
    correct
  }
  answerCount
  redHerrings
  ${sources}
  experience
`
