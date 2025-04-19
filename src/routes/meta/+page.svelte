<script>
  import { onMount } from "svelte";
  import * as d3 from "d3";
  import { computePosition, autoPlacement, offset } from "@floating-ui/dom";
  import Bar from "$lib/Bar.svelte";
  import { base } from "$app/paths";
  import Scatterplot from "./Scatterplot.svelte";
  import FileLines from "$lib/FileLines.svelte";
  import StackedBar from "$lib/StackedBar.svelte";
  import Scrolly from "svelte-scrolly";

  let commitTooltip;
  let commitProgress = 0;
  let raceProgress = 0;
  let width = 1000,
    height = 600;

  let data = [];
  let commits = [];
  let averageCharCount = 0;
  let clickedCommits = [];
  let colorScale = d3.scaleOrdinal(d3.schemeTableau10);

  $: filteredCommits = commits.filter(
    (commit) => commit.datetime <= commitMaxTime
  );
  $: timeScale = d3
    .scaleTime()
    .domain(d3.extent(commits.map((d) => d.datetime))) // or d.date if that's what you're using
    .range([0, 100]);
  $: minDate = d3.min(filteredCommits.map((d) => d.date));
  $: maxDate = d3.max(filteredCommits.map((d) => d.date));
  $: maxDatePlusOne = new Date(maxDate);
  $: maxDatePlusOne.setDate(maxDatePlusOne.getDate() + 1);
  $: commitMaxTime = timeScale.invert(commitProgress);

  $: raceMaxTime = timeScale.invert(raceProgress);

  $: filteredLines = data.filter((line) => line.datetime <= commitMaxTime);

  $: raceFilteredLines = data.filter((line) => line.datetime <= raceMaxTime);

  $: {
    let charCount = 0;
    if (filteredLines.length > 0) {
      filteredLines.forEach((d) => {
        charCount += d.length;
      });
      averageCharCount =
        Math.round((charCount / filteredLines.length) * 10) / 10;
    } else {
      averageCharCount = 0;
    }
  }

  onMount(async () => {
    data = await d3.csv(`${base}/loc.csv`, (row) => ({
      ...row,
      line: Number(row.line), // or just +row.line
      depth: Number(row.depth),
      length: Number(row.length),
      date: new Date(row.date + "T00:00" + row.timezone),
      datetime: new Date(row.datetime),
    }));

    commits = d3
      .groups(data, (d) => d.commit)
      .map(([commit, lines]) => {
        let first = lines[0];
        let { author, date, time, timezone, datetime } = first;
        let ret = {
          id: commit,
          url: "https://github.com/TyTodd/svelte-portfolio/commit/" + commit,
          author,
          date,
          time,
          timezone,
          datetime,
          hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
          totalLines: lines.length,
        };

        // Like ret.lines = lines
        // but non-enumerable so it doesn't show up in JSON.stringify
        Object.defineProperty(ret, "lines", {
          value: lines,
          configurable: true,
          writable: true,
          enumerable: false,
        });

        return ret;
      });

    // console.log(data);
    // console.log(commits);
  });

  $: allTypes = Array.from(new Set(filteredLines.map((d) => d.type)));
  $: selectedLines = (
    clickedCommits.length > 0 ? clickedCommits : filteredCommits
  ).flatMap((d) => d.lines);
  $: selectedCounts = d3.rollup(
    selectedLines,
    (v) => v.length,
    (d) => d.type
  );
  $: languageBreakdown = allTypes.map((type) => [
    type,
    selectedCounts.get(type) || 0,
  ]);
</script>

<h1>Meta</h1>
This page includes states about the code of this website.

<section class="stats">
  <h2>Summary</h2>
  <dl>
    <dt>Total <abbr title="Lines of code">LOC</abbr></dt>
    <dd>{data.length}</dd>
    <dt>Total Commits</dt>
    <dd>{filteredCommits.length}</dd>
    <dt>Average Character Count</dt>
    <dd>{averageCharCount}</dd>
  </dl>
</section>

<!-- <div class="slider-container">
  <div class="slider-row">
    <label for="time-slider">Show commits until:</label>
    <input
      type="range"
      id="time-slider"
      class="slider"
      bind:value={commitProgress}
      min="0"
      max="100"
    />
  </div>
  <time class="slider-time"
    >{commitMaxTime.toLocaleString("en", {
      dateStyle: "full",
      timeStyle: "short",
    })}</time
  >
</div> -->
<time
  class="slider-time"
  style="position: fixed; top: 0; left: 50%; transform: translateX(-50%); padding: 0.5em; background: white; box-shadow: 0 0 10px rgba(0,0,0,0.1); text-align: center; white-space: normal; max-width: 80vw; opacity: {commitProgress >
    0 && raceProgress <= 99
    ? 1
    : 0}; transition: opacity 0.3s ease-in-out;"
  >{(raceProgress < 1 ? commitMaxTime : raceMaxTime).toLocaleString("en", {
    timeStyle: "short",
    dateStyle: "full",
  })}</time
>
<Scrolly --scrolly-viz-width="3fr" bind:progress={commitProgress}>
  <p>
    It begins on <strong>February 27 2025</strong> with the classic one–two
    punch: a bold <code>first commit</code> followed seconds later by an
    embarrassed <code>actual first commit</code>. In the span of a single coffee
    sip you both created history and corrected it, setting a tone of relentless
    self‑review from minute one.
  </p>

  <p>
    Momentum snowballed that same night. You <code>remove extra files</code>,
    instantly regret the mess and go full makeover with <code>svelted</code>,
    nervously wonder <code>deploy?</code>, and finally slam the door with a
    triumphant <code>finished</code>. Four rapid‑fire pushes that alchemize a
    raw folder of HTML scraps into a living Svelte site before midnight strikes.
  </p>

  <p>
    Early March opens with the <code>fixed image</code> commit on the 4th—proof
    that a single broken <code>&lt;img&gt;</code> can haunt you until properly exorcised.
    It’s a tiny diff, but it restores every page’s dignity and spares visitors the
    pain of empty rectangles.
  </p>

  <p>
    Two days later, the internet’s labyrinthine link structure bites back: <code
      >url fixes</code
    >
    and, inevitably, <code>url fixes 2</code>. Like any epic, the sequel drops
    faster than you can clear the cache. Your routing is cleaner, your 404 log
    quieter, and your commit messages shorter—as though brevity itself might
    ward off yet another typo.
  </p>

  <p>
    On <strong>March 10</strong> the repo enters the Coursework Epoch. A
    sprawling <code>lab 5</code> lands with new markdown pages, followed minutes
    later by <code>fixed image paths</code> because screenshots never sit still where
    you told them to. The site’s LOC rockets past five thousand, and your average
    commit message length drops to 18 characters—crisp, surgical, zero fluff.
  </p>

  <p>
    Nine days later you unleash <code>lab 6 complete</code>, a midnight
    megacommit that melts TODOs like snow under a desk lamp, then immediately
    sweep up with <code>cleaned html</code> on March 20. Accessibility linting passes,
    rogue divs are tamed, and the build log finally scrolls without red ink.
  </p>

  <p>
    By <strong>March 28</strong> you declare <code>finished lab 7</code>,
    turning your Git graph into a skyline of green blocks. The victory lap
    follows on <strong>April 2</strong> with <code>lab 7 deploys</code>—because
    labs aren’t truly “done” until they live on the production server without
    catching fire. With that push, the repo crosses a neat milestone: two dozen
    commits in 35 days, each a heartbeat in the portfolio’s rapid evolution.
  </p>

  <p>
    From the double genesis of February’s twin first commits to April’s polished
    deployment, every message is a diary entry in terse verbs—<em
      >fix, clean, deploy, finish</em
    >. Read end‑to‑end, your commit history is less a ledger of code than a
    narrative of curiosity accelerating into craftsmanship, one green square at
    a time.
  </p>

  <svelte:fragment slot="viz">
    <Scatterplot commits={filteredCommits} {width} bind:clickedCommits />
    <StackedBar data={languageBreakdown} {width} {colorScale} />

    <!-- <Bar data={languageBreakdown} {width} {colorScale} /> -->
  </svelte:fragment>
</Scrolly>

<Scrolly bind:progress={raceProgress}>
  <p>
    The starting gun cracked on <strong>February 27 2025</strong>. Eight
    fresh‑faced racers—little more than code skeletons—lurched onto the track.
    <code>static/styles.css</code>
    waddled out with barely forty lines of simple resets. Close behind came
    <code>src/routes/+page.svelte</code>
    (the home page) brandishing thirty‑odd lines of “Hello, world!” prose.
    <code>static/global.js</code>
    and <code>src/app.html</code> trotted together, twenty lines apiece,
    handling nav‑hover hacks and Svelte boilerplate. In the back of the pack,
    <code>src/routes/resume/+page.svelte</code>,
    <code>src/routes/projects/+page.svelte</code>,
    <code>src/lib/Project.svelte</code>, and the as‑yet‑unnamed layout file were
    mere placeholders—tokens on the starting grid.
  </p>
  <p>
    A week later—<strong>March 10, Lab 5</strong>—the first hill appeared and
    the order exploded. <code>static/global.js</code> slammed down eighty new
    lines of client‑side nav logic and stormed into second place at 100 LOC.
    Lab 5 also introduced two brand‑new sprinters:
    <code>src/routes/+layout.svelte</code>
    jumped from zero to 60 LOC with a theme toggle and flexible navbar, while
    <code>src/lib/Project.svelte</code>
    debuted at a lean 50 LOC, neatly rendering portfolio cards. Meanwhile,
    <code>styles.css</code> bulged to 120 LOC after a color‑scheme refactor, retaking
    the lead with a comfortable margin.
  </p>
  <p>
    Then came the <strong>March 19 “lab 6 complete” surge</strong>. The résumé
    page unleashed its inner overachiever—ballooning from 70 to
    <em>180 LOC</em>—thanks to education tables, skill grids, and enough
    typographic tweaks to make a typesetter blush. <code>styles.css</code>
    tacked on thirty more lines of flexbox magic to keep up.
    <code>+layout.svelte</code>
    bulked up to 75 LOC, adding a persistent color‑scheme selector, while
    <code>projects/+page.svelte</code> quietly doubled to 55 LOC to support d3‑powered
    pie charts. For a moment the race felt civilized—each file content to cruise
    in its newly earned lane.
  </p>
  <p>
    The calm shattered on <strong>March 28</strong> with the monster commit,
    <em>“finished lab 7.”</em> <code>static/styles.css</code> detonated—leaping
    past the 200‑line mark as CSS variables, OKLCH color mixing, and responsive
    tweaks rained down. <code>src/routes/+page.svelte</code> answered by
    crossing 60 LOC, pulling in live GitHub stats and top‑project previews. Not
    to be outshone, <code>+layout.svelte</code> refined its navbar logic and
    crept past 80 LOC, while <code>Project.svelte</code> added graceful
    image‑loading fallbacks to reach 53 LOC. Even staid <code>app.html</code> squeezed
    in a global‑script preload, though it remained the compact pocketknife of the
    bunch at 15 LOC.
  </p>
  <p>By sundown the leaderboard read:</p>
  <ul>
    <li><code>static/styles.css</code> — <strong>184 LOC</strong></li>
    <li><code>resume/+page.svelte</code> — <strong>176 LOC</strong></li>
    <li><code>static/global.js</code> — <strong>123 LOC</strong></li>
    <li><code>src/routes/+page.svelte</code> — <strong>100 LOC</strong></li>
    <li><code>src/routes/+layout.svelte</code> — <strong>83 LOC</strong></li>
  </ul>
  <p>
    But numbers alone miss the drama. <code>styles.css</code> spent March
    throwing haymakers—first doubling, then shrugging off another 50 lines in a
    single commit—to prove that presentation often dictates tempo. The résumé
    file sprinted straight through the middle miles, surging from back‑marker to
    silver medalist with one marathon merge. <code>global.js</code> took the
    sprinter’s strategy: frequent, smaller bursts to stay relevant.
    <code>+layout.svelte</code>
    played the tactician, adding just enough heft to steer the rest of the team.
    Even quiet <code>app.html</code> found its niche, guarding critical links with
    steadfast minimalism.
  </p>
  <p>
    The race isn’t over—future labs lurk beyond the next pull request—but as of
    the final whistle on Lab 7, your stylesheets dominate, your résumé sings,
    and every component has carved out a distinct stride in the repo’s relay.
    Lines of code may measure distance, but these commits prove velocity comes
    from well‑timed pushes and an eye on the finish line.
  </p>
  <svelte:fragment slot="viz">
    <FileLines lines={raceFilteredLines} width={1000} {colorScale} />
  </svelte:fragment>
</Scrolly>

<style>
  :global(body) {
    max-width: min(120ch, 80vw);
  }
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

  .slider-container {
    display: grid;
    grid-template-rows: auto auto;
    margin-bottom: 1rem;
  }

  .slider-row {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .slider {
    flex: 1;
  }

  .slider-time {
    white-space: nowrap;
    margin-top: 0.25rem;
  }
</style>
