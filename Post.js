import { Dope, withProps } from './dope.js'

import Nav from './Nav.js'
import Header from './Header.js'
import PostList from './PostList.js'

const dope = new Dope({ markdown: null })

const Post = props => {
  dope.onMount(() => {
    console.log('called')
    fetch('./posts' + props.post.route + '.md')
      .then(response => response.text())
      .then(markdown => (dope.state = { markdown }))
  })

  if (!dope.state.markdown) {
    const Loader = dope.createElement('p', {
      text: 'Loading...'
    })
    return Loader
  }

  const converter = new showdown.Converter()
  console.log(dope.state.markdown)
  // console.log(converter.makeHtml(dope.state.markdown))

  return dope.createElement('div', {
    text: 'markdown'
  })
}

export default Post
