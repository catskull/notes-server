
import { Octokit, App } from "octokit";

export default {
	async fetch(request, env, ctx): Promise<Response> {

		// it authenticates the request
		if (env.KEY !== request.headers.get('key')) {
			return new Response('u suck', {status: 401})
		}

		// it receives the parameters
		const body = await request.json()

		// it removes the double url from apple notes
		const link = body.link.split('\n')[0];

		// it makes the yaml
		const yaml =`- note: ${body.note}
	link: "${link}"
	date: ${new Date().toLocaleDateString()}

`
		// it configures the configurations
		const repo = {
		  owner: 'catskull',
		  repo: 'catskull.github.io',
		  path: '_data/notes.yml',
		  headers: {
		    'X-GitHub-Api-Version': '2022-11-28'
		  }
		}
		const octokit = new Octokit({
			auth: env.TOKEN
		})

		// it gets the file
    let file = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {...repo})
		let content = atob(file?.data?.content ?? '');

		// it rubs the yaml on it's skin
    const update = await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}',
    {
    	...repo,
    	message: `New note: ${link}`,
    	content: btoa(yaml + content),
    	sha: file.data.sha,
    })

    // it gets the updated file
    file = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {...repo})
		content = atob(file?.data?.content ?? '');

		// it shows us the updated file
		return new Response(content);
	},
} satisfies ExportedHandler<Env>;
