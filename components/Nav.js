const Nav = (dope, props) => {
  const router = dope.router()
  let H2 = null

  if (router.route === '/') {
    H2 = dope.make('h2', {
      text: 'fuhqu.com'
    })
  } else {
    const Link = dope.make('a', {
      text: 'fuhqu.com',
      onClick: () => router.push('/')
    })
    H2 = dope.make('h2', {
      children: [Link]
    })
  }

  return dope.make('nav', {
    children: [H2]
  })
}

export default Nav
