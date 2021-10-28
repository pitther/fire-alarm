import perlin from 'noisejs';

const generateCells = (cellSizeX, cellSizeY, xink, yink, noiseType) => {
    const noise = new perlin.Noise(Math.random());
    const WIDTH = 400;
    const HEIGHT = 400;
    const cells = [];
    for (let i = 0; i < WIDTH/cellSizeX; i++) {
        const row = [];
        for (let j = 0; j < HEIGHT/cellSizeY; j++) {
            if (noiseType === 'perlin') {
                row.push(noise.perlin2(i / xink, j / yink));
            } else {
                row.push(noise.simplex2(i / xink, j / yink));
            }
        }
        cells.push(row);
    }
    return cells;
}

export {generateCells}