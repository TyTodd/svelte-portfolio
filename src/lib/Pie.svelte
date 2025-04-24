<script>
  import * as d3 from "d3";
  let liveText = "";
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
  $: colors = d3
    .scaleOrdinal()
    .domain(data.map((_, i) => i))
    .range(d3.quantize(d3.interpolateBlues, data.length));
  // let sliceGenerator = d3.pie();
  let sliceGenerator = d3.pie().value((d) => d.value);
  // let arcData = sliceGenerator(data);
  // let arcs = arcData.map(d => arcGenerator(d));

  let arcData;
  let arcs;

  let showChart = true;

  function toggleView() {
    showChart = !showChart;
    liveText = showChart ? "Pie chart view shown." : "Table view shown.";
  }

  $: {
    // Reactively calculate arcData and arcs the same way we did before with sliceGenerator and arcGenerator
    arcData = sliceGenerator(data);
    arcs = arcData.map((d) => arcGenerator(d));
  }

  export let selectedIndex = -1;

  function toggleWedge(index, event) {
    if (!event.key || event.key === "Enter") {
      selectedIndex = index;
      const d = data[index];
      liveText = `${d.label}: ${d.value} projects selected.`;
    }
  }
  $: description = `A pie chart showing project counts by year. ${data.map((d) => `${d.label}: ${d.value} projects`).join(", ")}.`;
</script>

<button
  on:click={toggleView}
  aria-pressed={!showChart}
  aria-label="Toggle between pie chart and table view"
  class="toggle-button"
>
  {showChart ? "Show Table" : "Show Chart"}
</button>
{#if showChart}
  <div class="container">
    <svg viewBox="-50 -50 100 100" role="img">
      <title id="pie-title">Projects by Year</title>
      <desc id="pie-desc"
        >A pie chart showing the number of projects per year. Most projects are
        in 2024 and 2025.</desc
      >
      <!-- <path d={arc} fill="red" /> -->
      <desc id="pie-desc">{description}</desc>
      <circle class="pie-outline" r="50" />
      {#each arcs as arc, index}
        <path
          d={arc}
          tabindex="0"
          role="button"
          aria-label={`${data[index].label}`}
          fill={colors(index)}
          class:selected={selectedIndex === index}
          on:click={(e) => toggleWedge(index, e)}
          on:keyup={(e) => toggleWedge(index, e)}
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
    <p aria-live="polite" class="sr-only">{liveText}</p>
  </div>
{:else}
  <table aria-label="Table showing project counts by year" class="data-table">
    <caption>Projects by Year</caption>
    <thead>
      <tr>
        <th id="year-header" scope="col">Year</th>
        <th id="projects-header" scope="col">Projects</th>
      </tr>
    </thead>
    <tbody>
      {#each data as d, i}
        <tr>
          <th id="row-{i}" scope="row">{d.label}</th>
          <td aria-labelledby="row-{i} projects-header">{d.value}</td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}

<style>
  svg:has(path:hover) path:not(:hover),
  svg:has(path:focus-visible) path:not(:focus-visible) {
    opacity: 50%;
  }
  path {
    transition: 300ms;
    cursor: pointer;
    outline: none;
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

  .sr-only {
    position: absolute;
    left: -9999px;
    width: 1px;
    height: 1px;
    overflow: hidden;
  }

  .data-table {
    margin-top: 1rem;
    margin-bottom: 1rem;
    border-collapse: collapse;
    width: 100%;
    max-width: 30em;
  }

  .data-table caption {
    font-weight: bold;
    margin-bottom: 0.5em;
    text-align: left;
  }

  .data-table th,
  .data-table td {
    border: 1px solid #ccc;
    padding: 0.5em;
    text-align: left;
  }

  .data-table th {
    background-color: #f0f0f0;
  }
  .toggle-button {
    background-color: white;
    border: 1px solid black;
    padding: 0.5em 1em;
    cursor: pointer;
    transition: background-color 0.2s ease;
    border-radius: 0.5em;
  }

  .toggle-button:hover {
    background-color: #f0f0f0;
  }

  .pie-outline {
    stroke: black;
    fill: none;
    stroke-width: 1;
  }
  path:focus-visible {
    stroke: white;
    stroke-width: 2px;
    stroke-dasharray: 4; /* Adjust the dash length as needed */
  }
</style>
