import React from 'react';
import {Graphics, Stage, Container, Sprite, useTick, useReducer, useRef} from '@inlet/react-pixi';
import {pickRGB, rgbToHex} from "../util/colors";

const Canvas = ({WIDTH, HEIGHT, cellSize, fireExpectancyArray}) => {

    const draw = React.useCallback(g => {
        g.clear();

        fireExpectancyArray.forEach((row, i) => {
            row.forEach((cell, j) => {
                let hex;
                const colorGreen = [0, 255, 0];
                const colorRed = [255, 0, 0];
                const normalizedWeight = (cell + 1) / 2;
                const pickedGradient = pickRGB(colorGreen, colorRed, normalizedWeight);

                hex = rgbToHex(pickedGradient[0], pickedGradient[1], pickedGradient[2]);

                g.lineStyle({alignment: 0, color: 0xffffff, width: 0});
                g.beginFill(hex, 1);
                g.drawRect(i * cellSize, j * cellSize, cellSize, cellSize);
                g.endFill();
            });
        });

    }, []);

    const onClick = (event) => {
        console.log(event.nativeEvent.offsetX,event.nativeEvent.offsetY);
    }

    return (
        <div id='canvas-container'>
            <Stage width={WIDTH} height={HEIGHT} options={{backgroundAlpha: 0.2}} onClick={e => onClick(e)}>
                <Graphics draw={draw}/>
            </Stage>
        </div>
    );
};

export default Canvas;