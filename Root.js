import { Dope } from "./dope.js"
import Nav from "./Nav.js"

const dope = new Dope()

fetch("./metadata.json")
  .then(response => {
    return response.json()
  })
  .then(data => {
    dope.state = data
  })

const Root = () => {
  return dope.createElement("div", {
    children: [Nav],
    text: dope.state && JSON.stringify(dope.state),
    style: { background: "black", width: "300px", height: "300px" }
  })
}

export default Root
