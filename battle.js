async function startClash() {
  const [a, b] = [universeA.value, universeB.value];
  const data = await fetch('data/presets.json').then(r => r.json());
  const ua = data[a], ub = data[b];

  const diff = ua.score - ub.score;
  const result = diff === 0 ? "It’s a stalemate!" :
                diff > 0  ? `${a} overwhelms ${b}` :
                            `${b} rewrites ${a}'s logic`;

  document.getElementById('battleResults').innerText = result;
}
