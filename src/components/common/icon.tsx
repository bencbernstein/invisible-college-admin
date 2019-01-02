import styled from "styled-components"

interface Props {
  pointer?: boolean
  topRight?: boolean
  large?: boolean
  small?: boolean
  margin?: string
  hide?: boolean
  cursor?: boolean
  disable?: boolean
  flipHorizontal?: boolean
}

export default styled.img`
  height: ${(p: Props) => (p.large ? "45px" : p.small ? "20px" : "25px")};
  width: ${(p: Props) => (p.large ? "45px" : p.small ? "20px" : "25px")};
  cursor: ${(p: Props) => (p.pointer ? "pointer" : "auto")};
  position: ${(p: Props) => (p.topRight ? "absolute" : "")};
  top: ${(p: Props) => (p.topRight ? "5px" : "")};
  margin: ${(p: Props) => p.margin};
  right: ${(p: Props) => (p.topRight ? "5px" : "")};
  visibility: ${(p: Props) => (p.hide ? "hidden" : "visible")};
  cursor: ${(p: Props) => p.pointer && "pointer"};
  transform: ${(p: Props) => p.flipHorizontal && "rotate(180deg)"};
  opacity: ${(p: Props) => (p.disable ? 0.5 : 1)};
  pointer-events: ${(p: Props) => (p.disable ? "none" : "auto")};
`
