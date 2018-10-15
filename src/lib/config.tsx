import * as dotenv from "dotenv"
dotenv.config()

const CONFIG = {
  API_URL: process.env.API_URL || "http://localhost:3002",
  DISCOVER_API_URL: process.env.DISCOVER_API_URL || "http://localhost:5000",
  ZOOLOGY_SEQUENCE_ID: "5bbca1b7c049b6617c50a8e6"
}

export default CONFIG
