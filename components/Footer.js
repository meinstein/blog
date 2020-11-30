export default function(dope) {
  const CreatedBy = dope.make("span", {
    text: "Created by "
  })
  const BioLink = dope.make("a", {
    href: "https://meinstein.netlify.app",
    text: "meinstein"
  })

  return dope.make("footer", {
    children: [CreatedBy, BioLink]
  })
}
