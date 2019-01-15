const dope = new d0pe.Dope()

const PostLocation = props =>
  dope.make('div', {
    text: props.location,
    style: {
      fontSize: '0.9em',
      fontStyle: 'italic',
      lineHeight: '1.4em'
    }
  })

export default PostLocation
