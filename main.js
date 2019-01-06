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
       * Do not recognize route, so render home content.
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

  // get pinSvgElement() {
  //   const svg = document.createElement('svg')
  //   svg.setAttribute('width', 24)
  //   svg.setAttribute('height', 24)
  //   svg.setAttribute('fill-rule', 'evenodd')
  //   svg.setAttribute('clip-rule', 'evenodd')
  //   svg.setAttribute('height', 24)
  //   svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  //   const path = document.createElement('path')
  //   path.setAttribute(
  //     'd',
  //     'M12 10c-1.104 0-2-.896-2-2s.896-2 2-2 2 .896 2 2-.896 2-2 2m0-5c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3m-7 2.602c0-3.517 3.271-6.602 7-6.602s7 3.085 7 6.602c0 3.455-2.563 7.543-7 14.527-4.489-7.073-7-11.072-7-14.527m7-7.602c-4.198 0-8 3.403-8 7.602 0 4.198 3.469 9.21 8 16.398 4.531-7.188 8-12.2 8-16.398 0-4.199-3.801-7.602-8-7.602'
  //   )
  //   svg.appendChild(path)
  //   return svg
  // }

  addContainerElements() {
    // add header
    const header = document.createElement('header')
    header.id = 'header'
    this.rootNode.appendChild(header)
    // add content section
    const section = document.createElement('section')
    // add initial loading text
    section.innerHTML = '<p>Loading...</p>'
    section.id = 'section'
    this.rootNode.appendChild(section)
  }

  addShowdown() {
    return new Promise(resolve => {
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.async = true
      script.src = 'https://cdn.rawgit.com/showdownjs/showdown/1.9.0/dist/showdown.min.js'
      document.getElementsByTagName('head')[0].appendChild(script)
      script.onload = () => {
        this.converter = new showdown.Converter()
        resolve()
      }
    })
  }

  addDefaultHeaderElements() {
    // add page title
    const h2 = document.createElement('h2')
    const text2 = document.createTextNode('fuhqu')
    h2.appendChild(text2)
    this.headerNode.appendChild(h2)
    // add container where other read info will
    const headerContent = document.createElement('div')
    headerContent.id = 'header-content'
    header.appendChild(headerContent)
  }

  addHomePageHeaderElements() {
    // container div
    const div = document.createElement('div')
    div.style = 'display: flex; align-items: flex-start;'
    // image element
    const img = document.createElement('img')
    img.style = 'border-radius: 50%; max-width: 60px; margin: 26px 12px 0 0;'
    img.id = 'profile-picture'
    img.src = './portrait.jpg'
    div.appendChild(img)
    // big header
    const p = document.createElement('p')
    p.style = 'font-weight: 300;'
    const text1 = document.createTextNode(
      'Personal blog of Maximillian Einstein. This very special snowflake has something to say.'
    )
    p.appendChild(text1)
    div.appendChild(p)
    // clear previous content
    this.headerContentNode.innerHTML = ''
    // add new content
    this.headerContentNode.appendChild(div)
    // add horizontal line
    this.headerContentNode.appendChild(document.createElement('hr'))
  }

  addPostPageHeaderElements(slug) {
    const post = this.metadata.find(post => '/' + post.slug === slug)
    const h1 = document.createElement('h1')
    const text1 = document.createTextNode(post.title)
    h1.appendChild(text1)
    // add location
    const location = document.createElement('div')
    location.className = 'location'
    location.appendChild(document.createTextNode(post.location))
    // add estimated time
    const estimatedTime = document.createElement('div')
    estimatedTime.className = 'estimated-time'
    estimatedTime.appendChild(document.createTextNode(post.time + ' minutes'))
    // clear existing content
    this.headerContentNode.innerHTML = ''
    this.headerContentNode.appendChild(h1)
    this.headerContentNode.appendChild(location)
    this.headerContentNode.appendChild(estimatedTime)
    this.headerContentNode.appendChild(document.createElement('hr'))
  }

  async addContent() {
    // add default header
    this.addHomePageHeaderElements()
    // build up list of post elemets
    const posts = this.metadata.map(post => {
      // create container element
      const article = document.createElement('article')
      // add title
      const a = document.createElement('a')
      const h3 = document.createElement('h3')
      const title = document.createTextNode(post.title)
      h3.appendChild(title)
      a.appendChild(h3)
      a.addEventListener('click', () => this.onPostClick(`/${post.slug}`))
      article.appendChild(a)
      // add location
      const location = document.createElement('div')
      location.className = 'location'
      location.appendChild(document.createTextNode(post.location))
      article.appendChild(location)
      // add estimated time
      const estimatedTime = document.createElement('div')
      estimatedTime.className = 'estimated-time'
      estimatedTime.appendChild(document.createTextNode(post.time + ' minutes'))
      article.appendChild(estimatedTime)
      // add snippet
      const p = document.createElement('p')
      const snippet = document.createTextNode(post.snippet)
      p.appendChild(snippet)
      article.appendChild(p)
      // return article!
      return article
    })

    // clear loading state
    this.sectionNode.innerHTML = ''
    posts.forEach(post => this.sectionNode.appendChild(post))

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
