<script>
  import * as d3 from "d3";
  let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
  // let arc = arcGenerator({
  // startAngle: 0,
  // endAngle: 2 * Math.PI
  // });
  // let data = [
  // { value: 1, label: "apples" },
  // { value: 2, label: "oranges" },
  // { value: 3, label: "mangos" },
  // { value: 4, label: "pears" },
  // { value: 5, label: "limes" },
  // { value: 5, label: "cherries" }
  // ];
  export let data = [];
  let colors = d3.scaleOrdinal(d3.schemeTableau10);
  // let sliceGenerator = d3.pie();
  let sliceGenerator = d3.pie().value((d) => d.value);
  // let arcData = sliceGenerator(data);
  // let arcs = arcData.map(d => arcGenerator(d));

  let arcData;
  let arcs;

  $: {
    // Reactively calculate arcData and arcs the same way we did before with sliceGenerator and arcGenerator
    arcData = sliceGenerator(data);
    arcs = arcData.map((d) => arcGenerator(d));
  }

  export let selectedIndex = -1;
</script>

<div class="container">
  <svg viewBox="-50 -50 100 100">
    <!-- <path d={arc} fill="red" /> -->
    {#each arcs as arc, index}
      <path
        d={arc}
        fill={colors(index)}
        class:selected={selectedIndex === index}
        on:click={(e) => (selectedIndex = selectedIndex === index ? -1 : index)}
      />
    {/each}
  </svg>
  <ul class="legend">
    {#each data as d, index}
      <li
        style="--color: {colors(index)}"
        class:selected={selectedIndex === index}
      >
        <span class="swatch"></span>
        {d.label} <em>({d.value})</em>
      </li>
    {/each}
  </ul>
</div>

<style>
  path {
    transition: 300ms;
    cursor: pointer;
  }
  svg:has(path:hover) path:not(:hover) {
    opacity: 50%;
  }
  svg {
    max-width: 20em;
    margin-block: 2em;

    /* Do not clip shapes outside the viewBox */
    overflow: visible;
  }

  .swatch {
    display: inline-block;
    width: 1em;
    height: 1em;
    background-color: var(--color);
  }

  .legend {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(8em, 1fr));
    gap: 2em;
    border: 1px solid black;
    padding: 1em;
    margin: 1em;
    flex: 1;
  }

  li {
    display: flex;
    align-items: center;
    gap: 0.5em;
  }
  .container {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 2em;
  }

  .selected {
    --color: oklch(60% 45% 0) !important;

    &:is(path) {
      fill: var(--color) !important;
    }

    &:is(li) {
      color: var(--color);
    }
  }

  ul:has(.selected) li:not(.selected) {
    color: gray;
  }

  path:hover {
    opacity: 100% !important;
  }
</style>
