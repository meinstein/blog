import Nav from './Nav.js'
import Header from './Header.js'
import PostList from './PostList.js'

const dope = new d0pe.Dope({ markdown: null })

const Post = props => {
  dope.onMount(async () => {
    const response = await fetch('../posts' + props.post.route + '.md')
    const markdown = await response.text()
    dope.state = { markdown }
  })

  if (!dope.state.markdown) {
    return dope.make('p', {
      text: 'Loading...'
    })
  }

  const converter = new showdown.Converter()

  return dope.make('p', {
    innerHTML: converter.makeHtml(dope.state.markdown)
  })
}

export default Post