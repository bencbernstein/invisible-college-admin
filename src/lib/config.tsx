import * as dotenv from "dotenv"
dotenv.config()

const CONFIG = {
  API_URL: /*process.env.REACT_APP_API_URL || */ "http://localhost:3002"
}

export default CONFIG
