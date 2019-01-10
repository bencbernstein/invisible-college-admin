import * as React from "react"
import { Redirect } from "react-router"
import { connect } from "react-redux"
import styled from "styled-components"
import { pickBy, isEqual, initial } from "lodash"
import { CSVLink } from "react-csv"

import Header from "../common/header"
import StyledText from "../common/text"
import Spinner from "../common/spinner"
import Icon from "../common/icon"
import BottomNav from "../common/bottomNav"
import Button from "../common/button"
import FlexedDiv from "../common/flexedDiv"

import {
  fetchTextAction,
  setEntity,
  fetchEsPassageBySectionAction,
  removeTextAction,
  updateTextAction,
  fetchPassagesAndAddressesAction
} from "../../actions"

import { User } from "../../interfaces/user"
import { colors } from "../../lib/colors"
import { sleep, cleanPageNumbers } from "../../lib/helpers"
import nextImg from "../../lib/images/icon-next.png"
import deleteIcon from "../../lib/images/icon-delete.png"
import backIcon from "../../lib/images/icon-back.png"
import blankLinkStyle from "../common/blankLinkStyle"

interface State {
  redirect?: string
  isHovering: boolean
  title?: string
  author?: string
  isFocused: boolean
  headerHeight?: number
  id: string
  index: string
  addresses?: any[]
}

interface Props {
  text: any
  esPassage: any
  user: User
  isLoading: boolean
  isRob: boolean
  dispatch: any
}

class TextComponent extends React.Component<Props, State> {
  constructor(props: any) {
    super(props)

    const path = window.location.pathname.split("/")
    const id = path.pop()!
    const index = path.pop()!.replace(/-/g, "_")

    this.state = {
      isHovering: false,
      isFocused: false,
      id,
      index
    }
  }

  public componentDidMount() {
    this.loadData()
  }

  public componentWillReceiveProps(nextProps: Props) {
    const { text, isRob } = nextProps
    if (!text || (this.state.title && isEqual(text, this.props.text))) return
    const { author, title } = text._source
    this.setState({ author, title })
    if (isRob) {
      this.downloadAddressCsv(text._id)
    }
  }

  private async handleSubmit(e: any) {
    this.setState({ isFocused: false })
    const { title, author, id, index } = this.state
    if (!title) return
    const doc = pickBy({ title, author })
    this.props.dispatch(updateTextAction(index, id, { doc }))
  }

  private async loadData() {
    this.props.dispatch(setEntity({ isLoading: true }))
    this.props.dispatch(fetchTextAction(this.state.index, this.state.id))
  }

  private loadPassage(section: number) {
    const index = this.state.index
    const { dispatch, text } = this.props
    dispatch(setEntity({ isLoading: true }))
    dispatch(fetchEsPassageBySectionAction(index, text._id, section))
  }

  private goToMap() {
    const id = this.props.text._id
    this.setState({ redirect: "/map/" + id })
  }

  private async downloadAddressCsv(id: string) {
    const result = await this.props.dispatch(
      fetchPassagesAndAddressesAction(id)
    )
    const addresses = result.response.data
    if (!addresses) return
    addresses.forEach(
      (a: any) =>
        (a.context = cleanPageNumbers(
          a.context
            .replace(/"/g, '""')
            .replace(/\r?\n?/g, "")
            .trim()
        ))
    )

    this.setState({ addresses })
  }

  public render() {
    const {
      isHovering,
      isFocused,
      title,
      author,
      index,
      addresses,
      id,
      redirect
    } = this.state

    const { isRob, esPassage, isLoading, text } = this.props

    if (redirect) return <Redirect to={redirect} />
    if (isLoading || !esPassage) return <Spinner />
    if (!title) return null

    const current = parseInt(esPassage._source.section, 10)
    const totalPages = text._source.sections_count
    const displayInputs = isHovering || isFocused

    return (
      <div style={{ margin: "0", textAlign: "center" }}>
        <FlexedDiv alignItems="flex-start">
          <FlexedDiv justifyContent="flex-start" flex={1}>
            <Icon
              onClick={() =>
                this.setState({
                  redirect: initial(window.location.pathname.split("/")).join(
                    "/"
                  )
                })
              }
              pointer={true}
              src={backIcon}
            />
          </FlexedDiv>

          <form
            onMouseEnter={() => {
              const element = document.getElementById("textTitle")
              const state: any = { isHovering: true }
              if (!isHovering) {
                state.headerHeight = element ? element.clientHeight : 50
              }
              this.setState(state)
            }}
            onMouseLeave={() => this.setState({ isHovering: false })}
            onFocus={() => this.setState({ isFocused: true })}
            onBlur={this.handleSubmit.bind(this)}
            style={{
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              flex: 10,
              border: `1px solid ${colors.lightGray}`,
              borderRadius: "5px",
              padding: "5px"
            }}
          >
            {displayInputs || !title ? (
              <InputHeader
                onChange={e => this.setState({ title: e.target.value })}
                placeholder="Title"
                headerHeight={this.state.headerHeight}
                spellCheck={false}
                value={title || ""}
              />
            ) : (
              <Header.largeThin id="textTitle">{title}</Header.largeThin>
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
              <StyledText.regular margin="5px 0">{author}</StyledText.regular>
            )}
          </form>

          <FlexedDiv justifyContent="flex-end" flex={1}>
            <Icon
              onClick={async () => {
                if (window.confirm(`Delete ${text._source.title}?`)) {
                  await this.props.dispatch(removeTextAction(index, id))
                  await sleep(1)
                  this.setState({ redirect: `/library/${index}` })
                }
              }}
              pointer={true}
              src={deleteIcon}
            />
          </FlexedDiv>
        </FlexedDiv>

        <StyledText.s margin="5px 0 15px 0" color={colors.gray}>
          Page {current + 1} of {totalPages}
        </StyledText.s>

        <div style={{ textAlign: "left" }}>
          {esPassage._source.sentences.map((s: string, i: number) => (
            <StyledText.garamond key={i}>
              {cleanPageNumbers(s)}
            </StyledText.garamond>
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

        {isRob && (
          <FlexedDiv justifyContent="flex-end" flex={1}>
            <Button.regular
              onClick={this.goToMap.bind(this)}
              disabled={!Array.isArray(addresses)}
              style={{
                margin: 0,
                position: "fixed",
                bottom: "25px",
                left: "25px"
              }}
            >
              Map
            </Button.regular>
            <Button.regular
              onClick={this.downloadAddressCsv.bind(this)}
              disabled={!Array.isArray(addresses)}
              style={{
                margin: 0,
                position: "fixed",
                bottom: "25px",
                right: "25px"
              }}
            >
              <CSVLink
                data={addresses || []}
                filename={
                  (title || "").replace(/ /g, "_").toLowerCase() + ".csv"
                }
                style={blankLinkStyle}
                asyncOnClick={true}
                headers={["address", "page_number", "context", "word_count"]}
                onClick={(event: any, done: any) => {
                  if (addresses!.length > 0) return done()
                  this.props.dispatch(
                    setEntity({ error: { type: "No Results" } })
                  )
                  done(false)
                }}
              >
                Download Address CSV
              </CSVLink>
            </Button.regular>
          </FlexedDiv>
        )}
      </div>
    )
  }
}

interface InputHeaderProps {
  headerHeight?: number
}

const InputHeader = styled.textarea`
  font-size: 2.3em;
  outline: none;
  color: ${colors.darkGray};
  font-family: BrandonGrotesque;
  text-align: center;
  padding: 0;
  letter-spacing: 1px;
  height: ${(p: InputHeaderProps) => p.headerHeight || 50}px;
  margin: 0;
  border-radius: 0;
  border: none;
  resize: none;
`

const InputSubHeader = styled.input`
  outline: none;
  font-size: 1em;
  font-family: BrandonGrotesque;
  color: ${colors.darkGray};
  text-align: center;
  padding: 0;
  margin: 5px 0px;
  border: none;
  box-sizing: border-box;
`

const mapStateToProps = (state: any, ownProps: any) => ({
  text: state.entities.text,
  isLoading: state.entities.isLoading === true,
  esPassage: state.entities.esPassage,
  isRob: state.entities.isRob === true
})

export default connect(mapStateToProps)(TextComponent)
