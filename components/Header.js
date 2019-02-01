import { withProps } from 'https://unpkg.com/domdope'

import PostLocation from './PostLocation.js'
import PostDate from './PostDate.js'

const Header = (dope, props) => {
  const children = []

  const Title = dope.make('h1', {
    text: props.post ? props.post.title : 'This very special snowflake has something to say.'
  })
  children.push(Title)

  if (props.post) {
    const PostLocationWithProps = withProps(PostLocation, { location: props.post.location })
    children.push(PostLocationWithProps)
    const PostDateWithProps = withProps(PostDate, { date: props.post.date })
    children.push(PostDateWithProps)
  }

  const HorizontalLine = dope.make('hr')
  children.push(HorizontalLine)

  return dope.make('header', { children })
}

export default Header
