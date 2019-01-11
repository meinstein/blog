import { Dope, withProps } from './dope.js'

import PostLocation from './components/PostLocation.js'
import PostDate from './components/PostDate.js'

const dope = new Dope()

const Header = props => {
  const children = []

  const Title = dope.createElement('h1', {
    text: props.post ? props.post.title : 'This very special snowflake has something to say.'
  })
  children.push(Title)

  if (props.post) {
    const PostLocationWithProps = withProps(PostLocation, { location: props.post.location })
    children.push(PostLocationWithProps)
    const PostDateWithProps = withProps(PostDate, { date: props.post.date })
    children.push(PostDateWithProps)
  }

  const HorizontalLine = dope.createElement('hr')
  children.push(HorizontalLine)

  return dope.createElement('header', { children })
}

export default Header
