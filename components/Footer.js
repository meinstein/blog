export default function(dope) {
  const Text = dope.make("span", {
    text: "Built with "
  })
  const Link = dope.make("a", {
    href: "https://github.com/meinstein/domdope",
    text: "DomDope"
  })

  return dope.make("footer", {
    children: [Text, Link]
  })
}
