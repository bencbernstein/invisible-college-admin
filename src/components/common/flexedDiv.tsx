import styled from "styled-components"

interface Props {
  justifyContent?: string
  alignItems?: string
  direction?: string
  width?: string
  bColor?: string
  padding?: string
  flex?: number
}

export default styled.div`
  background-color: ${(p: Props) => p.bColor};
  padding: ${(p: Props) => p.padding};
  flex: ${(p: Props) => p.flex};
  display: flex;
  align-items: ${(p: Props) => p.alignItems || "center"};
  flex-direction: ${(p: Props) => p.direction};
  width: ${(p: Props) => p.width};
  justify-content: ${(p: Props) => p.justifyContent || "space-between"};
`
