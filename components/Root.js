import { withRouter, withProps } from "https://unpkg.com/domdope"

import posts from "../metadata.js"
import Nav from "./Nav.js"
import Header from "./Header.js"
import PostList from "./PostList.js"
import Post from "./Post.js"
import Footer from "./Footer.js"

const Root = (dope, props) => {
  const post = posts.find(post => post.route === props.router.pathname)

  if (!post && props.router.pathname !== "/") {
    return props.router.redirectTo("/")
  }

  const NavWithProps = withProps(Nav, { post })
  const HeaderWithProps = withProps(Header, { post })
  const PostListWithProps = withProps(PostList, { posts })
  const PostWithProps = withProps(Post, { post })

  return dope.make("div", {
    className: "Root__container",
    children: [NavWithProps, HeaderWithProps, post ? PostWithProps : PostListWithProps, Footer]
  })
}

export default withRouter(Root)
