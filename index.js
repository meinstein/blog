import { DopeDOM } from './dope.js'
import Root from './Root.js'

const rootElement = document.getElementById('root')
const dopeDOM = new DopeDOM(Root, rootElement)
dopeDOM.render()
