import styled from "styled-components"
import { colors } from "../../lib/colors"

// Nav

export const InvisibleCollege = styled.p`
  text-transform: uppercase;
  font-family: BrandonGrotesqueBold;
  letter-spacing: 1px;
  margin: 0;
  text-align: left;
  color: ${colors.gray};
`

export const NavBox = styled.div`
  text-align: center;
  display: flex;
  margin-bottom: 10px;
  justify-content: space-between;
  align-items: center;
`

interface ButtonProps {
  bold?: boolean
}

export const Button = styled.p`
  cursor: pointer;
  font-family: ${(p: ButtonProps) =>
    p.bold ? "BrandonGrotesqueBold" : "BrandonGrotesque"};
  margin-left: 20px;
  color: ${colors.gray};
`

export const ModalButton = styled.p`
  color: ${colors.gray};
  cursor: pointer;
  font-family: BrandonGrotesqueBold;
  letter-spacing: 1px;
`

export const Modal = styled.div`
  width: 250px;
  text-align: left;
  border: 5px solid ${colors.lightestGray};
  padding: 0px 20px;
  box-sizing: border-box;
  position: absolute;
  right: 0px;
  top: 30px;
  background-color: white;
`

export const FlexBox = styled.div`
  display: flex;
  position: relative;
`

// Subnav

interface SubnavBoxProps {
  minimized: boolean
}

export const SubnavBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${(p: SubnavBoxProps) =>
    p.minimized ? "flex-end" : "space-between"};
  width: 100%;
`

export const ButtonsBox = styled.div`
  display: flex;
`

interface SpanProps {
  color?: string
}

export const Span = styled.span`
  text-transform: capitalize;
  color: ${(p: SpanProps) => p.color};
`
