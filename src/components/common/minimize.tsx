import styled from "styled-components"

import { colors } from "../../lib/colors"

interface MinimizeProps {
  hide?: boolean
}

export default styled.div`
  visibility: ${(p: MinimizeProps) => (p.hide ? "hidden" : "visible")};
  width: 12px;
  height: 2px;
  border: 5px solid ${colors.gray};
  background-color: ${colors.gray};
  cursor: pointer;
  &:hover {
    background-color: ${colors.lightestGray};
  }
`
