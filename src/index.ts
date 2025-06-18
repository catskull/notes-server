
import { Octokit, App } from "octokit";

export default {
	async fetch(request, env, ctx): Promise<Response> {
    const utf8ToBase64Modern = (str) => {
      let bytes = new TextEncoder().encode(str);
      let binary = String.fromCharCode(...bytes);
      return btoa(binary);
    }

    const base64ToUtf8Modern = (str) => {
      let binary = atob(str);
      let bytes = new Uint8Array([...binary].map(c => c.charCodeAt(0)));
      return new TextDecoder().decode(bytes);
    }

		// it authenticates the request
		if (env.KEY !== request.headers.get('key')) {
			return new Response('u suck', {status: 401})
		}

		// it receives the parameters
		const body = await request.json()

		// it removes the double url from apple notes
		const link = body.link.split('\n')[0];

		// it makes the yaml
    let yaml
		if (body.wiki) {
      yaml =`- url: ${link}
`
    } else {
      yaml =`- note: "${body.note}"
  link: "${link}"
  date: ${new Date().toLocaleDateString()}

`
    }
		// it configures the configurations


  const repo = {
    owner: 'catskull',
    repo: 'catskull.github.io',
    path: body.wiki ? '_data/wiki.yml' : '_data/notes.yml',
    headers: {
      'X-GitHub-Api-Version': '2022-11-28'
    }
  }
  const octokit = new Octokit({
   auth: env.TOKEN
 })

		// it gets the file
  let file = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {...repo})
  let content = base64ToUtf8Modern(file?.data?.content ?? '');

		// it rubs the yaml on it's skin
  const update = await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}',
  {
   ...repo,
   message: body.wiki ? `New wiki: ${link}` : `New note: ${link}`,
   content: body.wiki ? utf8ToBase64Modern(content + yaml) : utf8ToBase64Modern(yaml + content),
   sha: file.data.sha,
 })

    // it gets the updated file
  file = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {...repo})
  content = base64ToUtf8Modern(file?.data?.content ?? '');

		// it shows us the updated file
  return new Response(content);
},
} satisfies ExportedHandler<Env>;
