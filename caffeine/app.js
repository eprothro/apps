const LB_PER_KG = 2.2046226218;
const KA = 4; // 1/h — fasted coffee; Tmax ≈ 50 min. Fed meal ≈ 2.
const MAX_MGKG = 10;
const CLEAR_HOURS = 20;

const TYPICAL = {
  8: 57,
  9: 64,
  10: 72,
  11: 81,
  12: 91,
  13: 101,
  14: 111,
  15: 120,
  16: 127,
  17: 133,
};

const DRINKS = [
  { id: "soda", label: "Soda", mg: 38 },
  { id: "tea", label: "Tea", mg: 47 },
  { id: "coffee", label: "Coffee", mg: 95 },
  { id: "large", label: "Large coffee", mg: 165 },
  { id: "energy", label: "Energy", mg: 160 },
  { id: "strong", label: "200 mg", mg: 200 },
];

const AGE_PRESETS = [
  { id: "10", label: "10", age: 10 },
  { id: "13", label: "13", age: 13 },
  { id: "16", label: "16", age: 16 },
];

const WEIGHT_PRESETS = [
  { id: "80", label: "80 lb", lb: 80 },
  { id: "100", label: "100 lb", lb: 100 },
  { id: "130", label: "130 lb", lb: 130 },
  { id: "170", label: "170 lb", lb: 170 },
  { id: "200", label: "200 lb", lb: 200 },
  { id: "225", label: "225 lb", lb: 225 },
];

const CONSUME_PRESETS = [
  { id: "7", label: "7am", time: "07:00" },
  { id: "8", label: "8am", time: "08:00" },
  { id: "12", label: "noon", time: "12:00" },
  { id: "15", label: "3pm", time: "15:00" },
  { id: "18", label: "6pm", time: "18:00" },
];

const BED_PRESETS = [
  { id: "21", label: "9pm", time: "21:00" },
  { id: "22", label: "10pm", time: "22:00" },
  { id: "23", label: "11pm", time: "23:00" },
  { id: "0", label: "12am", time: "00:00" },
];

const EFFECTS = [
  { id: "alertness", label: "alertness", kind: "help", color: "#4ecf8a" },
  { id: "cognition", label: "cognition", kind: "help", color: "#3dba7a" },
  { id: "endurance", label: "endurance", kind: "help", color: "#8fd36a" },
  { id: "power", label: "power", kind: "help", color: "#b5d45c" },
  { id: "mood", label: "mood", kind: "help", color: "#c6d36a" },
  { id: "jitters", label: "jitters", kind: "cost", color: "#ff3b30" },
  { id: "anxiety", label: "anxiety", kind: "cost", color: "#ff8a4a" },
  { id: "heart", label: "heart", kind: "cost", color: "#c43d52" },
];

// Landmarks and voice: caffeine/RESEARCH.md (Flip cards). mg = mg/kg × tray kg.
const STUDY_KG = 70;

function studyKg(mg, kg = STUDY_KG) {
  return mg / kg;
}

const NOTE_MGKG = {
  alertness: {
    from: studyKg(90),
    to: studyKg(180),
  },
  cognition: {
    betterLo: studyKg(180),
    betterHi: studyKg(250),
    memoryFail: studyKg(450),
  },
  endurance: {
    startLo: 2,
    startHi: 3,
    flatA: 3,
    flatB: 6,
    less: 9,
  },
  power: {
    light: 3,
    nearMax: 9,
  },
  mood: {
    goodLo: studyKg(150),
    goodHi: studyKg(250),
    turnDown: studyKg(300),
    tense: studyKg(450),
  },
  jitters: {
    little: studyKg(70),
    bigger: studyKg(250),
  },
  anxiety: {
    none: studyKg(50),
    some: studyKg(150),
    most: studyKg(450),
  },
  heartYouth: {
    bpLo: 1,
    bpHi: 2,
    ectopy: 3,
  },
  heartAdult: {
    bpLo: 2,
    bpHi: 3,
    ectopy: 4.4,
  },
  quiet: 0.28,
  landoltLeftMg: 25,
};

const state = {
  age: 13,
  weightLb: 101,
  doseMg: 95,
  drinkId: "coffee",
  consume: "08:00",
  bedtime: "22:00",
  sheet: null,
};

const drag = { live: false };

function kgFromLb(lb) {
  return lb / LB_PER_KG;
}

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

function mgPerKg() {
  return state.doseMg / kgFromLb(state.weightLb);
}

function typicalLb(age) {
  if (age >= 18) return 185;
  return TYPICAL[clamp(Math.round(age), 8, 17)];
}

function halfLifeH() {
  const age = state.age;
  if (age < 12) return 3.8;
  if (age < 18) return 3.8 + ((age - 12) / 6) * 1.2;
  return 5;
}

function ke() {
  return Math.LN2 / halfLifeH();
}

function pulse(x, rise, peak, fall) {
  if (x <= 0) return 0;
  const width = x < peak ? rise : fall;
  return Math.exp(-0.5 * ((x - peak) / width) ** 2);
}

function hill(x, d50, n) {
  if (x <= 0) return 0;
  const num = x ** n;
  return num / (d50 ** n + num);
}

function sigmoid(x, mid, steep) {
  return 1 / (1 + Math.exp(-steep * (x - mid)));
}

function cognitionAt(x) {
  const raw = hill(x, 1.2, 2) - 1.35 * hill(x, 5.8, 2.9);
  return clamp(raw / 0.705, 0, 1);
}

function effectAt(id, x) {
  const youth = state.age < 18;
  switch (id) {
    case "alertness":
      return hill(x, 1.1, 1.5);
    case "cognition":
      return cognitionAt(x);
    case "endurance":
      return hill(x, 1.7, 4.4) * (1 - 0.08 * sigmoid(x, 9.0, 2.2));
    case "power":
      return clamp(
        0.48 * sigmoid(x, 2.6, 3.4) + 0.52 * sigmoid(x, 7.0, 2.5),
        0,
        1,
      );
    case "mood":
      return pulse(x, 0.9, 2.2, 1.35);
    case "jitters":
      return sigmoid(x, 2.6, 1.25);
    case "anxiety":
      return sigmoid(x, youth ? 3.7 : 4.5, 1.15);
    case "heart":
      return clamp(
        0.4 * hill(x, youth ? 0.55 : 1.05, 4.2) +
          0.6 * sigmoid(x, youth ? 3.2 : 4.4, 3.0),
        0,
        1,
      );
    default:
      return 0;
  }
}

function sleepQuietMg() {
  return NOTE_MGKG.quiet * kgFromLb(state.weightLb);
}

function noteMg(mgkg) {
  const mg = mgkg * kgFromLb(state.weightLb);
  if (mg < 20) return Math.round(mg);
  return Math.round(mg / 5) * 5;
}

function noteHours(hours) {
  const rounded = Math.round(hours * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

function anxietyMgkg(key) {
  const base = NOTE_MGKG.anxiety[key];
  if (state.age >= 18) return base;
  return base * (3.7 / 4.5);
}

function heartMarks() {
  return state.age < 18 ? NOTE_MGKG.heartYouth : NOTE_MGKG.heartAdult;
}

function sleepDisruption(mg) {
  const extra = mg - sleepQuietMg();
  if (extra <= 0) return 0;
  const c = extra / kgFromLb(state.weightLb);
  const cn = c ** 1.3;
  return cn / (cn + 1.2 ** 1.3);
}

function activeWindow(id, thresh = 0.2) {
  let on = null;
  let off = null;
  const steps = 240;
  for (let s = 0; s <= steps; s += 1) {
    const x = (s / steps) * MAX_MGKG;
    const v = effectAt(id, x);
    if (on === null && v >= thresh) on = x;
    if (on !== null && off === null && v < thresh) off = x;
  }
  return { on, off };
}

function amountAt(hours, dose) {
  if (hours <= 0) return 0;
  const k = ke();
  return (
    dose * (KA / (KA - k)) * (Math.exp(-k * hours) - Math.exp(-KA * hours))
  );
}

function peakHours() {
  const k = ke();
  return Math.log(KA / k) / (KA - k);
}

function parseClock(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  return h + m / 60;
}

function hoursUntil(fromClock, toClock) {
  let d = toClock - fromClock;
  if (d < 0) d += 24;
  return d;
}

function quietCrossingHours() {
  const quiet = sleepQuietMg();
  const peak = peakHours();
  const step = 1 / 12;
  for (let t = peak; t <= CLEAR_HOURS + step; t += step) {
    if (amountAt(t, state.doseMg) <= quiet) return t;
  }
  return Infinity;
}

function roundHalfHourClock(hours) {
  return Math.round(hours * 2) / 2;
}

function formatClock(hours, compact) {
  const wrapped = ((hours % 24) + 24) % 24;
  let hr = Math.floor(wrapped);
  let min = Math.round((wrapped - hr) * 60);
  if (min === 60) {
    min = 0;
    hr = (hr + 1) % 24;
  }
  const suffix = hr >= 12 ? "pm" : "am";
  const hr12 = hr % 12 === 0 ? 12 : hr % 12;
  if (compact && min === 0) return `${hr12}${suffix}`;
  return min === 0
    ? `${hr12} ${suffix}`
    : `${hr12}:${String(min).padStart(2, "0")} ${suffix}`;
}

function formatMg(n) {
  if (n < 10) return n.toFixed(1).replace(/\.0$/, "");
  return String(Math.round(n));
}

function clockToMinutes(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function minutesToClock(min) {
  const wrapped = ((min % 1440) + 1440) % 1440;
  const h = Math.floor(wrapped / 60);
  const m = Math.round(wrapped % 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function bedSliderMinutes(hhmm) {
  let min = clockToMinutes(hhmm);
  if (min < 12 * 60) min += 1440;
  return min;
}

function matchDrink() {
  const match = DRINKS.find((d) => d.mg === state.doseMg);
  state.drinkId = match ? match.id : "custom";
}

function el(id) {
  return document.getElementById(id);
}

function svgEl(name, attrs) {
  const node = document.createElementNS("http://www.w3.org/2000/svg", name);
  for (const [key, value] of Object.entries(attrs)) {
    node.setAttribute(key, String(value));
  }
  return node;
}

function pathFrom(points) {
  return points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
    .join(" ");
}

function label(svg, attrs, text) {
  const node = svgEl("text", attrs);
  node.textContent = text;
  svg.appendChild(node);
}

function fillChips(rootId, items, isOn, onPick) {
  const root = el(rootId);
  if (root.dataset.ready) {
    root.querySelectorAll(".chip").forEach((button) => {
      button.setAttribute("aria-pressed", String(isOn(button.dataset.id)));
    });
    return;
  }
  root.dataset.ready = "1";
  for (const item of items) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "chip";
    button.dataset.id = item.id;
    button.textContent = item.label;
    button.addEventListener("click", () => onPick(item));
    root.appendChild(button);
  }
  fillChips(rootId, items, isOn, onPick);
}

function renderTray() {
  el("tray-age").textContent = String(state.age);
  el("tray-weight").textContent = `${Math.round(state.weightLb)} lb`;
  el("tray-dose").textContent = `${Math.round(state.doseMg)} mg`;
  el("tray-time").textContent = formatClock(parseClock(state.consume), true);

  document.querySelectorAll(".tray-item").forEach((button) => {
    button.setAttribute(
      "aria-pressed",
      String(button.dataset.sheet === state.sheet),
    );
  });

  const sheet = el("sheet");
  const scrim = el("scrim");
  if (state.sheet) {
    sheet.hidden = false;
    scrim.hidden = false;
    sheet.dataset.open = state.sheet;
  } else {
    sheet.hidden = true;
    scrim.hidden = true;
    delete sheet.dataset.open;
  }

  const ageFocused = document.activeElement === el("age-input");
  const weightFocused = document.activeElement === el("weight-input");
  const doseFocused = document.activeElement === el("dose-input");

  if (!ageFocused) el("age-input").value = String(state.age);
  if (!weightFocused)
    el("weight-input").value = String(Math.round(state.weightLb));
  if (!doseFocused) el("dose-input").value = String(Math.round(state.doseMg));
  el("age-range").value = String(state.age);
  el("weight-range").value = String(Math.round(state.weightLb));
  el("dose-range").value = String(clamp(state.doseMg, 0, 400));
  el("weight-kg").textContent = `${kgFromLb(state.weightLb).toFixed(0)} kg`;
  el("dose-meta").textContent = `${mgPerKg().toFixed(1)} mg/kg`;
  el("consume-display").textContent = formatClock(
    parseClock(state.consume),
    true,
  );
  el("bed-display").textContent = formatClock(parseClock(state.bedtime), true);
  el("consume-range").value = String(clockToMinutes(state.consume));
  el("bed-range").value = String(bedSliderMinutes(state.bedtime));

  fillChips(
    "age-chips",
    AGE_PRESETS,
    (id) => String(state.age) === id,
    (item) => {
      state.age = item.age;
      state.weightLb = typicalLb(state.age);
      render();
    },
  );
  fillChips(
    "weight-chips",
    WEIGHT_PRESETS,
    (id) => Math.round(state.weightLb) === Number(id),
    (item) => {
      state.weightLb = item.lb;
      render();
    },
  );
  fillChips(
    "drinks",
    DRINKS,
    (id) => id === state.drinkId,
    (item) => {
      state.drinkId = item.id;
      state.doseMg = item.mg;
      render();
    },
  );
  fillChips(
    "consume-chips",
    CONSUME_PRESETS,
    (id) => CONSUME_PRESETS.find((p) => p.id === id)?.time === state.consume,
    (item) => {
      state.consume = item.time;
      render();
    },
  );
  fillChips(
    "bed-chips",
    BED_PRESETS,
    (id) => BED_PRESETS.find((p) => p.id === id)?.time === state.bedtime,
    (item) => {
      state.bedtime = item.time;
      render();
    },
  );
}

function renderDoseChart() {
  const svg = el("dose-chart");
  svg.replaceChildren();
  el("dose-stamps").replaceChildren();
  svg.setAttribute("aria-valuenow", String(Math.round(state.doseMg)));
  svg.setAttribute(
    "aria-valuemax",
    String(Math.round(MAX_MGKG * kgFromLb(state.weightLb))),
  );
  svg.setAttribute("aria-valuetext", `${Math.round(state.doseMg)} milligrams`);

  const W = 840;
  const pad = { l: 16, r: 16, t: 36, b: 4 };
  const rowH = 36;
  const rowsTop = pad.t + 2;
  const H = rowsTop + EFFECTS.length * rowH + pad.b;
  svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
  const innerW = W - pad.l - pad.r;
  const xOf = (mgkg) => pad.l + (mgkg / MAX_MGKG) * innerW;
  const userX = clamp(mgPerKg(), 0, MAX_MGKG);
  const steps = 96;

  EFFECTS.forEach((effect, i) => {
    const top = rowsTop + i * rowH;
    const yOf = (v) => top + rowH - 7 - v * (rowH - 12);
    const window = activeWindow(effect.id);
    const points = [];
    const active = [];
    for (let s = 0; s <= steps; s += 1) {
      const x = (s / steps) * MAX_MGKG;
      const point = { x: xOf(x), y: yOf(effectAt(effect.id, x)) };
      points.push(point);
      const inside =
        window.on !== null &&
        x >= window.on &&
        (window.off === null || x <= window.off);
      if (inside) active.push(point);
    }
    const now = effectAt(effect.id, userX);
    const live = now >= 0.2;

    if (i > 0) {
      svg.appendChild(
        svgEl("line", {
          x1: pad.l,
          x2: W - pad.r,
          y1: top,
          y2: top,
          stroke: "rgba(244, 238, 228, 0.06)",
          "stroke-width": 1,
        }),
      );
    }
    svg.appendChild(
      svgEl("path", {
        d:
          pathFrom([
            ...points,
            { x: xOf(MAX_MGKG), y: yOf(0) },
            { x: xOf(0), y: yOf(0) },
          ]) + " Z",
        fill: effect.color,
        opacity: 0.07,
      }),
    );
    if (active.length > 1) {
      svg.appendChild(
        svgEl("path", {
          d:
            pathFrom([
              { x: active[0].x, y: yOf(0) },
              ...active,
              { x: active[active.length - 1].x, y: yOf(0) },
            ]) + " Z",
          fill: effect.color,
          opacity: live ? 0.34 : 0.2,
        }),
      );
    }
    svg.appendChild(
      svgEl("path", {
        d: pathFrom(points),
        fill: "none",
        stroke: effect.color,
        "stroke-width": 1.4,
        "stroke-linecap": "round",
        opacity: 0.35,
      }),
    );
    if (active.length > 1) {
      svg.appendChild(
        svgEl("path", {
          d: pathFrom(active),
          fill: "none",
          stroke: effect.color,
          "stroke-width": 2.2,
          "stroke-linecap": "round",
        }),
      );
    }
    if (window.on !== null) {
      svg.appendChild(
        svgEl("line", {
          x1: xOf(window.on),
          x2: xOf(window.on),
          y1: yOf(0),
          y2: yOf(effectAt(effect.id, window.on)),
          stroke: effect.color,
          "stroke-width": 1.2,
          opacity: 0.7,
        }),
      );
    }
    if (window.off !== null) {
      svg.appendChild(
        svgEl("line", {
          x1: xOf(window.off),
          x2: xOf(window.off),
          y1: yOf(0),
          y2: yOf(effectAt(effect.id, window.off)),
          stroke: effect.color,
          "stroke-width": 1.2,
          opacity: 0.7,
        }),
      );
    }
    svg.appendChild(
      svgEl("circle", {
        cx: xOf(userX),
        cy: yOf(now),
        r: live ? 4.4 : 3,
        fill: effect.color,
        stroke: "#14110e",
        "stroke-width": 1.4,
        opacity: now < 0.04 ? 0.25 : 1,
      }),
    );
    const stamp = document.createElement("div");
    stamp.className = "ridge-stamp";
    stamp.style.top = `${(top / H) * 100}%`;
    stamp.style.height = `${(rowH / H) * 100}%`;
    stamp.style.color = effect.color;
    stamp.style.opacity = live ? "0.58" : "0.3";
    const name = document.createElement("span");
    name.textContent = effect.label;
    stamp.append(name);
    el("dose-stamps").appendChild(stamp);
  });

  const axisY = rowsTop + EFFECTS.length * rowH;
  svg.appendChild(
    svgEl("line", {
      x1: xOf(userX),
      x2: xOf(userX),
      y1: 36,
      y2: axisY,
      stroke: "#f2c14e",
      "stroke-width": 1.8,
    }),
  );

  const pill = el("dose-pill");
  const pillX = clamp(xOf(userX), pad.l + 36, W - pad.r - 36);
  pill.textContent = `${Math.round(state.doseMg)} mg`;
  pill.style.left = `${(pillX / W) * 100}%`;

  const axis = el("dose-axis");
  axis.replaceChildren();
  for (let tick = 0; tick <= MAX_MGKG; tick += 2) {
    const mark = document.createElement("span");
    mark.textContent = String(tick);
    mark.style.left = `${(xOf(tick) / W) * 100}%`;
    axis.appendChild(mark);
  }
}

function renderClearChart() {
  const svg = el("clear-chart");
  svg.replaceChildren();

  const W = 840;
  const H = 220;
  const pad = { l: 20, r: 20, t: 22, b: 28 };
  const innerW = W - pad.l - pad.r;
  const innerH = H - pad.t - pad.b;
  const consumeH = parseClock(state.consume);
  const bedH = parseClock(state.bedtime);
  const toBed = hoursUntil(consumeH, bedH);
  const wake = toBed + 8;
  const quiet = sleepQuietMg();
  const crossing = quietCrossingHours();
  const yMax = Math.max(150, state.doseMg) * 1.08;
  const xOf = (t) => pad.l + (t / CLEAR_HOURS) * innerW;
  const yOf = (mg) => pad.t + (1 - mg / yMax) * innerH;
  const nightStart = toBed;
  const nightEnd = Math.min(wake, CLEAR_HOURS);
  const disturbedUntil = crossing <= toBed + 0.5 ? toBed : crossing;
  const allNight = !Number.isFinite(crossing) || crossing >= wake - 0.25;
  const clearBeforeBed = Number.isFinite(crossing) && crossing <= toBed + 0.5;

  const readout = el("sleep-readout");
  readout.replaceChildren();
  if (clearBeforeBed) {
    readout.append("Clear by ");
    const time = document.createElement("em");
    time.textContent = formatClock(
      roundHalfHourClock(consumeH + crossing),
      true,
    );
    readout.append(time, ", before bed");
  } else if (allNight) {
    readout.append("Sleep disturbed ");
    const time = document.createElement("em");
    time.textContent = "all night";
    readout.append(time);
  } else {
    readout.append("Sleep disturbed until ");
    const time = document.createElement("em");
    time.textContent = formatClock(
      roundHalfHourClock(consumeH + crossing),
      true,
    );
    readout.append(time);
  }

  if (nightStart < CLEAR_HOURS) {
    svg.appendChild(
      svgEl("rect", {
        x: xOf(nightStart),
        y: pad.t,
        width: xOf(nightEnd) - xOf(nightStart),
        height: innerH,
        fill: "rgba(126, 144, 206, 0.16)",
      }),
    );
    svg.appendChild(
      svgEl("line", {
        x1: xOf(nightStart),
        x2: xOf(nightStart),
        y1: pad.t,
        y2: pad.t + innerH,
        stroke: "rgba(255, 255, 255, 0.22)",
        "stroke-width": 1,
      }),
    );
    label(
      svg,
      {
        x: xOf(nightStart) + 8,
        y: pad.t + 14,
        fill: "rgba(244, 238, 228, 0.55)",
        "font-size": 11,
        "font-family": "Outfit, sans-serif",
        "font-weight": 600,
        "letter-spacing": "0.08em",
      },
      `SLEEP  ${formatClock(bedH, true)}–${formatClock(bedH + 8, true)}`,
    );
  }

  if (!clearBeforeBed && nightStart < CLEAR_HOURS) {
    const sliceEnd = Math.min(allNight ? wake : disturbedUntil, nightEnd);
    if (sliceEnd > nightStart) {
      svg.appendChild(
        svgEl("rect", {
          x: xOf(nightStart),
          y: pad.t,
          width: xOf(sliceEnd) - xOf(nightStart),
          height: innerH,
          fill: "rgba(255, 59, 48, 0.34)",
        }),
      );
    }
  }

  svg.appendChild(
    svgEl("line", {
      x1: pad.l,
      x2: pad.l + innerW,
      y1: yOf(quiet),
      y2: yOf(quiet),
      stroke: "rgba(255, 255, 255, 0.4)",
      "stroke-width": 1.2,
      "stroke-dasharray": "5 5",
    }),
  );

  const steps = 120;
  const points = [];
  for (let i = 0; i <= steps; i += 1) {
    const t = (i / steps) * CLEAR_HOURS;
    points.push({ x: xOf(t), y: yOf(amountAt(t, state.doseMg)) });
  }
  svg.appendChild(
    svgEl("path", {
      d: pathFrom(points),
      fill: "none",
      stroke: "#f2c14e",
      "stroke-width": 2.4,
      "stroke-linecap": "round",
    }),
  );

  const peakT = peakHours();
  const candidates = [
    { t: peakT, kind: "peak" },
    { t: halfLifeH(), kind: "half" },
    { t: nightStart, kind: "sleep" },
  ];
  const marks = [];
  for (const item of candidates) {
    if (!Number.isFinite(item.t) || item.t <= 0.15 || item.t > CLEAR_HOURS) {
      continue;
    }
    if (item.kind === "sleep" && nightStart >= CLEAR_HOURS) continue;
    marks.push({ ...item, mg: amountAt(item.t, state.doseMg) });
  }

  const markRoot = el("clear-marks");
  markRoot.replaceChildren();
  for (const item of marks) {
    const x = xOf(item.t);
    const y = yOf(item.mg);
    svg.appendChild(
      svgEl("circle", {
        cx: x,
        cy: y,
        r: 4.2,
        fill: "#f2c14e",
        stroke: "#181410",
        "stroke-width": 1.5,
      }),
    );
    const tag = document.createElement("span");
    tag.className = "clear-mark";
    tag.textContent = `${Math.round(item.mg)} mg`;
    tag.style.left = `${(x / W) * 100}%`;
    tag.style.top = `${(y / H) * 100}%`;
    markRoot.appendChild(tag);
  }

  const axis = el("clear-axis");
  axis.replaceChildren();
  for (let hour = 0; hour <= CLEAR_HOURS; hour += 4) {
    const clock = consumeH + hour;
    const mark = document.createElement("span");
    mark.textContent = formatClock(clock, true);
    mark.style.left = `${(xOf(hour) / W) * 100}%`;
    if (hour === 0) mark.dataset.edge = "start";
    if (hour === CLEAR_HOURS) mark.dataset.edge = "end";
    axis.appendChild(mark);
  }
}

function setNote(id, text) {
  const node = document.querySelector(`[data-note="${id}"]`);
  if (node) node.textContent = text;
}

function renderNotes() {
  const lead = el("notes-lead");
  if (lead) {
    lead.textContent = `mg below are for ${state.age} y, ${Math.round(state.weightLb)} lb`;
  }

  const a = NOTE_MGKG.alertness;
  setNote(
    "alertness",
    `You feel more awake from about ${noteMg(a.from)} to ${noteMg(a.to)} mg, then extra dose adds little. Higher dose does not make you less awake.`,
  );

  const c = NOTE_MGKG.cognition;
  setNote(
    "cognition",
    `Focus and reaction time get better around ${noteMg(c.betterLo)}–${noteMg(c.betterHi)} mg. By ~${noteMg(c.memoryFail)} mg, memory holds less — shorter digit spans — even though you still feel sharp.`,
  );

  const e = NOTE_MGKG.endurance;
  setNote(
    "endurance",
    `Aerobic work starts improving around ${noteMg(e.startLo)}–${noteMg(e.startHi)} mg, then more dose does not buy more output. Same from ${noteMg(e.flatA)} through ${noteMg(e.flatB)} mg; ${noteMg(e.less)} mg does not add more.`,
  );

  const p = NOTE_MGKG.power;
  setNote(
    "power",
    `Light, fast lifts get faster around ${noteMg(p.light)} mg. Near-max lifts get faster around ${noteMg(p.nearMax)} mg — the heavy ones wait.`,
  );

  setNote(
    "speed",
    `A quicker first step is alertness — you catch the cue sooner, but the muscle fires no faster. Jump and bar speed are power. Staying quick late in a match is endurance. A short sprint is usually untouched.`,
  );

  const m = NOTE_MGKG.mood;
  setNote(
    "mood",
    `A bit more cheerful around ${noteMg(m.goodLo)}–${noteMg(m.goodHi)} mg — a lift, not a rush. Around ${noteMg(m.turnDown)} mg that lift is gone. By ~${noteMg(m.tense)} mg it is tense and not pleasant.`,
  );

  const j = NOTE_MGKG.jitters;
  setNote(
    "jitters",
    `A little shake starts around ${noteMg(j.little)} mg. By ~${noteMg(j.bigger)} mg holding steady for something like threading a needle gets hard, as you get more awake.`,
  );

  setNote(
    "anxiety",
    `Tension shows up around ${noteMg(anxietyMgkg("some"))} mg in some people, not most. By ~${noteMg(anxietyMgkg("most"))} mg most people get tense.`,
  );

  const h = heartMarks();
  const heartBody = `Blood pressure ticks up from about ${noteMg(h.bpLo)} to ${noteMg(h.bpHi)} mg, and the resting pulse often slows a little. Extra beats — a skip or a thump — pick up around ${noteMg(h.ectopy)} mg.`;
  setNote("heart", heartBody);

  const peakMin = Math.round((peakHours() * 60) / 5) * 5;
  setNote(
    "uptake",
    `Most of a morning coffee is in your blood within about 45 minutes. The amount in you usually peaks around ${peakMin} minutes at this age — a little under what you swallowed, because clearance has already started. A meal can push that toward an hour and a half.`,
  );

  const hl = noteHours(halfLifeH());
  const decay =
    state.age >= 18
      ? `Caffeine halves about every ${hl} hours. Newborns are much slower.`
      : `Caffeine halves about every ${hl} hours at age ${state.age}, every 5 hours in adults. Newborns are much slower.`;
  setNote("decay", decay);

  setNote(
    "quiet",
    `Sleep usually looks normal below about ${noteMg(NOTE_MGKG.quiet)} mg leftover at this weight. About ${NOTE_MGKG.landoltLeftMg} mg leftover cut sleep in young men ~70 kg.`,
  );
}

function render() {
  renderTray();
  renderDoseChart();
  renderClearChart();
  renderNotes();
}

function applyDoseFromEvent(event) {
  const svg = el("dose-chart");
  const box = svg.getBoundingClientRect();
  const padL = 16;
  const padR = 16;
  const W = 840;
  const innerW = W - padL - padR;
  const t = (event.clientX - box.left) / box.width;
  const svgX = t * W;
  const mgkg = clamp((svgX - padL) / innerW, 0, 1) * MAX_MGKG;
  state.doseMg = Math.round(mgkg * kgFromLb(state.weightLb));
  matchDrink();
  render();
}

function shiftAge(delta) {
  state.age = clamp(state.age + delta, 8, 80);
  state.weightLb = typicalLb(state.age);
  render();
}

function shiftWeight(delta) {
  state.weightLb = clamp(state.weightLb + delta, 40, 400);
  render();
}

function shiftDose(delta) {
  state.doseMg = clamp(state.doseMg + delta, 0, 800);
  matchDrink();
  render();
}

function shiftConsume(delta) {
  state.consume = minutesToClock(
    clamp(clockToMinutes(state.consume) + delta, 300, 1320),
  );
  render();
}

function shiftBed(delta) {
  state.bedtime = minutesToClock(
    clamp(bedSliderMinutes(state.bedtime) + delta, 1080, 1560),
  );
  render();
}

function closeMenus() {
  state.sheet = null;
  el("app-menu").hidden = true;
  el("app-toggle").setAttribute("aria-expanded", "false");
  render();
}

function bind() {
  document.querySelectorAll("[data-flip]").forEach((button) => {
    button.addEventListener("click", () => {
      const panel = el(button.dataset.flip);
      const open = panel.classList.toggle("is-flipped");
      button.setAttribute("aria-expanded", String(open));
      button.textContent = open ? "×" : "?";
      button.setAttribute(
        "aria-label",
        open ? "Close notes" : button.dataset.label,
      );
    });
  });

  const svg = el("dose-chart");
  svg.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    drag.live = true;
    svg.setPointerCapture(event.pointerId);
    applyDoseFromEvent(event);
  });
  svg.addEventListener("pointermove", (event) => {
    if (!drag.live) return;
    applyDoseFromEvent(event);
  });
  const endDrag = () => {
    drag.live = false;
  };
  svg.addEventListener("pointerup", endDrag);
  svg.addEventListener("pointercancel", endDrag);

  document.querySelectorAll(".tray-item").forEach((button) => {
    button.addEventListener("click", () => {
      const next = button.dataset.sheet;
      state.sheet = state.sheet === next ? null : next;
      el("app-menu").hidden = true;
      el("app-toggle").setAttribute("aria-expanded", "false");
      render();
    });
  });

  el("scrim").addEventListener("click", closeMenus);
  el("app-toggle").addEventListener("click", () => {
    const menu = el("app-menu");
    const open = menu.hidden;
    menu.hidden = !open;
    el("app-toggle").setAttribute("aria-expanded", String(open));
    if (open) {
      state.sheet = null;
      render();
    }
  });

  el("age-down").addEventListener("click", () => shiftAge(-1));
  el("age-up").addEventListener("click", () => shiftAge(1));
  el("age-range").addEventListener("input", (event) => {
    state.age = Number(event.target.value);
    state.weightLb = typicalLb(state.age);
    render();
  });
  el("age-input").addEventListener("input", (event) => {
    const next = Number(event.target.value);
    if (!Number.isFinite(next)) return;
    state.age = clamp(Math.round(next), 8, 80);
    state.weightLb = typicalLb(state.age);
    render();
  });

  el("weight-down").addEventListener("click", () => shiftWeight(-1));
  el("weight-up").addEventListener("click", () => shiftWeight(1));
  el("weight-range").addEventListener("input", (event) => {
    state.weightLb = Number(event.target.value);
    render();
  });
  el("weight-input").addEventListener("input", (event) => {
    const next = Number(event.target.value);
    if (!Number.isFinite(next) || next <= 0) return;
    state.weightLb = clamp(next, 40, 400);
    render();
  });

  el("dose-down").addEventListener("click", () => shiftDose(-5));
  el("dose-up").addEventListener("click", () => shiftDose(5));
  el("dose-range").addEventListener("input", (event) => {
    state.doseMg = Number(event.target.value);
    matchDrink();
    render();
  });
  el("dose-input").addEventListener("input", (event) => {
    const next = Number(event.target.value);
    if (!Number.isFinite(next) || next < 0) return;
    state.doseMg = clamp(next, 0, 800);
    matchDrink();
    render();
  });

  el("consume-down").addEventListener("click", () => shiftConsume(-15));
  el("consume-up").addEventListener("click", () => shiftConsume(15));
  el("consume-range").addEventListener("input", (event) => {
    state.consume = minutesToClock(Number(event.target.value));
    render();
  });
  el("bed-down").addEventListener("click", () => shiftBed(-15));
  el("bed-up").addEventListener("click", () => shiftBed(15));
  el("bed-range").addEventListener("input", (event) => {
    state.bedtime = minutesToClock(Number(event.target.value));
    render();
  });
}

bind();
render();
