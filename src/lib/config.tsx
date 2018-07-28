console.log(process.env)

const CONFIG = {
  PORT: process.env.PORT || 3002,
  API_URL: process.env.API_URL || "http://localhost:3002"
}

export default CONFIG
