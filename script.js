document.documentElement.classList.add("js");

const menuButton = document.querySelector("[data-menu-toggle]");
const navigation = document.querySelector("[data-navigation]");
const projectNav = document.querySelector("[data-project-nav]");
const dropdownButton = document.querySelector("[data-dropdown-toggle]");
const currentPageLinks = document.querySelectorAll('[aria-current="page"]');

if (currentPageLinks.length > 1) {
  document.querySelector('a[href="projects.html"][aria-current="page"]')?.removeAttribute("aria-current");
}

function setMenu(open) {
  if (!menuButton || !navigation) return;
  navigation.classList.toggle("is-open", open);
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
}

function setDropdown(open) {
  if (!projectNav || !dropdownButton) return;
  projectNav.classList.toggle("is-open", open);
  dropdownButton.setAttribute("aria-expanded", String(open));
}

menuButton?.addEventListener("click", () => {
  setMenu(menuButton.getAttribute("aria-expanded") !== "true");
});

dropdownButton?.addEventListener("click", () => {
  setDropdown(dropdownButton.getAttribute("aria-expanded") !== "true");
});

document.addEventListener("click", (event) => {
  if (projectNav && !projectNav.contains(event.target)) setDropdown(false);
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  const dropdownWasOpen = projectNav?.classList.contains("is-open");
  const menuWasOpen = navigation?.classList.contains("is-open");
  setDropdown(false);
  setMenu(false);
  if (menuWasOpen) menuButton?.focus();
  else if (dropdownWasOpen) dropdownButton?.focus();
});

navigation?.addEventListener("click", (event) => {
  if (event.target.closest("a") && window.matchMedia("(max-width: 47.99rem)").matches) setMenu(false);
});

window.addEventListener("resize", () => {
  if (window.matchMedia("(min-width: 48rem)").matches) setMenu(false);
});

const header = document.querySelector(".site-header");
const progressBar = document.createElement("div");
progressBar.className = "scroll-progress";
progressBar.setAttribute("aria-hidden", "true");
header?.append(progressBar);

let progressFrame = 0;

function updateScrollProgress() {
  progressFrame = 0;
  const scrollRange = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollRange > 0 ? Math.min(Math.max(window.scrollY / scrollRange, 0), 1) : 1;
  progressBar.style.setProperty("--scroll-progress", progress.toFixed(4));
}

function requestProgressUpdate() {
  if (progressFrame) return;
  progressFrame = window.requestAnimationFrame(updateScrollProgress);
}

const revealSelectors = [
  ".hero-grid > *",
  ".page-hero .container > *",
  "main > section .section-heading",
  "main > section .grid > *",
  "main > section .split > *",
  "main > section .detail-grid > *",
  "main > section .timeline > *",
  "main > section .container > .visual-placeholder",
  "main > nav .container > *",
];

const revealElements = [...new Set(document.querySelectorAll(revealSelectors.join(",")))];
revealElements.forEach((element, index) => {
  element.classList.add("reveal");
  element.style.setProperty("--reveal-delay", `${Math.min(index % 3, 2) * 70}ms`);
});

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
document.documentElement.classList.add("motion-ready");

if (reducedMotion || !("IntersectionObserver" in window)) {
  revealElements.forEach((element) => element.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("is-visible", entry.isIntersecting);
    });
  }, { rootMargin: "0px 0px -10%", threshold: 0.12 });

  revealElements.forEach((element) => revealObserver.observe(element));
}

window.addEventListener("scroll", requestProgressUpdate, { passive: true });
window.addEventListener("resize", requestProgressUpdate);
updateScrollProgress();
