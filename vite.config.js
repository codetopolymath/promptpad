import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

// When running in GitHub Actions, set the base path to the repo name
// so assets resolve correctly on github.io/reponame/ deployments.
const isGitHubActions = process.env.GITHUB_ACTIONS === 'true';
const repositoryName  = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? '';

export default defineConfig({
  plugins: [svelte()],
  base: isGitHubActions ? `/${repositoryName}/` : '/',
});
