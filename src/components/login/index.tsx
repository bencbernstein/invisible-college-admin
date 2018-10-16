import * as React from "react"
import { Redirect } from "react-router"

import Button from "../common/button"
import Input from "../common/input"
import {
  Container,
  Form,
  ErrorMessage,
  BackgroundImage,
  GameTitle
} from "./components"

import { loginUser } from "../../models/user"

import animals from "../../lib/images/animals.png"
import { colors } from "../../lib/colors"

export interface Props {
  login: (token: string, cb: () => void) => void
}

interface State {
  email: string
  password: string
  error?: string
  redirect?: string
}

class Login extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      email: "",
      password: ""
    }
  }

  public async handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const { email, password } = this.state
    if (!email || !password) {
      this.setState({ error: "Email & password are required." })
    } else {
      const response = await loginUser(email, password)
      if (response instanceof Error) {
        this.setState({ error: response.message })
      } else {
        this.props.login(response, () =>
          this.setState({ redirect: "/library" })
        )
      }
    }
  }

  public signUp() {
    console.log("sign up")
  }

  public render() {
    const { redirect, email, password, error } = this.state

    if (redirect) {
      return <Redirect to={redirect} />
    }

    return (
      <Container>
        <GameTitle>invisible college</GameTitle>

        <BackgroundImage src={animals} />

        <Form onSubmit={this.handleSubmit.bind(this)}>
          <div>
            <Input.rounded
              width="100%"
              margin="0 0 5px 0"
              onChange={e => this.setState({ email: e.target.value })}
              value={email}
              autoCapitalize={"none"}
              placeholder="Email"
              type="text"
            />
            <Input.rounded
              width="100%"
              onChange={e => this.setState({ password: e.target.value })}
              value={password}
              autoCapitalize={"none"}
              placeholder="Password"
              type="text"
            />
          </div>
          <div style={{ margin: "0 auto" }}>
            <Input.roundedS
              margin="0 0 5px 0"
              width="200px"
              type="submit"
              value="Log In"
            />
            <Button.regularWc
              disabled={true}
              onClick={this.signUp.bind(this)}
              color={colors.green}
            >
              Sign Up
            </Button.regularWc>
            <ErrorMessage>{error}</ErrorMessage>
          </div>
        </Form>
      </Container>
    )
  }
}

export default Login
