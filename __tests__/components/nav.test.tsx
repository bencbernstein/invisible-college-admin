import * as React from "react"
import { shallow, ShallowWrapper } from "enzyme"
import configureStore from "redux-mock-store"

import Nav from "../../src/components/nav"
import { User } from "../../src/interfaces/user"
import CONGIG from "../../src/lib/config"

const rob: User = {
  id: CONGIG.ROB_ID,
  admin: false,
  email: "rob@gmail.com",
  password: "password",
  firstName: "Rob",
  lastName: "Blah",
  curricula: []
}

const mockStore = configureStore()
const initialState = {
  entities: {
    user: rob,
    isRob: true
  }
}
const store = mockStore(initialState)

describe("Nav", () => {
  let component: ShallowWrapper<{}, {}, React.Component<{}, {}, any>>

  describe("Rob UI", () => {
    beforeAll(() => {
      const wrapper = shallow(<Nav store={store} />)
      component = wrapper.dive()
    })

    test("only displays links for Concepts and Library", () => {
      expect(
        component.find("Link").map(link =>
          link
            .children()
            .first()
            .children()
            .text()
        )
      ).toEqual(["Concepts", "Library"])
    })
  })
})
