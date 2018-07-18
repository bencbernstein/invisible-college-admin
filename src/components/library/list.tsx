import * as React from "react"
import { Redirect } from "react-router"
import { Link } from "react-router-dom"
import styled from "styled-components"

import { colors } from "../../lib/colors"

import { SelectedView } from "./"

import textIcon from "../../lib/images/icon-text.png"
import wordIcon from "../../lib/images/icon-word.png"

const Container = styled.div`
  text-align: center;
  width: 95%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 25px 0px;
`

const Box = styled.div`
  position: relative;
  color: black;
  border: 1px solid ${colors.lightGray};
  width: 250px;
  height: 250px;
  cursor: pointer;
  margin: 15px 0px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const Icon = styled.img`
  position: absolute;
  top: 5px;
  right: 5px;
  height: 25px;
  width: 25px;
`

interface Props {
  data: any[]
  selectedView: SelectedView
}

class List extends React.Component<Props, any> {
  constructor(props: Props) {
    super(props)
    this.state = {}
  }

  public render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }

    const { data, selectedView } = this.props

    const textBox = (d: any) => (
      <Link key={d.id} style={{ textDecoration: "none" }} to={`/text/${d.id}`}>
        <Box>
          <Icon src={textIcon} />
          <p>{d.name}</p>
        </Box>
      </Link>
    )

    const wordBox = (d: any) => (
      <Box key={d.id}>
        <Icon src={wordIcon} />
        <p>{d.value}</p>
      </Box>
    )

    const box = (d: any) => (selectedView === "Texts" ? textBox(d) : wordBox(d))

    return <Container>{data.map(box)}</Container>
  }
}

export default List
