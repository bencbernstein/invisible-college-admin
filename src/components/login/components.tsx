import styled from "styled-components"

import { colors } from "../../lib/colors"

import Header from "../common/header"

export const GameTitle = Header.m.extend`
  margin: 0;
  flex: 11;
  display: flex;
  align-items: center;
  z-index: 10;
`

export const Container = styled.div`
  height: 100vh;
  position: relative;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  width: 100vw;
  z-index: 10;
`

export const Form = styled.form`
  width: 300px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  flex: 9;
  justify-content: space-between;
  z-index: 10;
`

export const ErrorMessage = styled.p`
  color: ${colors.red};
  font-size: 0.85em;
  height: 50px;
  line-height: 50px;
  text-align: center;
`

export const BackgroundImage = styled.img`
  position: fixed;
  max-width: 90%;
  max-height: 50%;
  width: auto;
  height: auto;
  position: fixed;
  top: 0;
  bottom: 0;
  margin: auto;
`
