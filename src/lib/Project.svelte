<script>
    export let data = {};
    export let hLevel = 2;
    import { onMount } from 'svelte';
    let imageLoaded = false;
    let imageError = false;
    

    onMount(() => {
        // Image loading will now happen client-side
        imageLoaded = true;
    });
</script>
<article>
    <svelte:element this={"h" + hLevel}>{data.title}</svelte:element>
    {#if !imageLoaded}
        <img src="images/loading.gif" alt="Loading..." />
    {:else}
        {#if imageError}
            <img src="https://vis-society.github.io/labs/2/images/empty.svg" alt="Failed to load image" />
        {:else}
            <img
                src={data.image}
                alt=""
                on:error={() => imageError = true}
            />
        {/if}
    {/if}
    <p>
       {data.description}
    </p>
</article>

<style> 
article {
  display: grid;
  grid-template-rows: subgrid;
  grid-row: span 3;
  margin-left: 0px;
  margin-right: 20px;
}

article h2 {
  margin: 0;
}
article h3 {
  margin: 0;
}
h3 {
    margin: 0;
}
.proj-heading{
    margin: 0;
}
</style>