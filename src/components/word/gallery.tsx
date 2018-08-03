import * as React from "react"
import styled from "styled-components"

import { colors } from "../../lib/colors"
import Box from "../common/box"
import Header from "../common/header"
import Icon from "../common/icon"
// import Text from "../common/text"

import deleteIconRed from "../../lib/images/icon-delete-red.png"
import deleteIcon from "../../lib/images/icon-delete.png"

const FileLabel = styled.label`
  width: 100%;
  height: 100%;
  position: absolute;
  cursor: pointer;
`

const ImageContainer = styled.div`
  height: 250px;
  width: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
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

const ImagesContainer = styled.div`
  display: grid;
  grid-row-gap: 30px;
  grid-template-columns: 1fr 1fr 1fr;
`

interface Props {
  imagesBase64: string[]
  addImage: (filelist: FileList) => void
  removeImage: (imageId: string) => void
}

interface State {
  isHoveringDelete?: number
}

class Gallery extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {}
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

    const addImg = (
      <Box.regular>
        <img
          style={{ height: "50px", width: "50px" }}
          src={require("../../lib/images/icon-add.png")}
        />

        <FileLabel>
          <input
            style={{ display: "none", width: "100%", height: "100%" }}
            type="file"
            onChange={e => this.props.addImage(e.target.files!)}
          />
        </FileLabel>
      </Box.regular>
    )

    return (
      <div style={{ marginTop: "30px" }}>
        <Header.s>images</Header.s>
        <ImagesContainer>
          {imagesBase64.map((image: any, i: number) => img(image, i))}
          {addImg}
        </ImagesContainer>
      </div>
    )
  }
}

export default Gallery
