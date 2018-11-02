import styled from "styled-components"

interface Props {
  textAlign?: string
  margin?: string
  textDecoration?: string
  flex?: number
  uppercase?: boolean
  color?: string
}

const Large = styled.p`
  font-size: 2.3em;
  color: ${(p: Props) => p.color};
  letter-spacing: 1px;
  margin: ${(p: Props) => p.margin};
  text-align: ${(p: Props) => p.textAlign};
  text-decoration: ${(p: Props) => p.textDecoration};
  flex: ${(p: Props) => p.flex};
  text-transform: ${(p: Props) => p.uppercase && "uppercase"};
`

const ExtraLarge = Large.extend`
  font-size: 4.5em;
`

const MediumL = styled.h2`
  text-transform: ${(p: Props) => p.uppercase && "uppercase"};
  font-family: BrandonGrotesqueBold;
  letter-spacing: 1px;
  color: ${(p: Props) => p.color};
  margin: ${(p: Props) => p.margin};
  text-align: ${(p: Props) => p.textAlign};
  text-decoration: ${(p: Props) => p.textDecoration};
  flex: ${(p: Props) => p.flex};
`

const Medium = styled.h3`
  text-transform: ${(p: Props) => p.uppercase && "uppercase"};
  font-family: BrandonGrotesqueBold;
  letter-spacing: 1px;
  margin: ${(p: Props) => p.margin};
  color: ${(p: Props) => p.color};
  text-align: ${(p: Props) => p.textAlign};
  text-decoration: ${(p: Props) => p.textDecoration};
  flex: ${(p: Props) => p.flex};
`

const Small = styled.h5`
  text-transform: ${(p: Props) => p.uppercase && "uppercase"};
  font-family: BrandonGrotesqueBold;
  margin: 15px 0px;
  color: ${(p: Props) => p.color};
  letter-spacing: 1px;
  margin: ${(p: Props) => p.margin};
  text-align: ${(p: Props) => p.textAlign};
  text-decoration: ${(p: Props) => p.textDecoration};
  flex: ${(p: Props) => p.flex};
`

const ForInput = Small.extend`
  text-align: center;
  font-family: BrandonGrotesque;
  margin: 0px 0px 5px 0px;
  text-transform: none;
`

export default {
  l: Large,
  m: Medium,
  ml: MediumL,
  xl: ExtraLarge,
  s: Small,
  forInput: ForInput
}
