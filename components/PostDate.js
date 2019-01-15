const dope = new d0pe.Dope()

const PostDate = props =>
  dope.make('div', {
    text: props.date,
    style: {
      fontSize: '0.7em',
      lineHeight: '1.5em'
    }
  })

export default PostDate
