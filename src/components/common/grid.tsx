import styled from "styled-components"

interface Props {
  alignItems?: string
  justifyItems?: string
  minMax?: number
  rowGap?: number
}

export default styled.div`
  grid-template-columns: repeat(
    auto-fill,
    minmax(${(p: Props) => p.minMax || 175}px, 1fr)
  );
  display: grid;
  align-items: ${(p: Props) => p.alignItems || "flex-end"};
  justify-items: ${(p: Props) => p.justifyItems};
  grid-column-gap: 40px;
  grid-row-gap: ${(p: Props) => p.rowGap || 5}px;
`
