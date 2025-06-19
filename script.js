console.log("Reality Level Analyzer v2.3 visual upgrade initialized");

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("analyzerForm");
  const presetSelect = document.getElementById("presetSelect");
  const output = document.getElementById("results");
  const levelLabel = document.getElementById("realityLabel");
  const summaryText = document.getElementById("realitySummary");
  const indexOutput = document.getElementById("indexOutput");
  const glyphCanvas = document.getElementById("realityGlyph");
  let radarChart = null;

  const traitIds = [
    "causal", "narrative", "multiversal", "logic", "resistance",
    "power", "dimension", "entity", "temporal", "aesthetic"
  ];

  const weights = {
    causal: 2.0, narrative: 2.0, multiversal: 1.5, logic: 1.5,
    resistance: 1.0, power: 1.0, dimension: 1.0, entity: 0.8,
    temporal: 0.8, aesthetic: 0.5
  };

  const presets = [
    {
      id: "trueflow",
      name: "TrueFlow Universe",
      rl: "Ω", noi: 0, fqi: 1, rai: 1,
      traits: { causal: 10, narrative: 10, multiversal: 10, logic: 10, resistance: 7, power: 10, dimension: 10, entity: 10, temporal: 9, aesthetic: 10 }
    },
    {
      id: "earth",
      name: "Baseline Earth (Modern)",
      rl: "5", noi: 1, fqi: 0, rai: 0,
      traits: { causal: 10, narrative: 6, multiversal: 2, logic: 6, resistance: 6, power: 1, dimension: 3, entity: 7, temporal: 2, aesthetic: 6 }
    },
    {
      id: "dragonball",
      name: "Dragon Ball Multiverse",
      rl: "3", noi: 0, fqi: 0, rai: 1,
      traits: { causal: 5, narrative: 5, multiversal: 8, logic: 4, resistance: 6, power: 10, dimension: 7, entity: 8, temporal: 6, aesthetic: 6 }
    },
    {
      id: "looneyverse",
      name: "Looneyverse",
      rl: "1", noi: 0, fqi: 0, rai: 0,
      traits: { causal: 1, narrative: 3, multiversal: 7, logic: 2, resistance: 8, power: 5, dimension: 4, entity: 4, temporal: 7, aesthetic: 9 }
    },
    {
      id: "gtav",
      name: "San Andreas Metaverse (GTA V)",
      rl: "3", noi: 0, fqi: 0, rai: 0,
      traits: { causal: 7, narrative: 6, multiversal: 2, logic: 5, resistance: 3, power: 2, dimension: 2, entity: 4, temporal: 3, aesthetic: 9 }
    },
    {
      id: "marvel",
      name: "Marvel Universe (Earth-616)",
      rl: "4", noi: 0, fqi: 0, rai: 1,
      traits: { causal: 7, narrative: 7, multiversal: 8, logic: 6, resistance: 6, power: 9, dimension: 8, entity: 8, temporal: 6, aesthetic: 7 }
    },
    {
      id: "dc",
      name: "DC Multiverse (Prime Earth)",
      rl: "4", noi: 0, fqi: 0, rai: 1,
      traits: { causal: 8, narrative: 7, multiversal: 9, logic: 6, resistance: 6, power: 10, dimension: 9, entity: 9, temporal: 7, aesthetic: 7 }
    },
    {
      id: "hoyoverse",
      name: "Hoyoverse (Teyvat / Honkai)",
      rl: "3", noi: 0, fqi: 0, rai: 0,
      traits: { causal: 5, narrative: 6, multiversal: 7, logic: 4, resistance: 5, power: 7, dimension: 6, entity: 7, temporal: 5, aesthetic: 9 }
    }
  ];

  presets.forEach(p => {
    const opt = document.createElement("option");
    opt.value = p.id;
    opt.textContent = p.name;
    presetSelect.appendChild(opt);
  });

  presetSelect.addEventListener("change", () => {
    const selected = presets.find(p => p.id === presetSelect.value);
    if (selected) {
      Object.entries(selected.traits).forEach(([id, val]) => {
        const el = document.getElementById(id);
        if (el) el.value = val;
      });
      form.dataset.rl = selected.rl;
      form.dataset.noi = selected.noi;
      form.dataset.fqi = selected.fqi;
      form.dataset.rai = selected.rai;
    } else {
      traitIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = 5;
      });
      delete form.dataset.rl;
      delete form.dataset.noi;
      delete form.dataset.fqi;
      delete form.dataset.rai;
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
    const traitValues = {};

    traitIds.forEach(id => {
      const val = parseFloat(document.getElementById(id).value);
      traitValues[id] = val;
      const weight = weights[id] || 1;
      score += val * weight;
    });

    if (!rl) rl = estimateLevel(Math.round(score));

    levelLabel.textContent = rl;
    summaryText.textContent = describeLevel(rl);
    indexOutput.innerHTML = `
      <strong>Narrative Origin Index:</strong> ${noi ? "True" : "False"}<br>
      <strong>Foundational Qualifier Index:</strong> ${fqi ? "Qualified" : "Unqualified"}<br>
      <strong>Reality Authority Index:</strong> ${rai ? "Active" : "Inactive"}
    `;

    renderGlyph(traitValues);
    animateRing(rl);
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

  function renderGlyph(traits) {
    const labels = [
      "Causal", "Narrative", "Multiversal", "Logic", "Resistance",
      "Power", "Dimension", "Entity", "Temporal", "Aesthetic"
    ];
    const values = traitIds.map(id => traits[id]);

    if (radarChart) radarChart.destroy();
    radarChart = new Chart(glyphCanvas, {
      type: "radar",
      data: {
        labels: labels,
        datasets: [{
          label: "Trait Signature",
          data: values,
          backgroundColor: "rgba(0,250,255,0.1)",
          borderColor: "#00faff",
          borderWidth: 2,
          pointBackgroundColor: "#00faff"
        }]
      },
      options: {
        responsive: false,
        scales: {
          r: {
            angleLines: { color: "#333" },
            grid: { color: "#444" },
            pointLabels: { color: "#ccc", font: { size: 10 } },
            ticks: {
              color: "#888",
              backdropColor: "transparent",
              stepSize: 2,
              max: 10,
              min: 0
            }
          }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });
  }

  function animateRing(rl) {
    const ring = document.querySelector(".tier-glow");
    if (!ring) return;

    const colorMap = {
      "1": "#ff0055",
      "2": "#ff8800",
      "3": "#00ff77",
      "4": "#00c3ff",
      "5": "#ffffff",
      "Ω": "#d0a2ff"
    };

    const color = colorMap[rl] || "#00faff";
    ring.style.boxShadow = `0 0 20px ${color}88, 0 0 40px ${color}33 inset`;
  }
});

