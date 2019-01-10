class App {
  constructor() {
    this.converter = null
    this.metadata = null
    this.routes = []
  }

  async init() {
    this.addContainerElements()
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

  addContainerElements() {
    const nav = dope.createElement('nav', { id: 'nav' })
    const header = dope.createElement('header', { id: 'header' })
    const section = dope.createElement('section', { id: 'section' })
    dope.getElement({ id: 'root' }).addChildren([nav, header, section])
  }

  addShowdown() {
    return new Promise(resolve => {
      const script = dope.createElement('script', {
        type: 'text/javascript',
        // async: false,
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

  addHomePageHeaderElements() {
    const fuhqu = dope.createElement('h2', { text: 'fuhqu.com' })
    dope.getElement({ id: 'nav' }).setChildren([fuhqu])

    const about = dope.createElement('h1', { text: 'This very special snowflake has something to say.' })
    const hr = dope.createElement('hr')
    dope.getElement({ id: 'header' }).setChildren([about, hr])
  }

  addPostPageHeaderElements(slug) {
    const post = this.metadata.find(post => '/' + post.slug === slug)

    const fuhqu = dope.createElement('h2', { text: 'fuhqu.com', onClick: () => this.onPostClick(`/`) })
    const link = dope.createElement('a', { children: [fuhqu] })
    dope.getElement({ id: 'nav' }).setChildren([link])

    const title = dope.createElement('h1', { text: post.title })
    const location = dope.createElement('div', {
      text: post.location,
      style: {
        fontSize: '0.9em',
        fontStyle: 'italic',
        lineHeight: '1.4em'
      }
    })
    const date = dope.createElement('div', {
      text: post.date,
      style: {
        fontSize: '0.7em',
        lineHeight: '1.5em'
      }
    })
    const hr = dope.createElement('hr')
    dope.getElement({ id: 'header' }).setChildren([title, location, date, hr])
  }

  async addContent() {
    this.addHomePageHeaderElements()

    const posts = this.metadata.map(post => {
      const title = dope.createElement('h3', {
        text: post.title,
        onClick: () => this.onPostClick(`/${post.slug}`)
      })
      const link = dope.createElement('a', { children: [title] })
      const location = dope.createElement('div', {
        text: post.location,
        style: {
          fontSize: '0.9em',
          fontStyle: 'italic',
          lineHeight: '1.4em'
        }
      })
      const date = dope.createElement('div', {
        text: post.date,
        style: {
          fontSize: '0.7em',
          lineHeight: '1.5em'
        }
      })
      const snippet = dope.createElement('p', { text: post.snippet })
      const article = dope.createElement('article', { children: [link, location, date, snippet] })

      return article
    })

    dope.getElement({ id: 'section' }).setChildren(posts)
  }

  async addPost(slug) {
    this.addPostPageHeaderElements(slug)
    // get post data
    const post = await fetch(`./posts/${slug}.md`)
    const parsedPost = await post.text()
    const html = this.converter.makeHtml(parsedPost)
    dope.getElement({ id: 'section' }).innerHTML = html
  }

  onPostClick(slug) {
    window.history.pushState({}, slug, window.location.origin + slug)
    this.router()
  }
}

// document.addEventListener("DOMContentLoaded", () => {
//   const app = new App()
//   app.init()
// })
