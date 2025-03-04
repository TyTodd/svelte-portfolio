<script>
  import projects from "$lib/projects.json";
  import Project from "$lib/Project.svelte";
  // import yodamna from "%sveltekit.assets%/images/yodamna.jpg"
  // import yodamna from "$static/images/yodamna.jpg"
</script>
<svelte:head>
  <title>Tyrin</title>
</svelte:head>
<h1>Tyrin</h1>
<p>
    Hello! My name is Tyrin. I am a senior in course 6-4 (AI and Decision
    Making). I'm from Pennsylvania and I have two cats.
</p>
<img src="images/yodamna.jpg" alt="yodamna" />
<h2>Latest Projects</h2>
<div class="projects">
  {#each projects.slice(0, 3) as p}
  <Project data={p} hLevel="3" />
  {/each}
</div>