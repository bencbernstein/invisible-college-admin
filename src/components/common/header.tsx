import styled from "styled-components"

interface Props {
  textAlign?: string
  margin?: string
  textDecoration?: string
  flex?: number
  color?: string
}

const Large = styled.p`
  font-size: 2.3em;
  color: ${(p: Props) => p.color};
  letter-spacing: 1px;
  font-family: BrandonGrotesque;
  margin: ${(p: Props) => p.margin};
  text-align: ${(p: Props) => p.textAlign};
  text-decoration: ${(p: Props) => p.textDecoration};
  flex: ${(p: Props) => p.flex};
`

const ExtraLarge = Large.extend`
  font-size: 4.5em;
`

const MediumL = styled.h2`
  font-family: BrandonGrotesqueBold;
  letter-spacing: 1px;
  color: ${(p: Props) => p.color};
  margin: ${(p: Props) => p.margin};
  text-align: ${(p: Props) => p.textAlign};
  text-decoration: ${(p: Props) => p.textDecoration};
  flex: ${(p: Props) => p.flex};
`

const Medium = styled.h3`
  font-family: BrandonGrotesqueBold;
  letter-spacing: 1px;
  margin: ${(p: Props) => p.margin};
  color: ${(p: Props) => p.color};
  text-align: ${(p: Props) => p.textAlign};
  text-decoration: ${(p: Props) => p.textDecoration};
  flex: ${(p: Props) => p.flex};
`

const Small = styled.h5`
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
`

export default {
  l: Large,
  m: Medium,
  ml: MediumL,
  xl: ExtraLarge,
  s: Small,
  forInput: ForInput
}
