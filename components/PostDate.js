export default function(dope, props) {
  return dope.make("div", {
    text: props.date,
    className: "PostDate__container"
  })
}
