import PostLocation from './PostLocation.js'
import PostDate from './PostDate.js'

const PostList = (dope, props) => {
  // grab router
  const router = dope.router()
  // list of posts to render
  const posts = props.posts.map(post => {
    // create link
    const Link = dope.make('a', {
      text: post.title
    })
    // post title
    const PostTitle = dope.make('h3', {
      children: [Link],
      onClick: () => router.push(post.route)
    })
    // pass location prop to PostLocation
    const PostLocationWithProps = dope.inject(PostLocation, { location: post.location })
    // pass date prop to PostDate
    const PostDateWithProps = dope.inject(PostDate, { date: post.date })
    // create snippet
    const Snippet = dope.make('p', { text: post.snippet })
    // the container for each post
    return dope.make('div', {
      children: [PostTitle, PostLocationWithProps, PostDateWithProps, Snippet]
    })
  })

  return dope.make('section', {
    children: posts
  })
}

export default PostList
