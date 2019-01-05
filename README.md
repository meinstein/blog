# Blog

## Motivation

A simple blog with none of the over-engineered bells and whistles of typical JS frameworks. Vanilla JS. No extra transpilation step.

## Local Dev

Spin the dev server:

```
node devServer.js
```

And navigate to: `localhost:9000`

## Adding Posts

Adding a post is a two-step process:

1. Add a `.md` file with the post content
2. Update the `metadata.json` file at the root of the project with the relevant details.

## Publishing

Netlify deploys and hosts this blog. All pushes to master are synced with deployments.

```
git push origin master
```

There is a mandatory `_redirects` files at the root of this project in order to allow for client-side routing.
