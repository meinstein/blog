import { Dope, withProps } from './dope.js'

import Nav from './Nav.js'
import Header from './Header.js'

const dope = new Dope({ posts: null })

fetch('./metadata.json')
  .then(response => {
    return response.json()
  })
  .then(data => {
    dope.state = { posts: data }
  })

const Root = () => {
  const Loader = dope.createElement('div', {
    text: 'Loading...'
  })

  const NavWithProps = withProps(Nav, { posts: dope.state.posts })
  const HeaderWithProps = withProps(Header, { posts: dope.state.posts })

  return dope.createElement('div', {
    children: dope.state.posts ? [NavWithProps, HeaderWithProps] : [Loader]
  })
}

export default Root
