import styled from "styled-components"

interface Props {
  isPlaying: boolean
}

export const OuterContainer = styled.div`
  text-align: left;
  max-width: 900px;
  padding: 20px;
  margin: 0 auto;
  position: ${(p: Props) => (p.isPlaying ? "fixed" : "relative")};
  overflow: ${(p: Props) => p.isPlaying && "hidden"};
`
