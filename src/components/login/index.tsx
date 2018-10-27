import * as React from "react"
import { Redirect } from "react-router"

import Text from "../common/text"
import Input from "../common/input"
import { Form, BoldSpan, ErrorMessage, MainHeader } from "./components"

import { loginUser, createUser } from "../../models/user"

export interface Props {
  login: (token: string, cb: () => void) => void
}

interface State {
  email: string
  password: string
  firstName: string
  lastName: string
  error?: string
  redirect?: string
  view: View
}

enum View {
  Login,
  SignUp
}

class Login extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      view: View.Login
    }
  }

  public handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const { email, password, firstName, lastName, view } = this.state

    if (!email || !password) {
      this.setState({ error: "Email and  password are required." })
    } else if (view === View.SignUp) {
      const error = this.invalidLogin(email, password, firstName, lastName)
      error === null
        ? this.signUp(email, password, firstName, lastName)
        : this.setState({ error })
    } else if (view === View.Login) {
      this.logIn(email, password)
    }
  }

  public invalidLogin(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): string | null {
    if (email.length < 4) {
      return "Email must be longer than 4 characters."
    } else if (password.length < 6 || password.length > 20) {
      return "Password must be between 6 and 20 characters."
    } else if (!firstName || !lastName) {
      return "First and last name required."
    }
    return null
  }

  public async logIn(email: string, password: string) {
    const response = await loginUser(email, password)
    response instanceof Error
      ? this.setState({ error: response.message })
      : this.props.login(response, () =>
          this.setState({ redirect: "/library" })
        )
  }

  public async signUp(
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) {
    const response = await createUser(email, password, firstName, lastName)
    response instanceof Error
      ? this.setState({ error: response.message })
      : this.props.login(response, () =>
          this.setState({ redirect: "/library" })
        )
  }

  public render() {
    const {
      redirect,
      email,
      password,
      firstName,
      lastName,
      error,
      view
    } = this.state

    if (redirect) {
      return <Redirect to={redirect} />
    }

    const isLoggingIn = view === View.Login

    return (
      <Form onSubmit={this.handleSubmit.bind(this)}>
        <MainHeader isGameTitle={isLoggingIn}>
          {isLoggingIn ? "invisible college" : "sign up"}
        </MainHeader>

        <br />

        <Input.rounded
          width="100%"
          margin="0 0 10px 0"
          onChange={e => this.setState({ email: e.target.value })}
          value={email}
          autoCapitalize={"none"}
          placeholder="Email"
          type="text"
        />

        <Input.rounded
          width="100%"
          margin="0 0 10px 0"
          onChange={e => this.setState({ password: e.target.value })}
          value={password}
          autoCapitalize={"none"}
          placeholder="Password"
          type="password"
        />

        {!isLoggingIn && (
          <div>
            {" "}
            <Input.rounded
              width="100%"
              margin="0 0 10px 0"
              onChange={e => this.setState({ firstName: e.target.value })}
              value={firstName}
              placeholder="First name"
              type="text"
            />
            <Input.rounded
              width="100%"
              margin="0 0 10px 0"
              onChange={e => this.setState({ lastName: e.target.value })}
              value={lastName}
              placeholder="Last name"
              type="text"
            />
          </div>
        )}

        <Input.roundedS
          width="100%"
          margin="0 0 20px 0"
          type="submit"
          value={isLoggingIn ? "Log In" : "Create Account"}
        />

        {isLoggingIn && (
          <Text.l
            pointer={true}
            onClick={() => this.setState({ view: View.SignUp })}
          >
            No account? <BoldSpan>Sign Up</BoldSpan>
          </Text.l>
        )}

        <ErrorMessage>{error}</ErrorMessage>
      </Form>
    )
  }
}

export default Login
