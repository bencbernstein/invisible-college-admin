import FlexedDiv from "./flexedDiv";

interface Props {
  position?: string
}
export default FlexedDiv.extend`
  padding: 20px 0px 15px 0px;
  justify-content: center;
  background-color: white;
  position: ${(p: Props) => (p.position ? "sticky" : "fixed")};
  width: 100%;
  opacity: 0.95;
  left: 0;
  bottom: 0;
`