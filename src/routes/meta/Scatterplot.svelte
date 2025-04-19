<script>
  import { onMount } from "svelte";
  import * as d3 from "d3";
  import { computePosition, autoPlacement, offset } from "@floating-ui/dom";
  import Bar from "$lib/Bar.svelte";
  import { base } from "$app/paths";
  let commitTooltip;
  let commitProgress = 100;

  export let width = 1000,
    height = 600;
  let margin = { top: 10, right: 10, bottom: 30, left: 20 };
  let usableArea = {
    top: margin.top,
    right: width - margin.right,
    bottom: height - margin.bottom,
    left: margin.left,
  };
  usableArea.width = usableArea.right - usableArea.left;
  usableArea.height = usableArea.bottom - usableArea.top;

  let cursor = { x: 0, y: 0 };

  export let commits = [];
  export let clickedCommits = [];

  $: timeScale = d3
    .scaleTime()
    .domain(d3.extent(commits.map((d) => d.datetime))) // or d.date if that's what you're using
    .range([0, 100]);
  $: minDate = d3.min(commits.map((d) => d.date));
  $: maxDate = d3.max(commits.map((d) => d.date));
  $: maxDatePlusOne = new Date(maxDate);
  $: maxDatePlusOne.setDate(maxDatePlusOne.getDate() + 1);
  $: commitMaxTime = timeScale.invert(commitProgress);

  $: xScale = d3
    .scaleTime()
    .domain([minDate, maxDatePlusOne])
    .range([usableArea.left, usableArea.right])
    .nice();

  $: yScale = d3
    .scaleLinear()
    .domain([24, 0])
    .range([usableArea.bottom, usableArea.top]);

  let xAxis, yAxis, yAxisGridlines;
  $: {
    d3.select(xAxis).call(d3.axisBottom(xScale));
    d3.select(yAxis).call(d3.axisLeft(yScale));
    d3.select(yAxis).call(
      d3
        .axisLeft(yScale)
        .tickFormat((d) => String(d % 24).padStart(2, "0") + ":00")
    );
    d3.select(yAxisGridlines).call(
      d3.axisLeft(yScale).tickFormat("").tickSize(-usableArea.width)
    );
  }

  let hoveredIndex = -1;
  $: hoveredCommit = commits[hoveredIndex] ?? hoveredCommit ?? {};
  let tooltipPosition = { x: 0, y: 0 };

  async function dotInteraction(index, evt) {
    let hoveredDot = evt.target;
    if (evt.type === "mouseenter") {
      hoveredIndex = index;
      cursor = { x: evt.x, y: evt.y };
      tooltipPosition = await computePosition(hoveredDot, commitTooltip, {
        strategy: "fixed", // because we use position: fixed
        middleware: [
          offset(5), // spacing from tooltip to dot
          autoPlacement(), // see https://floating-ui.com/docs/autoplacement
        ],
      });
    } else if (evt.type === "mouseleave") {
      hoveredIndex = -1;
    } else if (evt.type === "click") {
      let commit = commits[index];
      if (!clickedCommits.includes(commit)) {
        // Add the commit to the clickedCommits array
        clickedCommits = [...clickedCommits, commit];
      } else {
        // Remove the commit from the array
        clickedCommits = clickedCommits.filter((c) => c !== commit);
      }
    }
  }
</script>

<dl
  class="info tooltip"
  hidden={hoveredIndex === -1}
  bind:this={commitTooltip}
  style="top: {tooltipPosition.y}px; left: {tooltipPosition.x}px"
>
  <dt>Commit</dt>
  <dd><a href={hoveredCommit.url} target="_blank">{hoveredCommit.id}</a></dd>

  <dt>Date</dt>
  <dd>{hoveredCommit.datetime?.toLocaleString("en", { dateStyle: "full" })}</dd>

  <!-- Add: Time, author, lines edited -->
</dl>

<svg viewBox="0 0 {width} {height}">
  <g
    class="gridlines"
    transform="translate({usableArea.left}, 0)"
    bind:this={yAxisGridlines}
  />

  <g transform="translate(0, {usableArea.bottom})" bind:this={xAxis} />
  <g transform="translate({usableArea.left}, 0)" bind:this={yAxis} />
  <g class="dots">
    {#each commits as commit, index (commit.id)}
      <circle
        on:mouseenter={(evt) => dotInteraction(index, evt)}
        on:mouseleave={(evt) => dotInteraction(index, evt)}
        on:click={(evt) => dotInteraction(index, evt)}
        class:selected={clickedCommits.includes(commit)}
        cx={xScale(commit.datetime)}
        cy={yScale(commit.hourFrac)}
        r="5"
        fill="steelblue"
      />
    {/each}
  </g>
</svg>

<style>
  svg {
    overflow: visible;
  }
  .gridlines {
    stroke-opacity: 0.2;
  }

  dl.info {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.25em 0.5em;
    margin: 0;

    transition-duration: 500ms;
    transition-property: opacity, visibility;

    &[hidden]:not(:hover, :focus-within) {
      opacity: 0;
      visibility: hidden;
    }
  }

  dl.info dt {
    color: #666;
    font-size: 0.9em;
  }

  dl.info dd {
    margin: 0;
  }

  .tooltip {
    position: fixed;
    top: 1em;
    left: 1em;
    padding: 1rem;
    background-color: color-mix(in oklch, var(--color-accent), canvas 95%);
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(8px);
    border-radius: 0.5rem;
  }

  circle {
    transform-origin: center;
    transform-box: fill-box;
    transition: 200ms;

    &:hover {
      transform: scale(1.5);
    }
    @starting-style {
      r: 0;
    }
  }

  .selected {
    fill: var(--color-accent);
  }
</style>
