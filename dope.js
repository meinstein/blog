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
    const { children } = props
    if (children) {
      const updatedChildren = children.map(child => {
        if (typeof child === 'function') {
          return child
        }

        child.isRootNode = false
        return () => child
      })

      props.children = updatedChildren
    }

    return {
      element,
      props,
      isRootNode: true,
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
    const componentDetails = component()
    const { element, props, symbol, onMount, isRootNode } = componentDetails
    const { style, text, children, onClick, ...rest } = props

    const el = document.createElement(element)

    if (style) {
      const properties = Object.keys(style)
      properties.forEach(property => (el.style[property] = style[property]))
    }

    if (rest) {
      const attributes = Object.keys(rest)
      attributes.forEach(attribute => (el[attribute] = rest[attribute]))
    }

    if (text) {
      const textNode = document.createTextNode(text)
      el.appendChild(textNode)
    }

    if (onClick) {
      el.addEventListener('click', onClick)
    }

    if (children) {
      children.forEach(child => {
        el.appendChild(this._createElement(child))
      })
    }

    // only add the root node from each component to the map
    if (isRootNode) {
      const hasSymbol = this._nodeMap[symbol]
      // do not include onMount func if this symbol has already been added to the map prior
      this._nodeMap[symbol] = { element: el, component, onMount: hasSymbol ? null : onMount }
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
