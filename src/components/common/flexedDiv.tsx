import styled from "styled-components"

interface Props {
  justifyContent?: string
  alignItems?: string
}

export default styled.div`
  display: flex;
  align-items: ${(p: Props) => p.alignItems || "center"};
  justify-content: ${(p: Props) => p.justifyContent || "space-between"};
`
