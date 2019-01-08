import { Dope } from "./dope.js"

const dope = new Dope()

const Nav = props => {
  const nav = dope.createElement("nav", {
    style: { background: "red", width: "300px", height: "50px" }
  })

  return nav
}

export default Nav
