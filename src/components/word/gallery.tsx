import * as React from "react"
import styled from "styled-components"
import Dropzone from "react-dropzone"

import { colors } from "../../lib/colors"
import ListContainer from "../common/listContainer"
import Header from "../common/header"
import Button from "../common/button"
import Icon from "../common/icon"

import deleteIconRed from "../../lib/images/icon-delete-red.png"
import deleteIcon from "../../lib/images/icon-delete.png"
import FlexedDiv from "../common/flexedDiv"

const ImageContainer = styled.div`
  height: 250px;
  width: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  margin: 10px;
  border: 1px solid ${colors.gray};
`

const Image = styled.img`
  max-height: 250px;
  max-width: 250px;
  padding: 25px;
  box-sizing: border-box;
`
const PositionedIcon = Icon.extend`
  position: absolute;
  top: 5px;
  right: 5px;
`

interface Props {
  imagesBase64: string[]
  addImage: (file: File) => void
  removeImage: (imageId: string) => void
  word: string
}

interface State {
  isHoveringDelete?: number
}

class Gallery extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {}
  }

  public onDrop(acceptedFiles: File[]) {
    if (acceptedFiles.length) {
      this.props.addImage(acceptedFiles[0])
    }
  }

  public search(site: string) {
    const { word } = this.props

    if (site === "google") {
      window.open(
        `https://www.google.com/search?q=${word}&source=lnms&tbm=isch&tbs=sur:fc,ic:gray`,
        "_blank"
      )
    } else if (site === "duckDuckGo") {
      window.open(
        `https://duckduckgo.com/?q=${word}&t=h_&iax=images&ia=images&iaf=color%3Acolor2-bw`,
        "_blank"
      )
    }
  }

  public render() {
    const { imagesBase64 } = this.props
    const { isHoveringDelete } = this.state

    const img = (image: any, i: number) => (
      <ImageContainer key={i}>
        <PositionedIcon
          pointer={true}
          onMouseEnter={() => this.setState({ isHoveringDelete: i })}
          onMouseLeave={() => this.setState({ isHoveringDelete: undefined })}
          onClick={e => this.props.removeImage(image.id)}
          src={isHoveringDelete === i ? deleteIconRed : deleteIcon}
        />
        <Image src={image.base64} />
      </ImageContainer>
    )

    const searchBox = (
      <FlexedDiv justifyContent="flex-start">
        <Button.regular
          marginRight="15px"
          onClick={() => this.search("google")}
        >
          Search Google
        </Button.regular>
        <Button.regular onClick={() => this.search("duckDuckGo")}>
          Search DuckDuckGo
        </Button.regular>
      </FlexedDiv>
    )

    return (
      <div style={{ marginTop: "30px" }}>
        <Header.s>images</Header.s>
        <ListContainer>
          {imagesBase64.map(img)}
          <Dropzone
            style={{
              width: "250px",
              height: "250px",
              color: "transparent",
              cursor: "pointer",
              display: "flex",
              margin: "10px",
              border: `1px solid ${colors.gray}`,
              alignItems: "center",
              justifyContent: "center"
            }}
            accept={"image/jpeg, image/png"}
            onDrop={this.onDrop.bind(this)}
          >
            <img
              style={{ height: "50px", width: "50px" }}
              src={require("../../lib/images/icon-add.png")}
            />
          </Dropzone>
        </ListContainer>
        {searchBox}
      </div>
    )
  }
}

export default Gallery
