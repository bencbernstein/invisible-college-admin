import * as React from "react"
import { Redirect } from "react-router"

import Header from "../common/header"
import Input from "../common/input"
import { Container, Form, ErrorMessage } from "./components"

import { loginUser } from "../../models/user"

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

  public render() {
    const { redirect, email, password, error } = this.state

    if (redirect) {
      return <Redirect to={redirect} />
    }

    return (
      <Container>
        <Header.m>invisible college</Header.m>

        <Form onSubmit={this.handleSubmit.bind(this)}>
          <Input.m
            onChange={e => this.setState({ email: e.target.value })}
            value={email}
            autoCapitalize={"none"}
            placeholder="Email"
            type="text"
          />
          <Input.m
            onChange={e => this.setState({ password: e.target.value })}
            value={password}
            autoCapitalize={"none"}
            placeholder="Password"
            type="text"
          />
          <Input.submit type="submit" />
        </Form>

        <ErrorMessage>{error}</ErrorMessage>
      </Container>
    )
  }
}

export default Login
