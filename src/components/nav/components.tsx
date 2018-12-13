import styled from "styled-components"
import { colors } from "../../lib/colors"

// Nav

export const NavBox = styled.div`
  text-align: center;
  display: flex;
  margin-bottom: 5px;
  justify-content: space-between;
  align-items: flex-start;
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
