export function generateShortId(state) {
  const existing = new Set(
    Object.values(state.byId).map((card) => card.shortId)
  );
  let length = 4;

  while (true) {
    let min = 10 ** (length - 1);
    let max = 10 ** length - 1;

    const available = [];
    for (let i = min; i <= max; i++) {
      const candidate = "#" + i;
      if (!existing.has(candidate)) available.push(candidate);
    }

    if (available.length > 0) {
      return available[Math.floor(Math.random() * available.length)];
    }

    length++;
  }
}
