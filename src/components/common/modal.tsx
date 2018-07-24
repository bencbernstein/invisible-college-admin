import * as React from "react"
import styled from "styled-components"

import { colors } from "../../lib/colors"
import { Alert } from "../app"
import Text from "../common/text"

export const Modal = styled.div`
  background-color: white;
  border: 1px solid black;
  bottom: 20px;
  position: fixed;
  margin: 0 auto;
  left: 5%;
  padding: 10px 10px 20px 10px;
  box-sizing: border-box;
`

export const alertModal = (alert: Alert) => (
  <Modal>
    <Text.regular color={alert.success ? colors.green : colors.red}>
      {alert.message}
    </Text.regular>
  </Modal>
)
