# Blog

## Motivation

A simple blog with none of the over-engineered bells and whistles of typical JS frameworks. Vanilla JS. No extra transpilation step.

## Local Dev

Spin up a simple http server so fetching works:
```
python -m SimpleHTTPServer
```
And navigate to: `localhost:8000`

## Adding Posts

Adding a post is a two-step process:

1. Add a `.md` file with the post content
2. Update the `metadata.json` file at the root of the project with the relevant details.

## Publishing Updates

```
git push origin master
```
