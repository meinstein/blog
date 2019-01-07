class Dope {
  _appendChildren(el, newChildren) {
    newChildren.forEach(child => el.appendChild(child))
  }

  _applyMethods(el) {
    el.setChildren = newChildren => {
      el.innerHTML = ''
      this._appendChildren(el, newChildren)
    }

    el.addChildren = newChildren => this._appendChildren(el, newChildren)

    return el
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

    return this._applyMethods(el)
  }

  grab(props) {
    const { id, className } = props
    if (id) {
      const el = document.getElementById(id)
      return this._applyMethods(el)
    }
  }
}

export default Dope
