// console.log("IT’S ALIVE!");

// function $$(selector, context = document) {
//   return Array.from(context.querySelectorAll(selector));
// }

// let navLinks = $$("nav a");
// console.log("navLinks", navLinks);
// let currentLink = navLinks.find((a) => {
//   a.host === location.host && a.pathname === location.pathname;
//   console.log(a.host, location.host, a.pathname, location.pathname);
// });
// console.log(currentLink);
// currentLink?.classList.add("current");
// const ARE_WE_HOME = document.documentElement.classList.contains("home");
const DOUBLE_NESTED =
  document.documentElement.classList.contains("double-nested");

let pages = [
  { url: "/", title: "Home" },
  // { url: "assignments", title: "Assignments" },
  { url: "/resume/", title: "Resume" },
  { url: "/projects/", title: "Projects" },
  { url: "/contact/", title: "Contact" },
  { url: "https://github.com/TyTodd", title: "Github" },
];

let nav = document.createElement("nav");
nav.classList.add("navbar");
document.body.prepend(nav);
for (let p of pages) {
  let url = p.url;
  let title = p.title;
  // if (!ARE_WE_HOME && !url.startsWith("http")) {
  //   url = "../" + url;
  //   // console.log("not home");
  // }
  // if (DOUBLE_NESTED && !url.startsWith("http")) {
  //   url = "../" + url;
  //   // console.log("double nested");
  // }
  //   console.log(url);
  // Create link and add it to nav
  //   nav.insertAdjacentHTML("beforeend", `<a href="${url}">${title}</a>`);
  let a = document.createElement("a");
  // if (url !== "./" && !url.startsWith("http")) {
  //   const basePath = location.pathname.split("/").slice(0, -1).join("/");
  //   url = `${basePath}/${url}`;
  // }
  // if (url.endsWith("/")) {
  //   url = url.slice(0, -1);
  // }
  console.log("url", p, url);
  a.href = url;
  a.textContent = title;
  nav.append(a);
  a.classList.add("nav-link");
  if (a.host === location.host && a.pathname === location.pathname) {
    a.classList.add("current");
  }

  if (
    a.host === location.host &&
    location.pathname.includes(a.pathname) &&
    title !== "Home"
  ) {
    // console.log("current", a);
    a.classList.add("current");
  }

  if (a.host !== location.host) {
    a.target = "_blank";
  }
}

console.log(document);
document.body.insertAdjacentHTML(
  "afterbegin",
  `
	<label class="color-scheme">
		Theme:
		<select>
			<option value="light dark">Automatic</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
		</select>
	</label>`
);

let select = document.querySelector("select");
console.log("select", select);
if (localStorage.colorScheme) {
  document.documentElement.style.setProperty(
    "color-scheme",
    localStorage.colorScheme
  );
  select.value = localStorage.colorScheme;
}

select.addEventListener("input", function (event) {
  console.log("color scheme changed to", event.target.value);
  document.documentElement.style.setProperty(
    "color-scheme",
    event.target.value
  );
  localStorage.colorScheme = event.target.value;
});

let form = document.querySelector("form");

form?.addEventListener("submit", function (event) {
  event.preventDefault();
  let data = new FormData(form);
  let url = form.action + "?";
  for (let [name, value] of data) {
    console.log("name, value", name, value);
    value = value.replace(/%/g, "%25");
    url += name + "=" + value + "&";
    // console.log(name, value);
  }
  console.log("url", url);
  location.href = url;
});
