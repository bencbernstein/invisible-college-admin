import * as React from "react"
import { Provider } from "react-redux"
import * as ReactDOM from "react-dom"
import App from "./components/app"
import registerServiceWorker from "./registerServiceWorker"

import configureStore from "./store/configureStore"
const store = configureStore()

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root") as HTMLElement
)
registerServiceWorker()
