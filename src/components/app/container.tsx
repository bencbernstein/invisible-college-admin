// import * as React from "react"

// import Library from "../library"
// import Collections from "../text/collections"
// import Discover from "../discover"
// import Passage from "../passage"
// import Passages from "../passages"
// import Sequence from "../sequence"
// import PassageSequence from "../passageSequence"
// import TextList from "../text/list"
// import Text from "../text"
// import Word from "../word"
// import { OuterContainer } from "./components"

// import { User } from "../../models/user"

// interface Props {
//   user?: User
//   component: any
// }

// class Container extends React.Component<Props, any> {
//   public render() {
//     const { component, user } = this.props

//     return (
//       <OuterContainer>
//         <Nav user={user!} />
//         {
//           {
//             library: <Library />,
//             passages: <Passages />,
//             discover: <Discover />,
//             collections: <Collections user={user!} />,
//             textList: <TextList user={user!} />,
//             text: <Text user={user!} />,
//             passage: <Passage user={user!} />,
//             word: <Word />,
//             sequence: <Sequence />,
//             passageSequence: <PassageSequence />
//           }[component]
//         }
//       </OuterContainer>
//     )
//   }
// }

// export default Container
