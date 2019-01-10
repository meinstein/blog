import { Dope, withProps } from './dope.js'

import PostLocation from './components/PostLocation.js'
import PostDate from './components/PostDate.js'

const dope = new Dope()

const PostList = props => {
  // grab router
  const router = dope.router()
  // list of posts to render
  const posts = props.posts.map(post => {
    // post title
    const PostTitle = dope.createElement('h3', {
      text: post.title,
      onClick: () => router.push(`/${post.slug}`)
    })
    // pass location prop to PostLocation
    const PostLocationWithProps = withProps(PostLocation, { location: post.location })
    // pass date prop to PostDate
    const PostDateWithProps = withProps(PostDate, { date: post.date })
    // create snippet
    const Snippet = dope.createElement('p', { text: post.snippet })
    // the container for each post
    return dope.createElement('div', {
      children: [PostTitle, PostLocationWithProps, PostDateWithProps, Snippet]
    })
  })

  return dope.createElement('section', {
    children: posts
  })
}

export default PostList
