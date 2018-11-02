import styled from "styled-components"

interface Props {
  justifyContent?: string
  alignItems?: string
  direction?: string
  width?: string
  bColor?: string
  padding?: string
}

export default styled.div`
  background-color: ${(p: Props) => p.bColor};
  padding: ${(p: Props) => p.padding};
  border-radius 10px;
  display: flex;
  align-items: ${(p: Props) => p.alignItems || "center"};
  flex-direction: ${(p: Props) => p.direction};
  width: ${(p: Props) => p.width};
  justify-content: ${(p: Props) => p.justifyContent || "space-between"};
`
