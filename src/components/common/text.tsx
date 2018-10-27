import styled from "styled-components"

interface Props {
  color?: string
  bold?: boolean
  pointer?: boolean
  center?: boolean
  margin?: string
  uppercase?: boolean
  fontFamily?: string
}

const Regular = styled.p`
text-transform: ${(p: Props) => p.uppercase && "uppercase"}
text-align: ${(p: Props) => p.center && "center"};
color: ${(p: Props) => p.color};

font-family: ${(p: Props) =>
  p.fontFamily
    ? p.fontFamily
    : p.bold
      ? "BrandonGrotesqueBold"
      : "BrandonGrotesque"};
margin: ${(p: Props) => p.margin || "2.5px 0px"};
cursor: ${(p: Props) => (p.pointer ? "pointer" : "")};
`

const Large = Regular.extend`
  font-size: 1.1em;
`

const Small = Regular.extend`
  font-size: 0.9em;
`

const ExtraSmall = Regular.extend`
  font-size: 0.8em;
`

const ExtraLarge = Regular.extend`
  font-size: 2em;
`

const Garamond = Regular.extend`
  font-family: EBGaramond;
  line-height: 24px;
`

export default {
  xl: ExtraLarge,
  l: Large,
  regular: Regular,
  s: Small,
  xs: ExtraSmall,
  garamond: Garamond
}
