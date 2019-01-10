import { Dope } from '../dope.js'

const dope = new Dope()

const PostDate = props =>
  dope.createElement('div', {
    text: props.date,
    style: {
      fontSize: '0.7em',
      lineHeight: '1.5em'
    }
  })

export default PostDate
