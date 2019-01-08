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
    this._state = newState
    this._dispatchUpdate()
  }

  get state() {
    return this._state
  }

  _dispatchUpdate() {
    const event = new CustomEvent("update", {
      detail: {
        symbol: this._symbol
      }
    })

    document.dispatchEvent(event)
  }
}

export class DopeDOM {
  constructor() {
    this.nodeMap = {}
    document.addEventListener("update", evt => {
      this._update(evt.detail.symbol)
    })
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
      el.addEventListener("click", onClick)
    }

    if (children) {
      children.forEach(child => {
        el.appendChild(this._createElement(child))
      })
    }

    this.nodeMap[symbol] = {
      element: el,
      component
    }

    return el
  }

  _update(symbol) {
    const { element, component } = this.nodeMap[symbol]
    Reflect.deleteProperty(this.nodeMap, symbol)
    const parentNode = element.parentNode
    element.remove()
    const updatedNode = this._createElement(component)
    parentNode.appendChild(updatedNode)
  }

  render(Root, rootNodeId) {
    const rootElement = document.getElementById(rootNodeId)
    const renderedRoot = this._createElement(Root)
    rootElement.appendChild(renderedRoot)
  }
}
