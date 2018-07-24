import styled from "styled-components"

interface Props {
  pointer?: boolean
}

export default styled.img`
  height: 25px;
  width: 25px;
  cursor: ${(p: Props) => (p.pointer ? "pointer" : "auto")};
`
