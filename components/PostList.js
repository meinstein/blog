import { withRouter, withProps } from "https://unpkg.com/domdope"

import PostLocation from "./PostLocation.js"
import PostDate from "./PostDate.js"

const PostList = (dope, props) => {
  // list of posts to render
  const posts = props.posts.map(post => {
    // create link
    const Link = dope.make("a", {
      text: post.title
    })
    // post title
    const PostTitle = dope.make("h3", {
      children: [Link],
      onClick: () => props.router.goTo(post.route)
    })
    // pass location prop to PostLocation
    const PostLocationWithProps = withProps(PostLocation, { location: post.location })
    // pass date prop to PostDate
    const PostDateWithProps = withProps(PostDate, { date: post.date })
    // create snippet
    const Snippet = dope.make("p", { text: post.snippet })
    // the container for each post
    return dope.make("div", {
      children: [PostTitle, PostLocationWithProps, PostDateWithProps, Snippet]
    })
  })

  return dope.make("section", {
    className: "PostList__container",
    children: posts
  })
}

export default withRouter(PostList)
