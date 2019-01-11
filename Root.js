import { Dope, withProps } from "./dope.js"

import Nav from "./Nav.js"
import Header from "./Header.js"
import PostList from "./PostList.js"

const dope = new Dope({ posts: null })

fetch("./metadata.json")
  .then(response => {
    return response.json()
  })
  .then(data => {
    dope.state = { posts: data }
  })

const Root = () => {
  const router = dope.router()

  const Loader = dope.createElement("h2", {
    text: "Loading..."
  })

  if (!dope.state.posts) {
    return Loader
  }

  if (router.route !== "/") {
    const isValidRoute = dope.state.posts.find(post => post.route === router.route)
    if (!isValidRoute) {
      return router.redirect("/")
    }
  }

  const NavWithProps = withProps(Nav, { posts: dope.state.posts })
  const HeaderWithProps = withProps(Header, { posts: dope.state.posts })
  const PostListWithProps = withProps(PostList, { posts: dope.state.posts })

  return dope.createElement("div", {
    children: [NavWithProps, HeaderWithProps, PostListWithProps]
  })
}

export default Root
