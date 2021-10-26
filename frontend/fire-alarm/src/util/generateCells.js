import perlin from 'noisejs';

const generateCells = (cellCountX, cellCountY,xink,yink) => {
    const noise = new perlin.Noise(Math.random());

    const cells = [];
    for (let i = 0; i < cellCountX; i++) {
        const row = [];
        for (let j = 0; j < cellCountY; j++) {
            //row.push(noise.perlin2(i / 10, j / 10));
            row.push(noise.simplex2(i / xink, j / yink));
        }
        cells.push(row);
    }
    return cells;
}

export {generateCells}