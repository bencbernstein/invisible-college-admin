export enum SelectedView {
  ChoiceSets = "Choice Sets",
  Texts = "Texts",
  PassageSequences = "Passage Sequences",
  Words = "Words"
}

export enum SelectedSortBy {
  Name = "Name",
  EnrichedPassages = "# Enriched Passages",
  Passages = "# Passages",
  UnfilteredPassages = "# Unfiltered Passages",
  UnenrichedPassages = "# Unenriched Passages"
}

export const viewForSearch = (search: string): SelectedView => {
  if (search.includes("choice-sets")) {
    return SelectedView.ChoiceSets
  } else if (search.includes("texts")) {
    return SelectedView.Texts
  } else if (search.includes("passage-sequences")) {
    return SelectedView.PassageSequences
  }
  return SelectedView.Words
}

export const attrForWordSortBy = (sortBy: SelectedSortBy): string =>
  ({
    Name: "value",
    "# Enriched Passages": "enrichedPassagesCount",
    "# Unenriched Passages": "acceptedPassagesCount",
    "# Unfiltered Passages": "unfilteredPassagesCount"
  }[sortBy])
