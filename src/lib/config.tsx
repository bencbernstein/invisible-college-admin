import * as dotenv from "dotenv"
dotenv.config()

const CONFIG = {
  API_URL:
    "https://invisible-college-api.herokuapp.com" || "http://localhost:3002",
  DISCOVER_API_URL:
    "https://discover9292.herokuapp.com" || "http://localhost:5000",
  ZOOLOGY_SEQUENCE_ID: "5bbca1b7c049b6617c50a8e6"
}

export default CONFIG
