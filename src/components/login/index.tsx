import * as React from "react"
import { Redirect } from "react-router"
import styled from "styled-components"

import { colors } from "../../lib/colors"
import Header from "../common/header"
import Input from "../common/input"

import { loginUser } from "../../models/user"

const Container = styled.div`
  height: 100vh;
  position: absolute;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100vw;
`

const Form = styled.form`
  width: 300px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  height 150px;
  justify-content: space-between;
`

const ErrorMessage = styled.p`
  color: ${colors.red};
  font-size: 0.85em;
`

export interface Props {
  login: (token: string) => void
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
        this.setState({ error: undefined, redirect: "/library" })
        this.props.login(response)
      }
    }
  }

  public render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }

    return (
      <Container>
        <Header.m>invisible college</Header.m>

        <Form onSubmit={this.handleSubmit.bind(this)}>
          <Input.m
            onChange={e => this.setState({ email: e.target.value })}
            value={this.state.email}
            autoCapitalize={"none"}
            placeholder="Email"
            type="text"
          />
          <Input.m
            onChange={e => this.setState({ password: e.target.value })}
            value={this.state.password}
            autoCapitalize={"none"}
            placeholder="Password"
            type="text"
          />
          <Input.submit type="submit" />
        </Form>

        <ErrorMessage>{this.state.error}</ErrorMessage>
      </Container>
    )
  }
}

export default Login
