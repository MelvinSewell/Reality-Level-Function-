console.log("Reality Level Analyzer v2 active");

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("analyzerForm");
  const presetSelect = document.getElementById("presetSelect");
  const output = document.getElementById("results");
  const levelLabel = document.getElementById("realityLabel");
  const summaryText = document.getElementById("realitySummary");
  const indexOutput = document.getElementById("indexOutput");

  const traitIds = [
    "causal", "narrative", "multiversal", "logic", "resistance",
    "power", "dimension", "entity", "temporal", "aesthetic"
  ];

  const weights = {
    causal: 2.0,
    narrative: 2.0,
    multiversal: 1.5,
    logic: 1.5,
    resistance: 1.0,
    power: 1.0,
    dimension: 1.0,
    entity: 0.8,
    temporal: 0.8,
    aesthetic: 0.5
  };

  const presets = [
    { id: "trueflow", name: "TrueFlow Universe", rl: "Ω", noi: 0, fqi: 1, rai: 1 },
    { id: "earth", name: "Baseline Earth (Modern)", rl: "5", noi: 1, fqi: 0, rai: 0 },
    { id: "dragonball", name: "Dragon Ball Multiverse", rl: "3", noi: 0, fqi: 0, rai: 1 },
    { id: "looneyverse", name: "Looneyverse", rl: "1", noi: 0, fqi: 0, rai: 0 },
    { id: "marvel", name: "Marvel Universe (Earth-616)", rl: "4", noi: 0, fqi: 0, rai: 1 },
    { id: "dc", name: "DC Multiverse (Prime Earth)", rl: "4", noi: 0, fqi: 0, rai: 1 },
    { id: "ultraman", name: "Ultraman Universe", rl: "3", noi: 0, fqi: 0, rai: 0 },
    { id: "hoyoverse", name: "Hoyoverse (Teyvat/Honkai)", rl: "3", noi: 0, fqi: 0, rai: 0 }
  ];

  // Populate preset dropdown
  presets.forEach(preset => {
    const opt = document.createElement("option");
    opt.value = preset.id;
    opt.textContent = preset.name;
    presetSelect.appendChild(opt);
  });

  // Load preset traits when selected
  presetSelect.addEventListener("change", () => {
    const selected = presets.find(p => p.id === presetSelect.value);
    if (selected) {
      traitIds.forEach(id => {
        const input = document.getElementById(id);
        input.value = 5; // Reset sliders to midpoint (optional)
      });
      form.dataset.rl = selected.rl;
      form.dataset.noi = selected.noi;
      form.dataset.fqi = selected.fqi;
      form.dataset.rai = selected.rai;
    } else {
      form.dataset.rl = "";
      form.dataset.noi = "";
      form.dataset.fqi = "";
      form.dataset.rai = "";
    }
  });

  form.addEventListener("submit", e => {
    e.preventDefault();

    const presetRL = form.dataset.rl;
    const noi = parseInt(form.dataset.noi || "0");
    const fqi = parseInt(form.dataset.fqi || "0");
    const rai = parseInt(form.dataset.rai || "0");

    let rl = presetRL;
    let score = 0;

    if (!rl) {
      traitIds.forEach(id => {
        const val = parseFloat(document.getElementById(id).value);
        const weight = weights[id] || 1;
        score += val * weight;
      });
      const rounded = Math.round(score);
      rl = estimateLevel(rounded);
    }

    levelLabel.textContent = rl;
    summaryText.textContent = describeLevel(rl);

    indexOutput.innerHTML = `
      <strong>Narrative Origin Index:</strong> ${noi ? "True" : "False"}<br>
      <strong>Foundational Qualifier Index:</strong> ${fqi ? "Qualified" : "Unqualified"}<br>
      <strong>Reality Authority Index:</strong> ${rai ? "Active" : "Inactive"}
    `;

    output.hidden = false;
  });

  function estimateLevel(score) {
    if (score >= 118) return "Ω";
    if (score >= 95) return "5";
    if (score >= 75) return "4";
    if (score >= 55) return "3";
    if (score >= 35) return "2";
    return "1";
  }

  function describeLevel(level) {
    switch (level) {
      case "Ω": return "Supreme structuring authority. Origin of simulated law.";
      case "5": return "Narrative governing system with universal coherence.";
      case "4": return "Multiversal platform with structured logical depth.";
      case "3": return "Fictional realm with consistent internal rules.";
      case "2": return "Stylized or unstable reality construct.";
      case "1": return "Surreal construct. Logic, physics, and narrative are fluid.";
      default: return "Reality signature unclear.";
    }
  }
});
