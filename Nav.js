import { Dope } from "./dope.js"

const dope = new Dope()

const Nav = props => {
  const router = dope.router()
  // if (router.route === "/") {
  //   dope.state = "underline"
  // } else {
  //   dope.state = "none"
  // }

  const nav = dope.createElement("nav", {
    text: "foo",
    style: { textDecoration: "underline" },
    onClick: () => router.push("/foo")
  })

  return nav
}

export default Nav
