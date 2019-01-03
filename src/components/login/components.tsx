import styled from "styled-components"

import { colors } from "../../lib/colors"

import Header from "../common/header"

import backgroundImg from "../../lib/images/background-opaque.png"

interface HeaderProps {
  isGameTitle: boolean
}

export const MainHeader = Header.m.extend`
  font-family: ${(p: HeaderProps) => p.isGameTitle && "Averia"};
  margin: 0;
  display: flex;
  align-items: center;
  z-index: 10;
`

export const Form = styled.form`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 10;
  position: relative;
  text-align: center;
  background-image: url(${backgroundImg});
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
`

export const ErrorMessage = styled.p`
  color: ${colors.red};
  font-size: 0.85em;
  height: 50px;
  line-height: 50px;
  margin: 0;
  text-align: center;
`

export const BoldSpan = styled.span`
  color: ${colors.blue};
  font-family: BrandonGrotesqueBold;
`
