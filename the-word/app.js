const walk = document.getElementById("walk");
const menu = document.getElementById("app-menu");
const toggle = document.getElementById("app-toggle");
const stations = [...document.querySelectorAll(".station")];
const marks = [...document.querySelectorAll(".path a")];

function setHere(station) {
  marks.forEach((mark) => {
    mark.classList.toggle("is-here", mark.dataset.station === station.id);
  });
  if (station.id && location.hash !== `#${station.id}`) {
    history.replaceState(null, "", `#${station.id}`);
  }
}

function closestStation() {
  const mid = walk.scrollTop + walk.clientHeight / 2;
  return stations.reduce((best, station) => {
    const top = station.offsetTop;
    const bottom = top + station.offsetHeight;
    return mid >= top && mid < bottom ? station : best;
  }, stations[0]);
}

function go(delta) {
  const index = stations.indexOf(closestStation());
  const next =
    stations[Math.max(0, Math.min(stations.length - 1, index + delta))];
  next.scrollIntoView({ behavior: "smooth", block: "start" });
}

toggle.addEventListener("click", () => {
  const open = menu.hidden;
  menu.hidden = !open;
  toggle.setAttribute("aria-expanded", String(open));
});

walk.addEventListener("click", () => {
  if (!menu.hidden) {
    menu.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
  }
});

walk.addEventListener("scroll", () => setHere(closestStation()), {
  passive: true,
});

document.addEventListener("keydown", (event) => {
  if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey)
    return;
  if (["ArrowDown", "ArrowRight", "PageDown", " "].includes(event.key)) {
    event.preventDefault();
    go(1);
  } else if (["ArrowUp", "ArrowLeft", "PageUp"].includes(event.key)) {
    event.preventDefault();
    go(-1);
  } else if (event.key === "Home") {
    event.preventDefault();
    stations[0].scrollIntoView({ behavior: "smooth" });
  } else if (event.key === "End") {
    event.preventDefault();
    stations.at(-1).scrollIntoView({ behavior: "smooth" });
  }
});

const start = document.getElementById(location.hash.slice(1)) || stations[0];
setHere(start);
if (start !== stations[0]) {
  start.scrollIntoView({ behavior: "auto", block: "start" });
}
