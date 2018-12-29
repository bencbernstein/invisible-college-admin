import styled from "styled-components"

import { colors } from "../../lib/colors"

export const LeftPane = styled.div`
  width: 200px;
  min-width: 200px;
  margin-right: 20px;
`

export const RightPane = styled.div`
  width: 640px;
  margin-left: 20px;
`

export const Textarea = styled.textarea`
  width: 100%;
  height: 150px;
  color: ${colors.gray};
  padding: 10px;
  border: 0.5px solid ${colors.lightestGray};
  box-sizing: border-box;
`

export const Divider = styled.div`
  margin: 15px 0px 20px 0px;
  width: 100%;
  height: 1px;
  background-color: ${colors.lightGray};
`

interface SearchContainerProps {
  expanded: boolean
}

export const SearchContainer = styled.div`
  box-sizing: border-box;
  width: 49%;
  padding: ${(p: SearchContainerProps) => (p.expanded ? "10px" : "")};
  border: ${(p: SearchContainerProps) =>
    p.expanded ? `4px solid ${colors.lightGray}` : ""};
`

export const SearchForm = styled.form`
  display: flex;
  align-items: center;
  justify-content: space-between;
`