import posts from '../metadata.js'
import Nav from './Nav.js'
import Header from './Header.js'
import PostList from './PostList.js'
import Post from './Post.js'

const dope = new d0pe.Dope()

const Root = () => {
  const router = dope.router()
  const post = posts.find(post => post.route === router.route)

  if (!post && router.route !== '/') {
    return router.redirect('/')
  }

  const NavWithProps = dope.inject(Nav, { post })
  const HeaderWithProps = dope.inject(Header, { post })
  const PostListWithProps = dope.inject(PostList, { posts })
  const PostWithProps = dope.inject(Post, { post })

  return dope.make('div', {
    children: [NavWithProps, HeaderWithProps, post ? PostWithProps : PostListWithProps]
  })
}

export default Root
