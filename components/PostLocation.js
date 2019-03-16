export default function(dope, props) {
  return dope.make("div", {
    text: props.location,
    className: "PostLocation__container"
  })
}
