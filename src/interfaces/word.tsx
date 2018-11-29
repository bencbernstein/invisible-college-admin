export interface Component {
  value: string
  isRoot: boolean
}

export interface DefinitionPart {
  value: string
  highlight: boolean
}

export interface Unverified {
  definition?: string
  tags?: string[]
  synonyms?: string[]
}

export interface Tag {
  id?: string
  value: string
  choiceSetIds?: string[]
}

export interface Word {
  id: string
  value: string
  synonyms: string[]
  isDecomposable: boolean
  components?: Component[]
  definition: DefinitionPart[]
  otherForms: string[]
  obscurity: number
  images: string[]
  lcd: string
  tags: Tag[]
  unverified: Unverified
  unfilteredPassagesCount: number
  rejectedPassagesCount: number
  acceptedPassagesCount: number
  enrichedPassagesCount: number
}
