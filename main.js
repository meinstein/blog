class App {
  constructor() {
    this.converter = null
    this.metadata = null
  }

  async init() {
    this.addContainerElements()
    this.addHeaderElements()
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

  get sectionNode() {
    return document.getElementById('section')
  }

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

  addHeaderElements() {
    // light header
    const h2 = document.createElement('h2')
    const text2 = document.createTextNode('fuhqu')
    h2.appendChild(text2)
    this.headerNode.appendChild(h2)
    // big header
    const h1 = document.createElement('h1')
    const text1 = document.createTextNode('This very special snowflake has something to say.')
    h1.appendChild(text1)
    this.headerNode.appendChild(h1)
    // add horizontal line
    const hr = document.createElement('hr')
    this.headerNode.appendChild(hr)
  }

  async addContent() {
    // build up list of post elemets
    const posts = this.metadata.map(post => {
      const article = document.createElement('article')
      const a = document.createElement('a')
      const h3 = document.createElement('h3')
      const title = document.createTextNode(post.title)
      h3.appendChild(title)
      a.appendChild(h3)
      a.addEventListener('click', () => this.onPostClick(`/${post.slug}`))
      article.appendChild(a)
      const p = document.createElement('p')
      const snippet = document.createTextNode(post.snippet)
      p.appendChild(snippet)
      article.appendChild(p)
      return article
    })

    // clear loading state
    this.sectionNode.innerHTML = ''
    posts.forEach(post => this.sectionNode.appendChild(post))

    this.rootNode.appendChild(section)
  }

  async addPost(slug) {
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
