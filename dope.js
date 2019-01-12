/**
 * TODOS:
 * Accept null as a valid return from component
 * Accept lists of children to be returned from component
 */

export class Dope {
  constructor(state = null) {
    this._symbol = Symbol()
    this._state = state
    this._onMount = null
  }

  onMount(cb) {
    this._onMount = cb
  }

  createElement(element, props = {}) {
    // Check for children and convert to funcs accordingly.
    if (props.children) {
      props.children = props.children.map(child => {
        if (typeof child === 'function') {
          return child
        }
        // This element was instantiated inside a component rather ...
        // ...than being returned by it. Cannot be component's root.
        child.isComponentRoot = false
        return () => child
      })
    }

    return {
      element,
      props,
      isComponentRoot: true,
      symbol: this._symbol,
      onMount: this._onMount
    }
  }

  set state(newState) {
    this._state = {
      ...this._state,
      ...newState
    }
    this._dispatchUpdate()
  }

  get state() {
    return this._state
  }

  router() {
    return {
      route: window.location.pathname,
      push: pathname => {
        window.history.pushState({}, pathname, window.location.origin + pathname)
        this._dispatchRender()
      },
      redirect: pathname => {
        window.history.replaceState({}, pathname, window.location.origin + pathname)
        this._dispatchRender()
      }
    }
  }

  _dispatchRender() {
    const event = new CustomEvent('render')
    document.dispatchEvent(event)
  }

  _dispatchUpdate() {
    const event = new CustomEvent('update', {
      detail: {
        symbol: this._symbol
      }
    })

    document.dispatchEvent(event)
  }
}

export class DopeDOM {
  constructor(rootComponent, rootNode) {
    this._nodeMap = {}
    this._rootComponent = rootComponent
    this._rootNode = rootNode
    document.addEventListener('update', evt => this._update(evt.detail.symbol))
    document.addEventListener('render', () => this._render())
    window.onpopstate = () => this._render()
  }

  _createElement(component) {
    // Every component is just a function that returns either a node or null.
    const node = component()

    const el = document.createElement(node.element)

    if (node.props) {
      const { style, text, children, onClick, ...rest } = node.props

      if (style) {
        const properties = Object.keys(style)
        properties.forEach(property => (el.style[property] = style[property]))
      }

      if (text) {
        const textNode = document.createTextNode(text)
        el.appendChild(textNode)
      }

      if (children) {
        children.forEach(child => {
          const childNode = this._createElement(child)
          el.appendChild(childNode)
        })
      }

      if (onClick) {
        el.addEventListener('click', onClick)
      }

      if (rest) {
        const attributes = Object.keys(rest)
        attributes.forEach(attribute => (el[attribute] = rest[attribute]))
      }
    }

    // Only add the root node from each component to the map.
    // The root node is the immediate func(s) returned by each...
    // ... call to dope.createElement(...).
    if (node.isComponentRoot) {
      const hasSymbol = this._nodeMap[node.symbol]
      // Do not include onMount func if the symbol has...
      // ...already been registered to the node map.
      this._nodeMap[node.symbol] = {
        element: el,
        component,
        onMount: hasSymbol ? null : node.onMount
      }
    }

    return el
  }

  _invokeOnMount(symbol) {
    Object.getOwnPropertySymbols(this._nodeMap).forEach(symbol => {
      const { onMount } = this._nodeMap[symbol]
      if (onMount) {
        onMount()
      }
    })
  }

  _update(symbol) {
    const { element: oldChild, component } = this._nodeMap[symbol]
    const parentNode = oldChild.parentNode
    const newChild = this._createElement(component)
    parentNode.replaceChild(newChild, oldChild)
    this._invokeOnMount()
  }

  _render() {
    const newChild = this._createElement(this._rootComponent)
    const oldChild = this._rootNode.firstChild
    this._rootNode.replaceChild(newChild, oldChild)
    this._invokeOnMount()
  }

  render() {
    const renderedRoot = this._createElement(this._rootComponent)
    this._rootNode.appendChild(renderedRoot)
    this._invokeOnMount()
  }
}

export const withProps = (Component, props) => () => Component(props)
