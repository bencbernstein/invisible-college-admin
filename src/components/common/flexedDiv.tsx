import styled from "styled-components"

interface Props {
  justifyContent?: string
  alignItems?: string
  direction?: string
  width?: string
}

export default styled.div`
  display: flex;
  align-items: ${(p: Props) => p.alignItems || "center"};
  flex-direction: ${(p: Props) => p.direction};
  width: ${(p: Props) => p.width};
  justify-content: ${(p: Props) => p.justifyContent || "space-between"};
`
