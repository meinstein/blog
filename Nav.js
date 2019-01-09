import { Dope } from './dope.js'

const dope = new Dope()

const Nav = props => {
  const router = dope.router()

  const h2 = dope.createElement('h2', {
    text: 'fuhqu.com',
    style: {
      color: router.route === '/' ? 'black' : 'red',
      textDecoration: router.route === '/' ? 'none' : 'underline'
    }
  })

  return dope.createElement('nav', {
    children: [h2]
  })
}

export default Nav
