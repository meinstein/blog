class App {
  constructor() {
    this.converter = null
    this.metadata = null
    this.routes = []
  }

  async init() {
    this.addContainerElements()
    this.addDefaultHeaderElements()
    this.addListeners()
  }

  async addListeners() {
    /**
     * Fetch metdata in order to verify routes
     */
    const metadata = await fetch('./metadata.json')
    this.metadata = await metadata.json()
    /**
     * Add slash in order to reliably match against location.pathname
     */
    this.routes = this.metadata.map(post => '/' + post.slug)
    /**
     * Add the showdown dep before rendering routes
     */
    await this.addShowdown()
    /**
     * Add routing logic into the mix
     */
    this.router()
    /**
     * Check the landing path first
     */
    window.onpopstate = () => this.router()
  }

  router() {
    /**
     * Landed at root. No need to validate. Render home content.
     */
    if (location.pathname === '/') {
      this.addContent()
      /**
       * Recognize route so render the post.
       */
    } else if (this.routes.includes(location.pathname)) {
      this.addPost(location.pathname)
      /**
       * Do not recognize provided route, so render home content.
       */
    } else {
      window.history.pushState({}, '/', window.location.origin)
      this.addContent()
    }
  }

  get rootNode() {
    return document.getElementById('root')
  }

  get headerNode() {
    return document.getElementById('header')
  }

  get headerContentNode() {
    return document.getElementById('header-content')
  }

  get sectionNode() {
    return document.getElementById('section')
  }

  create(props) {
    const { element, style, text, children, onClick, ...rest } = props
    if (!props.element) {
      throw new Error('Must include node!')
    }

    // the master element that will get returned
    const el = document.createElement(element)

    if (style) {
      const properties = Object.keys(style)
      properties.forEach(property => (el.style[property] = style[property]))
    }

    // apply rest of attributes!
    if (rest) {
      const attributes = Object.keys(rest)
      attributes.forEach(attribute => (el[attribute] = rest[attribute]))
    }

    if (text) {
      const textNode = document.createTextNode(text)
      el.appendChild(textNode)
    }

    if (children) {
      // TODO: check that it's a list and make sure each element is a valid dom node!
      children.forEach(child => el.appendChild(child))
    }

    if (onClick) {
      el.addEventListener('click', onClick)
    }

    // add setter for new children
    el.setChildren = newChildren => {
      // clear existing children
      el.innerHTML = ''
      // TODO: check that it's a list and make sure each element is a valid dom node!
      newChildren.forEach(child => el.appendChild(child))
    }

    // add setter for new children
    el.addChildren = newChildren => {
      // TODO: check that it's a list and make sure each element is a valid dom node!
      newChildren.forEach(child => el.appendChild(child))
    }

    return el
  }

  createText(text) {
    return document.createTextNode(text)
  }

  // get pinSvgElement() {
  //   const svg = this.create({element: 'svg'})
  //   svg.setAttribute('width', 24)
  //   svg.setAttribute('height', 24)
  //   svg.setAttribute('fill-rule', 'evenodd')
  //   svg.setAttribute('clip-rule', 'evenodd')
  //   svg.setAttribute('height', 24)
  //   svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  //   const path = this.create({element: 'path'})
  //   path.setAttribute(
  //     'd',
  //     'M12 10c-1.104 0-2-.896-2-2s.896-2 2-2 2 .896 2 2-.896 2-2 2m0-5c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3m-7 2.602c0-3.517 3.271-6.602 7-6.602s7 3.085 7 6.602c0 3.455-2.563 7.543-7 14.527-4.489-7.073-7-11.072-7-14.527m7-7.602c-4.198 0-8 3.403-8 7.602 0 4.198 3.469 9.21 8 16.398 4.531-7.188 8-12.2 8-16.398 0-4.199-3.801-7.602-8-7.602'
  //   )
  //   svg.appendChild(path)
  //   return svg
  // }

  addContainerElements() {
    const header = this.create({
      element: 'header',
      id: 'header'
    })
    const section = this.create({
      element: 'section',
      id: 'section'
    })
    this.rootNode.appendChild(header)
    this.rootNode.appendChild(section)
  }

  addShowdown() {
    return new Promise(resolve => {
      const script = this.create({
        element: 'script',
        type: 'text/javascript',
        async: true,
        src: 'https://cdn.rawgit.com/showdownjs/showdown/1.9.0/dist/showdown.min.js',
        onload: () => {
          this.converter = new showdown.Converter()
          resolve()
        }
      })
      // add to document head
      document.getElementsByTagName('head')[0].appendChild(script)
    })
  }

  addDefaultHeaderElements() {
    // add page title
    const websiteTitle = this.create({
      element: 'h2',
      text: 'fuhqu.com'
    })
    const headerContent = this.create({
      element: 'div',
      id: 'header-content'
    })
    this.headerNode.appendChild(websiteTitle)
    this.headerNode.appendChild(headerContent)
  }

  addHomePageHeaderElements() {
    const picture = this.create({
      element: 'img',
      style: { borderRadius: '50%', maxWidth: '60px', margin: '26px 12px 0 0' },
      src: './portrait.jpg'
    })
    const about = this.create({
      element: 'p',
      style: { fontWeight: 300 },
      text: 'Personal blog of Maximillian Einstein. This very special snowflake has something to say.'
    })
    const container = this.create({
      element: 'div',
      style: { display: 'flex', alignItems: 'flex-start' },
      children: [picture, about]
    })
    // horizontal line
    const hr = this.create({ element: 'hr' })
    // clear previous content
    this.headerNode.addChildren([container, hr])
  }

  addPostPageHeaderElements(slug) {
    const post = this.metadata.find(post => '/' + post.slug === slug)
    const h1 = this.create({ element: 'h1' })
    const text1 = this.createText(post.title)
    h1.appendChild(text1)
    // add location
    const location = this.create({ element: 'div' })
    location.className = 'location'
    location.appendChild(this.createText(post.location))
    // add estimated time
    const estimatedTime = this.create({ element: 'div' })
    estimatedTime.className = 'estimated-time'
    estimatedTime.appendChild(this.createText(post.time + ' minutes'))
    // clear existing content
    this.headerContentNode.innerHTML = ''
    this.headerContentNode.appendChild(h1)
    this.headerContentNode.appendChild(location)
    this.headerContentNode.appendChild(estimatedTime)
    this.headerContentNode.appendChild(this.create({ element: 'hr' }))
  }

  async addContent() {
    // add default header
    this.addHomePageHeaderElements()
    // build up list of post elemets
    const posts = this.metadata.map(post => {
      const title = this.create({
        element: 'h3',
        text: post.title,
        onClick: () => this.onPostClick(`/${post.slug}`),
        style: {
          color: 'indianred',
          pointer: 'cursor'
        }
      })
      const location = this.create({
        element: 'div',
        text: post.location,
        style: {
          fontSize: '0.9em',
          fontStyle: 'italic',
          lineHeight: '1.4em'
        }
      })
      // add estimated time
      const estimatedTime = this.create({
        element: 'div',
        text: `${post.time} minutes`,
        style: {
          fontSize: '0.65em',
          lineHeight: '1.5em'
        }
      })
      // add snippet
      const snippet = this.create({
        element: 'p',
        text: post.snippet
      })
      // create container element
      const article = this.create({
        element: 'article',
        children: [title, location, estimatedTime, snippet]
      })

      return article
    })
    // add children to section node
    this.sectionNode.setChildren(posts)
    // add section to root node
    this.rootNode.appendChild(section)
  }

  async addPost(slug) {
    this.addPostPageHeaderElements(slug)
    // get post data
    const post = await fetch(`./posts/${slug}.md`)
    const parsedPost = await post.text()
    const html = this.converter.makeHtml(parsedPost)
    this.sectionNode.innerHTML = html
  }

  onPostClick(slug) {
    window.history.pushState({}, slug, window.location.origin + slug)
    this.addPost(slug)
  }
}

document.addEventListener('DOMContentLoaded', () => {
  /**
   * Ensure that the user is displayed the right content when
   * they navigate back in their browsing history.
   * To do this, override the window’s onpopstate function,
   * which is called whenever the user navigates back in history.
   */
  const app = new App()
  app.init()
})
