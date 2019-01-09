import { Dope, withProps } from "./dope.js"
import Nav from "./Nav.js"

const dope = new Dope({ posts: null })

fetch("./metadata.json")
  .then(response => {
    return response.json()
  })
  .then(data => {
    dope.state = { posts: data }
  })

const Root = () => {
  const navWithProps = withProps(Nav, { posts: dope.state.posts })

  return dope.createElement("div", {
    children: [navWithProps]
  })
}

export default Root
