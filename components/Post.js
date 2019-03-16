import Nav from "./Nav.js"
import Header from "./Header.js"
import PostList from "./PostList.js"

const Post = (dope, props) => {
  dope.initialState = { markdown: null }
  dope.onMount(async () => {
    const response = await fetch("../posts" + props.post.route + ".md")
    const markdown = await response.text()
    dope.state = { markdown }
  })

  const containerProps = {
    className: "Post__container"
  }

  if (!dope.state.markdown) {
    containerProps.text = "Loading..."
  } else {
    const converter = new showdown.Converter()
    containerProps.innerHTML = converter.makeHtml(dope.state.markdown)
  }

  return dope.make("div", containerProps)
}

export default Post
