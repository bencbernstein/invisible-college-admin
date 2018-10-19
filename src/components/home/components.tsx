import styled from "styled-components"

import backgroundImg from "../../lib/images/background.png"
import backgroundImgOpaque from "../../lib/images/background-opaque.png"

import Header from "../common/header"
import { colors } from "../../lib/colors"

interface HeaderProps {
  small?: boolean
}

export const MainHeader = Header.ml.extend`
  font-family: AveriaLight;
  color: ${colors.darkGray};
  font-size: ${(p: HeaderProps) => p.small && "0.85em"};
`

export const Background = styled.div`
  width: 100vw;
  height: 100vh;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url(${backgroundImg});
  @media (max-width: 400px) {
    background-image: url(${backgroundImgOpaque});
  }
`

export const Box = styled.div`
  max-width: 400px;
  width: 100%;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 0 auto;
  position: absolute;
  left: 0;
  right: 0;
  top: 20px;
  bottom: 20px;
  padding: 20px;
  box-sizing: border-box;
  background-color: rgba(255, 255, 255, 0.95);
  @media (max-width: 400px) {
    background-color: rgba(255, 255, 255, 0);
    top: 0px;
    bottom: 0px;
  }
`

export const Stats = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-around;
`

export const Centered = styled.div`
  margin: 0 auto;
  text-align: center;
`
