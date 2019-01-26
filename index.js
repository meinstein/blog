import DomDope from 'https://unpkg.com/domdope/src/index.js'
import Root from './components/Root.js'

const rootElement = document.getElementById('root')
const dope = new DomDope(Root, rootElement)
dope.render()
