<script>
    export let data = {};
    export let hLevel = 2;
</script>
<article>
    <svelte:element this={"h" + hLevel}>{data.title}</svelte:element>
    <img
        src={data.image}
        alt=""
    />
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