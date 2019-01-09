import * as dotenv from "dotenv"
dotenv.config()

const CONFIG = {
  API_URL: process.env.REACT_APP_API_URL || "http://localhost:3002",
  MINE_API_URL: process.env.REACT_APP_MINE_API_URL || "http://localhost:5000",
  ROB_ID: process.env.REACT_APP_ROB_ID || "",
  PINBALL_PUBLISHING_ID: process.env.REACT_APP_PINBALL_PUBLISHING_ID || "",
  ARCHITECTURE_INDEX: "architecture"
}

export default CONFIG
