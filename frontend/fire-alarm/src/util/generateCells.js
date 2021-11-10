import perlin from 'noisejs';

const generateCells = (cellCount, xink, yink, noiseType, empty = false) => {
  const noise = new perlin.Noise(Math.random());
  const cells = [];
  for (let i = 0; i < cellCount; i++) {
    const row = [];
    for (let j = 0; j < cellCount; j++) {
      if (empty) {
        row.push(0);
      } else if (noiseType === 'perlin') {
        row.push((noise.perlin2(i / xink, j / yink) + 1) / 2);
      } else {
        row.push((noise.simplex2(i / xink, j / yink) + 1) / 2);
      }
    }
    cells.push(row);
  }
  return cells;
};

export { generateCells };
