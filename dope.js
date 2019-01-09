export class Dope {
  constructor(state = null) {
    this._symbol = Symbol()
    this._state = state
  }

  createElement(element, props) {
    return {
      element,
      props,
      symbol: this._symbol
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
        this._dispatchUpdate()
      }
    }
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
    window.onpopstate = () => this._reRender()
  }

  _createElement(component) {
    const { element, symbol, props } = component()
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

    this._nodeMap[symbol] = { element: el, component }

    return el
  }

  _update(symbol) {
    const { element: oldChild, component } = this._nodeMap[symbol]
    Reflect.deleteProperty(this._nodeMap, symbol)
    const parentNode = oldChild.parentNode
    const newChild = this._createElement(component)
    parentNode.replaceChild(newChild, oldChild)
  }

  _reRender() {
    const newChild = this._createElement(this._rootComponent)
    const oldChild = this._rootNode.firstChild
    this._rootNode.replaceChild(newChild, oldChild)
  }

  render() {
    const renderedRoot = this._createElement(this._rootComponent)
    this._rootNode.appendChild(renderedRoot)
  }
}

export const withProps = (Component, props) => () => Component(props)
