// import * as React from "react"
// import styled from "styled-components"

// import Button from "../common/button"
// import Header from "../common/header"
// import Icon from "../common/icon"
// import Text from "../common/text"

// import deleteIconRed from "../../lib/images/icon-delete-red.png"
// import deleteIcon from "../../lib/images/icon-delete.png"

// import { addWord } from "../../models/word"

// import { colors } from "../../lib/colors"

// const Container = styled.div`
//   min-width: 240px;
//   min-height: 140px;
//   background-color: white;
//   border: 1px solid black;
//   bottom: 20px;
//   position: fixed;
//   margin: 0 auto;
//   left: 5%;
//   padding: 10px 10px 20px 10px;
//   box-sizing: border-box;
// `

// interface Props {
//   value: string
//   remove: () => void
// }

// interface State {
//   isEnriching?: string
//   alert?: string
//   isHoveringDelete?: boolean
// }

// class WordModal extends React.Component<Props, State> {
//   constructor(props: Props) {
//     super(props)

//     this.state = {}
//   }

//   public async addWord() {
//     const { value } = this.props
//     await addWord(value)
//     const alert = value + " added"
//     this.setState({ alert })
//     setTimeout(() => this.props.remove(), 1500)
//   }

//   public async enrichWord(value: string) {
//     // TODO: - disabled for now
//   }

//   public render() {
//     const { alert, isHoveringDelete } = this.state

//     return (
//       <Container>
//         <Header.s>{this.props.value}</Header.s>

//         <Icon
//           pointer={true}
//           topRight={true}
//           onMouseEnter={() => this.setState({ isHoveringDelete: true })}
//           onMouseLeave={() => this.setState({ isHoveringDelete: undefined })}
//           onClick={e => {
//             this.props.remove()
//           }}
//           src={isHoveringDelete ? deleteIconRed : deleteIcon}
//         />

//         {alert && <Text.l>{alert}</Text.l>}

//         {!alert && (
//           <div>
//             <Button.circ
//               onClick={this.addWord.bind(this)}
//               marginRight={"10px"}
//               color={colors.green}
//             >
//               add
//             </Button.circ>
//             <Button.circ disabled={true} color={colors.orange}>
//               enrich
//             </Button.circ>
//           </div>
//         )}
//       </Container>
//     )
//   }
// }

// export default WordModal
