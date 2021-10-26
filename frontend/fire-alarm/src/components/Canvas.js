import React from 'react';
import { Graphics, Stage, Container, Sprite, useTick, useReducer, useRef } from '@inlet/react-pixi';
import perlin from 'noisejs';

const Canvas = () => {
  const cellSizeX = 10;
  const cellSizeY = cellSizeX;

  const WIDTH = 400;
  const HEIGHT = 400;

  const cellCountX = Math.floor(WIDTH / cellSizeX);
  const cellCountY = Math.floor(HEIGHT / cellSizeY);

  const noise = new perlin.Noise(Math.random());

  const cells = [];
  for (let i = 0; i < cellCountX; i++){
    const row = [];
    for (let j = 0; j < cellCountY; j++){
      //row.push(noise.perlin2(i / 10, j / 10));
      row.push(noise.simplex2(i / 10, j / 10));
    }
    cells.push(row);
  }

  console.log(cells);

  const draw = React.useCallback(g => {
    g.clear();

    cells.forEach((row, i) => {
      row.forEach((cell, j) => {
        let hex;
        const colorGreen = [0,255,0];
        const colorRed = [255,0,0];
        const normalizedWeight = (cell+1)/2;
        const pickedGradient = pickRGB(colorGreen,colorRed,normalizedWeight);

        hex = rgbToHex(pickedGradient[0],pickedGradient[1],pickedGradient[2]);

        g.lineStyle({ alignment: 0, color: 0xffffff, width: 0 });
        g.beginFill(hex, 1);
        g.drawRect(i * cellSizeX, j * cellSizeY, cellSizeX, cellSizeY);
        g.endFill();
      });
    });

  }, []);

  function componentToHex(c) {
    let hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }

  function rgbToHex(r, g, b) {
    return '0x'+componentToHex(r) + componentToHex(g) + componentToHex(b);
  }

  function pickRGB(color1, color2, weight) {
    var w1 = weight;
    var w2 = 1 - w1;
    var rgb = [Math.round(color1[0] * w1 + color2[0] * w2),
      Math.round(color1[1] * w1 + color2[1] * w2),
      Math.round(color1[2] * w1 + color2[2] * w2)];
    return rgb;
  }

  return (
    <div id='canvas-container'>
      <Stage width={WIDTH} height={HEIGHT} options={{ backgroundAlpha: 0.2 }}>
        <Container position={[0, 0]}>
          <Graphics draw={draw} />
        </Container>
      </Stage>
    </div>
  );
};

export default Canvas;