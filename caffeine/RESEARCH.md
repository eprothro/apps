# Caffeine — research and on-screen notes

Sole working doc for this app. Science, landmarks, and flip-card voice live here. Copy on the card is generated in `app.js` (`NOTE_MGKG` + `renderNotes`).

Dose–response is plotted in **mg/kg**. Sleep is remaining caffeine at lights-out, not a dose ridge. Published mg is converted at the study’s stated mass; if unstated, **70 kg is assumed** and marked.

**Do not** treat AAP / EFSA / Health Canada intake limits as effect data. Age-adjust only when a study measured a pharmacodynamic difference at matched mg/kg.

## Half-life (not an effect ridge)

School-age kids clear **faster** than adults. The multi-day half-life is **neonates** (CYP1A2 off).

| Age       | t½               | Source                                            |
| --------- | ---------------- | ------------------------------------------------- |
| Neonate   | 50–100 h         | FDA Cafcit; Aranda 1979, preterm                  |
| ~6 months | ~3 h             | Aranda 1979; EFSA 2015                            |
| 3–12      | ~3–4 h           | EFSA 2015; caffeine breath test faster than adult |
| ~13       | ~4 h             | interpolated                                      |
| Adult     | ~5 h (2–8)       | EFSA 2015                                         |
| 65+       | ~5 h, no slowing | Blanchard & Sawers 1983, ~20 y vs ~71 y men       |

Smoking, pregnancy, oral contraceptives, CYP1A2 genotype move adult t½ more than age.

## Ridges (8)

### alertness — saturating rise, no fall

Competitive A1/A2A block. Occupancy saturates; you do not get less awake.

- Elmenhorst 2012, _J Nucl Med_: PET, healthy men ~25–35 y. A1 occupancy saturating; ~50% near plasma that corresponds to a large adult oral dose.
- Lieberman 2002, men ~24: alerting in the ~100–200 mg adult range (card uses 90–180 mg @70 kg → 1.3–2.6 mg/kg).
- Kaplan 1997, _J Clin Pharmacol_, N=12 adults ~21–35 y: 250 vs 500 mg (~3.6 vs 7.1 mg/kg @70kg). Arousal held at 500 while mood/motor fell.
- Rogers 2010, _Neuropsychopharmacology_, N=379 adults ~18–50 y: alerting dissociable from anxiety.

**Model:** Hill, d50 ≈ 1.0–1.5, n ≈ 1.5. Same mg/kg at all ages.

### cognition — inverted-U (high-load)

Vigilance/RT keep looking good longer. Working memory and harder tasks fail first. Plot the **load-weighted** composite so the downhill is real.

- Childs & de Wit 2006, _Psychopharmacology_, N=102 light users, adults ~18–35 y: 50 / 150 / 450 mg (~0.7 / 2.1 / 6.4 mg/kg @70kg). Vigilance hits up at 150 and 450; a memory task **impaired** at 450.
- Kaplan 1997: digit-symbol and tapping **better at 250 than 500 mg**.
- McLellan, Caldwell & Lieberman 2016 review: adult military/athlete samples, 3–6 mg/kg often cited as useful window; >6 no added benefit.

**Landmarks (adult mg/kg):** onset ~0.5, peak ~2.5, high-load failure from ~4, baseline ~6.5, clear impairment ≥8.

**Model:** benefit Hill minus cost Hill (not a wide Gaussian — those hide the fall). **No youth left-shift** (no multi-dose adolescent cognition series).

### endurance — rise, then hard plateau

Time-trial / aerobic. Ceiling ~3 mg/kg; 9 mg/kg does not buy more and adds side effects.

- Southward, Rutherfurd-Markwick & Ali 2018, _Sports Med_, ~46 trials, mostly trained men ~20–30 y, ~70–75 kg: ~2–4% TT; **no dose-response inside 3–6 mg/kg**.
- Graham & Spriet 1995, _J Appl Physiol_, N=8 trained men ~20s: 3 / 6 / 9 mg/kg — 9 no extra performance.
- Guest et al. 2021 ISSN position stand, adults: 3–6 mg/kg.

**Model:** Steep Hill, **plateau by ~3**. 3 ≈ 6. Soft fade only after ~9 (no extra, not a crash). Same mg/kg all ages. Do not keep climbing 3→6.

### power — lift speed (bar velocity), two steps

Not sprint speed. Pallarés measured **mean propulsive velocity** (and power = force × velocity) on squat and bench. Light loads and heavy loads are different doses.

- Pallarés 2013, _MSSE_, N=13 resistance-trained men, mean ~25 y: 0 / 3 / 6 / 9 mg/kg. **3 mg/kg** already maxes 25–50% 1RM velocity (6 and 9 add nothing there). **6 mg/kg** for 75% 1RM. **9 mg/kg** for 90% 1RM and cycling peak power. 9 also raised tachycardia / insomnia / anxiety (other ridges).

**Model:** two sigmoids — step at ~2.6 (light lifts), step at ~7 (heavy). Not a smooth Hill. No 1–2–4–5 mg/kg series; do not invent a gradual climb. Same mg/kg all ages.

### mood — inverted-U, cheer / liking (not vigor)

Vigor/arousal stay up at 450–500 — that is **alertness**. This ridge is mild cheer, pleasantness, liking. Wanting did not track. Classic euphoria (ARCI MBG) is weak vs amphetamine.

- Childs & de Wit 2006, _Psychopharmacology_, N=102 light users, 18–35 y: 50 / 150 / 450 mg. 150 ↑ positive mood / stimulated; 50 barely moved mood; 450 ↑ anxiety, less liking.
- Kaplan 1997: 250 elation / peacefulness / pleasantness; 500 dysphoric. Arousal **held** at 500.
- Griffiths & Woodson 1988: 300 mg (~4.3 mg/kg @70kg) chosen **below chance**.

**Model:** pulse/inverted-U, peak ~2.2 (Childs 150), still pleasant at Kaplan 250 (~3.6), liking gone by ~4.5–5. Same mg/kg all ages. On-screen onset **150 not 50**.

### jitters — fine motor / tremor (cost)

Not endurance. Peripheral tremor. Detectable ~1 mg/kg, obvious by ~3.5.

- Richardson, Rogers, Elliman & O'Dell 1995, _PBB_: adults, ~70 vs ~250 mg (~1.0 vs 3.6 mg/kg @70kg). Hand steadiness **worse** as alertness **improved**. Confirm N/protocol if we cite on-screen.
- Kaplan 1997: finger tapping better at 250 than 500 mg.

**Model:** sigmoid, mid ~2.6 so ~1 mg/kg is a small visible rise (Richardson 70 mg). Obvious by ~3.5. Same mg/kg all ages.

### anxiety — tension (cost)

Sigmoid. 150 mg mostly ADORA2A-sensitive; 450 mg most people.

- Childs & de Wit 2006, adults 18–35 y, 450 mg (~6.4 mg/kg).
- Rogers 2010, N=379 adults: 150 mg (~2.1 mg/kg) anxiety in TT homozygotes; habitual use blunts.

**Youth:** no matched adolescent anxiety curve. Modest left-shift is **inferred** (kids are usually low-habitual), not measured. Label it that way if we ever surface it.

### heart — BP up, pulse down, then ectopy (cost)

Two steps. Not a racing-heart climb.

1. **Hemodynamic step at 1–2 mg/kg** — BP +~3–6 / +2–5 mmHg, resting HR **down**. Temple **1 = 2** (do not slope 1→2→3).
2. **Ectopy mark at ~3 mg/kg** — extra beats. Evidence is **energy-drink Holter**, not caffeine-only.

- Temple 2014, _Pediatrics_: 8–9 y and 15–17 y, caffeine-only **1 and 2 mg/kg**. BP up, HR down, same size both doses. Checklist “heart racing / irregular” **did not move**. Larger swing in post-pubertal boys.
- Temple 2010, 12–17 y, 50 / 100 / 200 mg: dose-dependent HR down / DBP up **in boys**.
- Turley 2008, _MSSE_, 7–9 y, 1 / 3 / 5 mg/kg: HR **~5–6 bpm lower at 3 and 5**, including easy cycling. 1 mg/kg weaker for HR.
- Turley & Gerst 2007: boys HR down at 5 mg/kg rest and work; **men HR unchanged**.
- Oberhoffer 2022, _Front Cardiovasc Med_, mean 14.5, ED **3 mg/kg**: SBP +3–5 mmHg; HR tended lower.
- Mandilaras 2022, _Cells_ 11:498, same Munich RCT: SVES rate ratio **1.70**; HR −2.7 bpm; no SVT / malignant VT; **no QTc change**. Taurine/ED matrix confound.
- Pallarés 2013: adult lifters, **self-report** tachycardia ~23% at **9 mg/kg**. No youth RCT at 6–9. Do **not** add a third youth tachycardia step.

**Model:** early steep Hill (on by 1, flat through 2) + later sigmoid (~3 youth / ~4.4 adult) for ectopy. No climb through 10 as if hemodynamics keep worsening.

**Youth left-shift is justified** (matched mg/kg, measured).

## Why endurance, power, and tremor are three ridges

|           | Shape                    | At 9 mg/kg     | Sign    | Site                                |
| --------- | ------------------------ | -------------- | ------- | ----------------------------------- |
| endurance | plateau from ~3          | no more gain   | benefit | central / RPE                       |
| power     | two steps (~3 then ~7–9) | heavy lifts on | benefit | bar velocity / high-threshold units |
| jitters   | monotone worse           | worse          | cost    | peripheral tremor                   |

One “athletic” ridge cannot hold a plateau, a late rise, and a cost.

## Why there is no speed ridge

“Faster” is already on the card as three ridges. Do **not** add a ninth curve.

- Simple RT / first step = **alertness**. Saville 2018: gain is stimulus-locked; motor time unchanged. The twitch is not faster.
- Choice RT = **cognition** (already says “reaction time”).
- Jump / bar velocity / RFD / Wingate peak = **power**.
- Late-match speed = **endurance**. Christensen 2017 “maximal speed” ES 0.41 is tests lasting **45 s–8 min**, not a sprint.
- **20–30 m sprint time** is usually untouched (Salinero 2019 barely above zero; other metas null). Surprising; say it on the Speed fact, not as its own ridge.

No age-13 speed series. Same mg/kg as the parent ridges. Speed is a **fact only** — a mapping dt after Power, no ridge.

## Sleep (clearance chart)

Not a dose ridge. **Remaining mg/kg at lights-out.**

- Landolt 1995, _Brain Res_, young men ~20–30 y, ~70–75 kg: 200 mg at ~07:00, bed ~16 h later. Residual ~22 mg at t½=5 h (~0.30 mg/kg) to ~31 mg at t½=6 h. **TST and efficiency still down.**
- Gardiner 2023, _Sleep Med Rev_, 24 trials: TST −0.2 min per extra 1 mg dose; no breakpoint. Cut-offs back-calculate to ~0.45 mg/kg residual in a 70 kg adult.

**Quiet line:** **0.28 mg/kg remaining** — just under Landolt’s demonstrated residual in ~70 kg men (~20 mg). That is 18–20 mg for a typical adult, ~13 mg at 101 lb. Do **not** reuse 18 mg as an absolute for a smaller body (that would be ~0.39 mg/kg, inside the Landolt band).

Red fill on the part of the night still above the dotted quiet line. No sliding label on the line — it sat on the time axis at typical doses.

## Uptake (clearance chart rise)

Bateman curve. `KA = 4 /h` (absorption t½ ~10 min). Tmax = ln(KA/k)/(KA−k) ≈ **50 min** at age 13, ~52 min adult.

- Bonati 1982: oral solution, ~99% absorbed by 45 min.
- Liguori 1997, N=13, 400 mg: coffee Tmax **42 min**, cola **39**, capsule **67**.
- Brachtel & Richter 1988: fasted tablet Tmax **46 min** (KA ~7); **meal ~91 min** (KA ~2).
- White 2016, 18–30 y, 160 mg: coffee **59–64 min**.

No youth KA series that changes the rise. Faster kid clearance moves Tmax by a few minutes only. Do not age-adjust KA. A meal is the wrinkle, not the default.

## Age-adjustment rules

Plotting in mg/kg already removes body size.

| Effect                                                | Youth vs adult mg/kg                                                    |
| ----------------------------------------------------- | ----------------------------------------------------------------------- |
| alertness, cognition, endurance, power, mood, jitters | **same curve** — no youth multi-dose series                             |
| anxiety                                               | **small left-shift**, inferred from low habitual use (Rogers)           |
| heart                                                 | **left-shift**, Temple 2014                                             |
| sleep                                                 | **same 0.28 mg/kg** remaining; half-life handles how fast you get there |
| clearance t½                                          | **shorter** in school-age, not longer                                   |

Shorter t½ means smaller AUC at matched mg/kg. Do not also left-shift time-integrated effects.

## Axis

Dose x-axis **0–10 mg/kg**. Past ~9–10 the story is already “costs up, endurance flat, power maybe still up.”

## Flip cards

Key first, then a wrinkle. Cites last. Facts, not chart colors, dotted lines, or coral. No policy ceilings. No “side effects” leftover on a benefit ridge (those are other ridges). Units on the card are **mg at the current tray age/weight**.

`mg = landmark mg/kg × current kg`, rounded to 5. Adult-paper mg is stored as `studyMg / 70` unless the paper stated mass. Age stretches **anxiety** (× 3.7/4.5 if age < 18) and **heart** only. Half-life uses age. Quiet line is **0.28 mg/kg** remaining. Landolt’s “~25 mg left in ~70 kg men” stays a study fact and does not scale.

### Landmarks (`NOTE_MGKG`)

| Effect      | Marks                                        | Source                                |
| ----------- | -------------------------------------------- | ------------------------------------- |
| alertness   | 90→1.3, 180→2.6 @70 kg                       | Hill steep-then-flat; Lieberman-range |
| cognition   | 180 / 250 / 450 @70 kg                       | Kaplan 250; Childs 450 memory         |
| endurance   | 2, 3, 6, 9                                   | Graham & Spriet; Southward            |
| power       | 3, 9                                         | Pallarés light vs 75–90% 1RM          |
| mood        | 150 / 250 / 300 / 450 @70 kg                 | Childs 150 cheer; Kaplan; Griffiths   |
| jitters     | 70 / 250 @70 kg                              | Richardson                            |
| anxiety     | 50 / 150 / 450 @70 kg; × 3.7/4.5 if age < 18 | Childs; Rogers                        |
| heart < 18  | 1, 2, 3                                      | Temple; Mandilaras                    |
| heart adult | 2, 3, 4.4                                    | same shape, later (model)             |
| quiet       | 0.28 remaining                               | just under Landolt residual           |

### Voice

`{n}` is that landmark in mg at the current weight.

**Alertness.** You feel more awake from about {from} to {to} mg, then extra dose adds little. Higher dose does not make you less awake. — Lieberman 2002, men ~24. Childs & de Wit 2006, adults 18–35.

**Cognition.** Focus and reaction time get better around {betterLo}–{betterHi} mg. By ~{memoryFail} mg, memory holds less — shorter digit spans — even though you still feel sharp. — Childs & de Wit 2006, adults 18–35. Kaplan 1997.

**Endurance.** Aerobic work starts improving around {startLo}–{startHi} mg, then more dose does not buy more output. Same from {flatA} through {flatB} mg; {less} mg does not add more. — Graham & Spriet 1995, men ~20s. Southward 2018.

**Power.** Light, fast lifts get faster around {light} mg. Near-max lifts get faster around {nearMax} mg — the heavy ones wait. — Pallarés 2013, men ~25.

**Speed.** A quicker first step is alertness — you catch the cue sooner, but the muscle fires no faster. Jump and bar speed are power. Staying quick late in a match is endurance. A short sprint is usually untouched. — Saville 2018. Salinero 2019. Christensen 2017. Mapping fact, no ridge, no extra dose window.

**Mood.** A bit more cheerful around {goodLo}–{goodHi} mg — a lift, not a rush. Around {turnDown} mg that lift is gone. By ~{tense} mg it is tense and not pleasant. — Childs & de Wit 2006. Kaplan 1997. Griffiths, adults.

**Jitters.** A little shake starts around {little} mg. By ~{bigger} mg holding steady for something like threading a needle gets hard, as you get more awake. — Richardson 1995, adults.

**Anxiety.** Tension shows up around {some} mg in some people, not most. By ~{most} mg most people get tense. — Childs & de Wit 2006. Childs 2008. Rogers 2010, adults.

**Heart.** Blood pressure ticks up from about {bpLo} to {bpHi} mg, and the resting pulse often slows a little. Extra beats — a skip or a thump — pick up around {ectopy} mg. — Temple 2014. Mandilaras 2022. Turley 2008.

**Uptake.** Most of a morning coffee is in your blood within about 45 minutes. The amount in you usually peaks around {peak} minutes at this age — a little under what you swallowed, because clearance has already started. A meal can push that toward an hour and a half. — Bonati 1982. Liguori 1997. Brachtel 1988.

**Metabolism rate.** Caffeine halves about every {t½} hours at this age, every 5 hours in adults. Newborns are much slower. Adults: every {t½} hours, no “vs adults” clause. — EFSA 2015. Aranda 1979.

**Sleep disturbance.** Sleep usually looks normal below about {quiet} mg leftover at this weight. About 25 mg leftover cut sleep in young men ~70 kg. — Landolt 1995, young men ~70 kg.
