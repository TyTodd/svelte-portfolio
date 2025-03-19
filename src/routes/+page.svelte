<script>
  import projects from "$lib/projects.json";
  import Project from "$lib/Project.svelte";
  // import yodamna from "%sveltekit.assets%/images/yodamna.jpg"
  // import yodamna from "$static/images/yodamna.jpg"
  let data = {
    ok: true,
    json: async () => ({
      followers: 100,
      following: 100,
      public_repos: 100,
      public_gists: 100,
    }),
  };
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
{#await fetch("https://api.github.com/users/tytodd")}
  <p>Loading...</p>
{:then response}
  {#await response.json()}
    <p>Decoding...</p>
  {:then data}
    <section>
      <h2>My GitHub Stats</h2>
      <dl>
        <dt>Followers:</dt>
        <dd>{data.followers}</dd>
        <dt>Following:</dt>
        <dd>{data.following}</dd>
        <dt>Public Repositories:</dt>
        <dd>{data.public_repos}</dd>
        <dt>Last Updated:</dt>
        <dd>{new Date(data.updated_at).toLocaleDateString()}</dd>
      </dl>
    </section>
  {:catch error}
    <p class="error">Something went wrong: {error.message}</p>
  {/await}
{:catch error}
  <p class="error">Something went wrong: {error.message}</p>
{/await}

<h2>Latest Projects</h2>
<div class="projects">
  {#each projects.slice(0, 4) as p}
    <Project data={p} hLevel="3" />
  {/each}
</div>

<style>
  dl {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
    font-family: system-ui, sans-serif;
    margin: 1rem 0;
  }
  dt {
    grid-row: 1;
    font-weight: 600;
    color: oklch(50% 10% 200);
    text-align: center;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  dd {
    grid-row: 2;
    margin: 0;
    text-align: center;
    font-size: 1.25rem;
    font-weight: 500;
  }
  section {
    border: 1px solid oklch(50% 10% 200 / 40%);
    padding: 1.5rem;
    border-radius: 0.5rem;
    background-color: color-mix(in oklch, var(--color-accent), canvas 95%);
  }
</style>
