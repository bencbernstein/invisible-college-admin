import styled from "styled-components"

interface Props {
  textAlign?: string
  margin?: string
  textDecoration?: string
  flex?: number
  color?: string
}

const headerProps = (props: Props) => `
  margin: ${props.margin};
  text-align: ${props.textAlign};
  text-decoration: ${props.textDecoration};
  flex: ${props.flex};
  color: ${props.color};
  letter-spacing: 1px;
  font-family: BrandonGrotesqueBold;
  text-transform: uppercase;
`

const LargeThin = styled.p`
  font-size: 2.3em;
  letter-spacing: 1px;
  margin: 0;
`

const Large = styled.h2`
  ${(p: Props) => headerProps(p)}
`

const ExtraLarge = styled.h1`
  ${(p: Props) => headerProps(p)}
`

const Medium = styled.h3`
  ${(p: Props) => headerProps(p)}
`

const Small = styled.h4`
  ${(p: Props) => headerProps(p)}
`

const ForInput = Small.extend`
  text-align: center;
  font-family: BrandonGrotesque;
  margin: 0px 0px 5px 0px;
`

export default {
  l: Large,
  largeThin: LargeThin,
  m: Medium,
  xl: ExtraLarge,
  s: Small,
  forInput: ForInput
}
