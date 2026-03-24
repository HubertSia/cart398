const strudelReady = initStrudel();

const loadSamples = async () => {
  await strudelReady;
  await samples('github:tidalcycles/dirt-samples');
};

let bdMuted = false;
let melMuted = false;
let currentCps = 0.03;

const buildPatch = () => `
  setcps(130/60/5)


  $: note("<[d3 d3 c3 c3] [f3 f3 g2]  >*2 <[c3 c2 g3 f3] [d3 d3 e3 f3] >*2 ")
    .sound("gm_lead_3_calliope")
    .scale("e:major")
    .gain(0.5)
    .firstOf(4, x=>x.rev())

$: note("<[g3 f3 e3 d3] [f3 e3 d3 c3] f3 d3 e3 >*2 < a3 g3 f3 e3 [d3 e3 f3 g3] [c3 d3 e3 f3] d3 e3 f3 >*2")
  .sound("gm_electric_guitar_clean")
  .gain(0.5)
  .firstOf(4, x=>x.rev())


$: n("< 1 3 3 1 2 2 5>*8")
  .scale("e:major")
  .s("gm_piano")
  .gain(0.5)
  .fast(2)
  .lpf(300)
  .gain(0.7)
  .lpenv("<4 3 2>*4")
  .firstOf(5, x=>x.rev())  


  $: s("cp").struct("{1 0 0 1 0 1 0 0}%8")
    .gain(0.5)
    .firstOf(10, x=>x.rev())

  .play()
  `;

const playPattern = async () => {
  await loadSamples();
  hush();
  const patch = buildPatch();
  window.evaluate?.(patch) ?? window.evalStrudel?.(patch) ?? (0, eval)(patch);
};

const toggleBd = () => {
  bdMuted = !bdMuted;
  return bdMuted;
};

const toggleMel = () => {
  melMuted = !melMuted;
  return melMuted;
};

const stopPattern = () => hush();

const setTempo = (cps) => {
  currentCps = cps;
  return playPattern();
};

window.strudelControls = {
  playPattern,
  stopPattern,
  toggleBd,
  toggleMel,
  setTempo,
};
