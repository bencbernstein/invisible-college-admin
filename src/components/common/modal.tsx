import styled from "styled-components"

import { colors } from "../../lib/colors"

export default styled.div`
  position: fixed;
  border: 1px solid ${colors.lightGray};
  left: 50%;
  top: 50%;
  min-width: 250px;
  min-height: 200px;
  transform: translate(-50%, -50%);
  padding: 10px 25px;
  box-sizing: border-box;
  text-align: center;
`
