export interface SequenceQuestion {
  id: string
  documentType: string
  documentId: string
  TYPE: string
  description: string
}

export interface Sequence {
  id: string
  name: string
  createdOn: string
  length: number
  questions: SequenceQuestion[]
}

export const sequenceAttrs =
  "id name createdOn length questions { id documentType documentId TYPE description }"
