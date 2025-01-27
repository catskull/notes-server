# notes

I can share a URL via apple "share sheet" to my shortcut which sends a `POST` to a cloudflare worker which then prepends some YAML to a file in my blog's github repo and commits it, which in turn deploys the site.

In other words, it's tweets the hard way.

## Setup

(untested)

Two secrets are needed:
 - `TOKEN` - a github token that has write access to your repo
 - `KEY` - some random secret to authenticate your shortcut to your server. I [generate a GUID](https://www.guidgenerator.com) and use that.

Steps:
 - Clone this repo
 - Change the git repo config in `index.ts` to match yours
 - Deploy it to your cloudflare account with `npx wrangler deploy`
 - In your cloudflare dashboard, go configure the worker's secrets
 - [click this link](https://www.icloud.com/shortcuts/0b942ce5caba43b3a11c9730930241b0) which will open the shortcuts app
 - enter your worker url and your key
 - start sharing stuff!

