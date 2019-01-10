import { Dope } from '../dope.js'

const dope = new Dope()

const PostLocation = props =>
  dope.createElement('div', {
    text: props.location,
    style: {
      fontSize: '0.9em',
      fontStyle: 'italic',
      lineHeight: '1.4em'
    }
  })

export default PostLocation
