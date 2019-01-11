import { Dope, withProps } from './dope.js'

import Nav from './Nav.js'
import Header from './Header.js'
import PostList from './PostList.js'
import Post from './Post.js'

const dope = new Dope({ posts: null, post: null })

fetch('./metadata.json')
  .then(response => {
    return response.json()
  })
  .then(data => {
    dope.state = { posts: data }
  })

const Root = () => {
  const router = dope.router()

  if (!dope.state.posts) {
    return dope.createElement('h2', { text: 'Loading...' })
  }

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
