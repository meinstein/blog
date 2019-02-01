import { withRouter } from 'https://unpkg.com/domdope'

const Nav = (dope, props) => {
  let H2 = null

  if (props.router.location === '/') {
    H2 = dope.make('h2', {
      text: 'fuhqu.com'
    })
  } else {
    const Link = dope.make('a', {
      text: 'fuhqu.com',
      onClick: () => props.router.goTo('/')
    })
    H2 = dope.make('h2', {
      children: [Link]
    })
  }

  return dope.make('nav', {
    children: [H2]
  })
}

export default withRouter(Nav)
