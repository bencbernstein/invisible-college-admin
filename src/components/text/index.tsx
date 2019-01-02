import * as React from "react"
import { connect } from "react-redux"
import styled from "styled-components"
import { pickBy, isEqual } from "lodash"

import Header from "../common/header"
import StyledText from "../common/text"
import Spinner from "../common/spinner"
import Icon from "../common/icon"
import BottomNav from "../common/bottomNav"

import {
  fetchTextAction,
  setEntity,
  fetchEsPassageBySectionAction
} from "../../actions"
import { User } from "../../interfaces/user"
import { colors } from "../../lib/colors"
import { lastPath } from "../../lib/helpers"

import nextImg from "../../lib/images/icon-next.png"

interface State {
  redirect?: string
  text?: any
  isHovering: boolean
  title?: string
  author?: string
  isFocused: boolean
}

interface Props {
  text: any
  esPassage: any
  user: User
  isLoading: boolean
  dispatch: any
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

  public componentWillReceiveProps(nextProps: Props) {
    const { text } = nextProps
    if (text && !isEqual(text, !this.props.text)) {
      this.setState({ title: text._source.title })
    }
  }

  private async handleSubmit(e: any) {
    this.setState({ isFocused: false })
    const { author, title, text } = this.state
    if (!text) return
    const doc = pickBy({
      author,
      title
    })
    console.log(doc)
    // TODO: - update text + passages
    // await updateText(text.id, { doc })
  }

  private async loadData() {
    this.props.dispatch(setEntity({ isLoading: true }))
    this.props.dispatch(fetchTextAction(lastPath(window)))
  }

  private loadPassage(section: number) {
    this.props.dispatch(setEntity({ isLoading: true }))
    this.props.dispatch(
      fetchEsPassageBySectionAction(
        "simple_english_wikipedia",
        this.props.text._id,
        section
      )
    )
  }

  public render() {
    const { isHovering, isFocused, title } = this.state
    const { esPassage, isLoading, text } = this.props

    if (isLoading || !esPassage) return <Spinner />
    if (!title) return null

    const current = parseInt(esPassage._source.section, 10)
    const totalPages = text._source.sections_count
    const displayInputs = isHovering || isFocused

    return (
      <div style={{ margin: "0", textAlign: "center" }}>
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
            <Header.l margin="0" style={{ height: "60px" }}>
              {title}
            </Header.l>
          )}

          {/* {displayInputs || !author ? (
            <InputSubHeader
              onChange={e => this.setState({ author: e.target.value })}
              type="text"
              spellCheck={false}
              placeholder="by ..."
              value={author || ""}
            />
          ) : (
            <StyledText.regular>{author}</StyledText.regular>
          )} */}
        </form>

        <StyledText.s margin="0 0 15px 0" color={colors.gray}>
          Page {current + 1} of {totalPages}
        </StyledText.s>

        <div style={{ textAlign: "left" }}>
          {esPassage._source.sentences.map((s: string, i: number) => (
            <StyledText.garamond key={i}>{s}</StyledText.garamond>
          ))}
        </div>

        <BottomNav>
          <Icon
            margin="0 50px"
            pointer={true}
            large={true}
            disable={current === 0}
            onClick={() => this.loadPassage(current - 1)}
            flipHorizontal={true}
            src={nextImg}
          />
          <Icon
            margin="0 50px"
            pointer={true}
            large={true}
            disable={current + 1 === totalPages}
            onClick={() => this.loadPassage(current + 1)}
            src={nextImg}
          />
        </BottomNav>
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
  height: 60px;
  padding: 0;
  letter-spacing: 1px;
  margin: 0;
  border-radius: 0;
  border: none;
`

// const InputSubHeader = styled.input`
//   outline: none;
//   font-size: 1em;
//   font-family: BrandonGrotesque;
//   color: ${colors.darkGray};
//   text-align: center;
//   padding: 0;
//   margin: 2.5px 0px;
//   border: none;
//   box-sizing: border-box;
// `

const mapStateToProps = (state: any, ownProps: any) => ({
  text: state.entities.text,
  isLoading: state.entities.isLoading === true,
  esPassage: state.entities.esPassage
})

export default connect(mapStateToProps)(TextComponent)