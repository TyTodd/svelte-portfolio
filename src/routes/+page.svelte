<script>
  import projects from "$lib/projects.json";
  import Project from "$lib/Project.svelte";
  import { onMount } from "svelte";
  import * as d3 from "d3";

  let githubData = null;
  let loading = true;
  let error = null;

  onMount(async () => {
    try {
      const response = await fetch("https://api.github.com/users/TyTodd");
      githubData = await response.json();
    } catch (err) {
      error = err;
    }
    loading = false;
  });
  // import yodamna from "%sveltekit.assets%/images/yodamna.jpg"
  // import yodamna from "$static/images/yodamna.jpg"
</script>

<svelte:head>
  <title>Tyrin</title>
</svelte:head>
<h1>Tyrin</h1>
<p>
  Hello! My name is Tyrin. I am a senior in course 6-4 (AI and Decision Making).
  I'm from Pennsylvania and I have two cats.
</p>
<img src="images/yodamna.jpg" alt="yodamna" />

<!-- {#await {
  ok: true,
  json: async () => ({
    followers: 101,
    following: 100,
    public_repos: 100,
    public_gists: 100,
    updated_at: "2025-03-06T04:49:25Z"
  }),
}} -->
{#if loading}
  <p>Loading...</p>
{:else if error}
  <p class="error">Something went wrong: {error.message}</p>
{:else}
  <section class="stats">
    <h2>My GitHub Stats</h2>
    <dl>
      <dt>Followers</dt>
      <dd>{githubData.followers}</dd>
      <dt>Following</dt>
      <dd>{githubData.following}</dd>
      <dt>Public Repositories</dt>
      <dd>{githubData.public_repos}</dd>
    </dl>
  </section>
{/if}

<h2>Latest Projects</h2>
<div class="projects">
  {#each projects.slice(0, 4) as p}
    <Project data={p} hLevel="3" />
  {/each}
</div>
