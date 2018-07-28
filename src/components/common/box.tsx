import styled from "styled-components"
import { colors } from "../../lib/colors"

const Box = styled.div`
  position: relative;
  color: black;
  border: 1px solid ${colors.lightGray};
  width: 250px;
  min-height: 250px;
  padding: 10px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
`

export default {
  regular: Box
}
