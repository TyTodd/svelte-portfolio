<script>
    import projects from "$lib/projects.json";
    import Project from "$lib/Project.svelte";
</script>
<svelte:head>
  <title>Tyrin: Projects</title>
</svelte:head>
<h1>{ projects.length } Projects</h1>
<div class="projects">
    {#each projects as p}
    <Project data={p} />
    {/each} 
</div>