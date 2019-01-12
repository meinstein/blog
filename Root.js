import { Dope, withProps } from './dope.js'

import Nav from './Nav.js'
import Header from './Header.js'
import PostList from './PostList.js'
import Post from './Post.js'

const dope = new Dope({
  posts: null,
  post: null
})

const Root = () => {
  dope.onMount(async () => {
    const response = await fetch('./metadata.json')
    const posts = await response.json()
    dope.state = { posts: posts }
  })

  if (!dope.state.posts) {
    return dope.createElement('div', {
      children: [Nav]
    })
  }

  const router = dope.router()
  const post = dope.state.posts.find(post => post.route === router.route)

  if (!post && router.route !== '/') {
    return router.redirect('/')
  }

  const NavWithProps = withProps(Nav, { post })
  const HeaderWithProps = withProps(Header, { post })
  const PostListWithProps = withProps(PostList, { posts: dope.state.posts })
  const PostWithProps = withProps(Post, { post })

  return dope.createElement('div', {
    children: [NavWithProps, HeaderWithProps, post ? PostWithProps : PostListWithProps]
  })
}

export default Root
