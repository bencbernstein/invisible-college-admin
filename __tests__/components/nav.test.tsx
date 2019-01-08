import * as React from "react"
import { shallow } from "enzyme"
import configureStore from "redux-mock-store"

import Nav from "../../src/components/nav"

const mockStore = configureStore()
const initialState = {
  entities: {}
}
const store = mockStore(initialState)

describe("<Nav />", () => {
  describe("render()", () => {
    test("renders the component", () => {
      const wrapper = shallow(<Nav store={store} />)
      const component = wrapper.dive()
      console.log(component)
    })
  })
})
