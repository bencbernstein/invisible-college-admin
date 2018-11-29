import * as React from "react"
import styled from "styled-components"
import { last, pickBy } from "lodash"

import Header from "../common/header"
import StyledText from "../common/text"

import { Text, fetchText, updateText } from "../../models/text"
import { User } from "../../models/user"
import { colors } from "../../lib/colors"

interface State {
  redirect?: string
  text?: Text
  isHovering: boolean
  title?: string
  author?: string
  isFocused: boolean
}

interface Props {
  user: User
}

class TextComponent extends React.Component<Props, State> {
  constructor(props: any) {
    super(props)

    this.state = {
      isHovering: false,
      isFocused: false
    }
  }

  public componentDidMount() {
    this.loadData()
  }

  private async handleSubmit(e: any) {
    this.setState({ isFocused: false })
    const { author, title, text } = this.state
    if (!text) return
    const doc = pickBy({
      author,
      title
    })
    await updateText(text.id, { doc })
  }

  private async loadData() {
    const id = last(window.location.pathname.split("/"))
    if (!id) return
    const text = await fetchText(id)
    if (text instanceof Error) return
    this.setState({ text, title: text.title })
  }

  public render() {
    const { author, isHovering, isFocused, text, title } = this.state
    if (!text) return null

    const displayInputs = isHovering || isFocused

    return (
      <div>
        <form
          onMouseEnter={() => this.setState({ isHovering: true })}
          onMouseLeave={() => this.setState({ isHovering: false })}
          onFocus={() => this.setState({ isFocused: true })}
          onBlur={this.handleSubmit.bind(this)}
          style={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center"
          }}
        >
          {displayInputs || !title ? (
            <InputHeader
              onChange={e => this.setState({ title: e.target.value })}
              placeholder="Title"
              spellCheck={false}
              value={title || ""}
            />
          ) : (
            <Header.l margin="0">{title}</Header.l>
          )}

          {displayInputs || !author ? (
            <InputSubHeader
              onChange={e => this.setState({ author: e.target.value })}
              type="text"
              spellCheck={false}
              placeholder="by ..."
              value={author || ""}
            />
          ) : (
            <StyledText.regular>{author}</StyledText.regular>
          )}
        </form>
      </div>
    )
  }
}

const InputHeader = styled.textarea`
  font-size: 2.3em;
  outline: none;
  color: ${colors.darkGray};
  font-family: BrandonGrotesque;
  text-align: center;
  padding: 0;
  letter-spacing: 1px;
  margin: 0;
  border-radius: 0;
  border: none;
`

const InputSubHeader = styled.input`
  outline: none;
  font-size: 1em;
  font-family: BrandonGrotesque;
  color: ${colors.darkGray};
  text-align: center;
  padding: 0;
  margin: 2.5px 0px;
  border: none;
  box-sizing: border-box;
`

export default TextComponent
