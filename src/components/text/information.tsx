import * as React from "react"
import styled from "styled-components"

import { colors } from "../../lib/colors"
import Button from "../common/button"
import Input from "../common/input"
import Text from "../common/text"

import { parseText } from "../../models/text"
import { Screen, TextDoc } from "./"

const Container = styled.div`
  text-align: center;
  width: 100%;
  display: flex;
  flex-direction: column;
  max-width: 450px;
  margin: 0 auto;
`

interface Props {
  text?: TextDoc
  isNew: boolean
  name?: string
  displayScreen: (isDisplaying: Screen) => {}
}

interface State {
  fileInputText?: string
  file?: File
  name: string
  source: string
  filename?: string
  error?: string
  isSaving: boolean
}

class Information extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      name: "",
      source: "",
      isSaving: false,
      fileInputText: "Upload File"
    }
  }

  public componentDidMount() {
    if (!this.props.isNew) {
      const { name, source } = this.props.text!
      this.setState({ name, source })
    }
  }

  public handleChange(selectorFiles: FileList) {
    const file = selectorFiles[0]
    if (file) {
      const filename = file.name
      this.setState({ fileInputText: filename, file })
    }
  }

  public async save() {
    const { file, name, source } = this.state

    if (!file || !name || !source) {
      const error = "All fields are required."
      this.setState({ error })
      return
    }

    this.setState({ error: undefined, isSaving: true })
    const result = await parseText(file, name, source)

    if (result.error) {
      this.setState({ error: result.error })
    } else {
      // TODO: - navigate
    }
  }

  public render() {
    const { fileInputText, name, source, error, isSaving } = this.state

    return (
      <Container>
        <Input.l
          onChange={e => this.setState({ name: e.target.value })}
          value={name}
          placeholder="Name"
          type="text"
        />

        <br />

        <Input.l
          onChange={e => this.setState({ source: e.target.value })}
          value={source}
          placeholder="Source"
          type="text"
        />

        <br />
        <br />

        {this.props.isNew && (
          <Input.file>
            <input
              style={{ display: "none" }}
              type="file"
              onChange={e => this.handleChange(e.target.files!)}
            />
            {fileInputText}
          </Input.file>
        )}

        <br />
        <br />
        <br />

        <Button.l disabled={isSaving} onClick={this.save.bind(this)}>
          Save
        </Button.l>

        <Text.regular color={colors.red}>{error}</Text.regular>
      </Container>
    )
  }
}

export default Information
