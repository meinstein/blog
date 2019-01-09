import { Dope } from './dope.js'

const dope = new Dope()

const Header = props => {
  const router = dope.router()

  const h1 = dope.createElement('h1', {
    text: router.route === '/' ? 'This very special snowflake has something to say.' : 'foo'
  })

  return dope.createElement('header', {
    children: [h1]
  })
}

export default Header
