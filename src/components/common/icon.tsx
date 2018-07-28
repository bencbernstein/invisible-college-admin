import styled from "styled-components"

interface Props {
  pointer?: boolean
  topRight?: boolean
}

export default styled.img`
  height: 25px;
  width: 25px;
  cursor: ${(p: Props) => (p.pointer ? "pointer" : "auto")};
  position: ${(p: Props) => (p.topRight ? "absolute" : "")};
  top: ${(p: Props) => (p.topRight ? "5px" : "")};
  right: ${(p: Props) => (p.topRight ? "5px" : "")};
`
