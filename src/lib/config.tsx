import * as dotenv from "dotenv"
dotenv.config()

const CONFIG = {
  API_URL:
    "https://invisible-college-api.herokuapp.com" || "http://localhost:3002"
}

export default CONFIG
