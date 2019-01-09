import { Dope } from './dope.js'

const dope = new Dope()

const Nav = props => {
  const router = dope.router()

  const nav = dope.createElement('nav', {
    text: 'foo',
    style: { textDecoration: router.route === '/' ? 'underline' : 'none' },
    onClick: () => router.push('/foo')
  })

  return nav
}

export default Nav
