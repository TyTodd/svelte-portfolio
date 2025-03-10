<script>
  import { page } from "$app/stores";
let pages = [
  { url: "./", title: "Home" },
  // { url: "assignments", title: "Assignments" },
  { url: "./resume", title: "Resume" },
  { url: "./projects", title: "Projects" },
  { url: "./contact", title: "Contact" },
  { url: "https://github.com/TyTodd", title: "Github" },
];
let colorScheme = "light dark";
let localStorage = globalThis.localStorage ?? {};
if (localStorage.colorScheme) {
  colorScheme = localStorage.colorScheme;
}

let root = globalThis?.document?.documentElement;
$: root?.style.setProperty("color-scheme", colorScheme);
$: localStorage.colorScheme = colorScheme;
</script>

<label class="color-scheme">
    Theme:
    <select bind:value={ colorScheme }>
        <option value="light dark">Automatic</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
    </select>
</label>

<nav>
  {#each pages as p}
    <a
    href={p.url}
    class:current={"." + $page.route.id === p.url}
    target={p.url.startsWith("http") ? "_blank" : null}
    >
    {p.title}
    </a>
  {/each}
</nav>

<slot />


<style>
.current {
  border-bottom-width: 0.4em;
  border-bottom-style: solid;
  /* border-bottom-color: oklch(80% 3% 200); */
  border-bottom-color: oklch(50% 10% 200 / 40%);
  font-weight: bold;
}
nav {
  margin-left: 20;
  display: flex;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  /* border-bottom-color: oklch(80% 3% 200); */
  border-bottom-color: oklch(50% 10% 200 / 40%);
}
a {
  flex: 1;
  text-decoration: none;
  color: inherit;
  text-align: center;
}

a:hover {
  border-bottom-width: 0.4em;
  border-bottom-style: solid;
  border-bottom-color: var(--color-accent);
  background-color: color-mix(in oklch, var(--color-accent), canvas 85%);
}
.color-scheme {
  position: absolute;
  top: 0.5rem;
  right: 1rem;
  display: inline-flex;
  gap: 4px;
  font-family: inherit;
  font-size: 80%;
}

</style>