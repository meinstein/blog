# Blog

## Motivation

Yet another blog. Few bells and whistles. Built with [`domdope`](https://github.com/meinstein/domdope).

## Local Dev

Start the dev server:

```
node dev.js
```

And navigate to: `localhost:9000`

## Adding Posts

Adding a post is a two-step process:

1. Add a `.md` file to the `posts` dir with the post content
2. Update the `metadata.js` file at the root of this project containing the relevant metadata. Note: The `route` must match the file name (without .md extension).

## Publishing

Netlify deploys and hosts this blog. All pushes to master are synced with deployments.

```
git push origin master
```

There is a mandatory `_redirects` files at the root of this project in order to allow for client-side routing.
