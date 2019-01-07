import Dope from './dope.js'
class App extends Dope {
  constructor() {
    super()
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

  addContainerElements() {
    const header = this.create({ element: 'header', id: 'header' })
    const section = this.create({ element: 'section', id: 'section' })
    this.grab({ id: 'root' }).addChildren([header, section])
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
    const websiteTitle = this.create({ element: 'h2', text: 'fuhqu.com' })
    const link = this.create({ element: 'a', href: 'https://www.fuhqu.com', children: [websiteTitle] })
    const headerContent = this.create({ element: 'div', id: 'header-content' })
    this.grab({ id: 'header' }).setChildren([link, headerContent])
  }

  addHomePageHeaderElements() {
    // const picture = this.create({
    //   element: 'img',
    //   style: {
    //     borderRadius: '50%',
    //     maxWidth: '60px',
    //     minWidth: '60px',
    //     margin: '6px 12px 0 0',
    //     float: 'left'
    //   },
    //   src: './portrait.jpg'
    // })
    const about = this.create({
      element: 'h1',
      // style: {
      // float: 'left'
      // fontWeight: 300
      // },
      text: 'Personal blog of Maximillian Einstein. This very special snowflake has something to say.'
    })
    // const container = this.create({
    //   element: 'div',
    //   children: [picture, about]
    // })
    // horizontal line
    const hr = this.create({ element: 'hr' })
    // clear previous content
    this.grab({ id: 'header-content' }).setChildren([about, hr])
  }

  addPostPageHeaderElements(slug) {
    const post = this.metadata.find(post => '/' + post.slug === slug)
    const title = this.create({
      element: 'h1',
      text: post.title
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
    const estimatedTime = this.create({
      element: 'div',
      text: `${post.time} minutes`,
      style: {
        fontSize: '0.65em',
        lineHeight: '1.5em'
      }
    })
    const hr = this.create({
      element: 'hr'
    })
    this.grab({ id: 'header-content' }).setChildren([title, location, estimatedTime, hr])
  }

  async addContent() {
    this.addHomePageHeaderElements()

    const posts = this.metadata.map(post => {
      const title = this.create({
        element: 'h3',
        text: post.title,
        onClick: () => this.onPostClick(`/${post.slug}`)
      })
      const link = this.create({
        element: 'a',
        children: [title]
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
        children: [link, location, estimatedTime, snippet]
      })

      return article
    })

    this.grab({ id: 'section' }).setChildren(posts)
  }

  async addPost(slug) {
    this.addPostPageHeaderElements(slug)
    // get post data
    const post = await fetch(`./posts/${slug}.md`)
    const parsedPost = await post.text()
    const html = this.converter.makeHtml(parsedPost)
    this.grab({ id: 'section' }).innerHTML = html
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
