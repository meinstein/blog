import { Dope, DopeDOM } from "./dope.js"

const dope1 = new Dope({ title: "navContent" })
const NavContent = () => {
  return dope1.createElement("div", {
    text: dope1.state.title,
    onClick: () => (dope1.state = { title: "bar" }),
    style: {
      color: "white"
    }
  })
}

const dope2 = new Dope()
const Nav = () => {
  return dope2.createElement("nav", {
    children: [NavContent],
    style: {
      background: "red",
      width: "300px",
      height: "50px"
    }
  })
}

const dope3 = new Dope()
const Root = () => {
  return dope3.createElement("div", {
    children: [Nav],
    style: {
      background: "black",
      width: "300px",
      height: "300px"
    }
  })
}

const dopeDOM = new DopeDOM()
dopeDOM.render(Root, "root")
