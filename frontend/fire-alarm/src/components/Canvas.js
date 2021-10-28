import React, {useContext, useEffect} from 'react';
import {Graphics, Stage, Container, Sprite, useTick, useReducer, useRef} from '@inlet/react-pixi';
import {pickRGB, rgbToHex} from "../util/colors";
import {ParametersContext} from "../context/ParametersContext";
import {Badge} from "antd";
//russkoe pole
const Canvas = () => {
    const {resultSuccessful,WIDTH, HEIGHT, cellCount, fireExpectancyArray, render, importanceArray} = useContext(ParametersContext);

    const cellSizeX = WIDTH / cellCount;
    const cellSizeY = HEIGHT / cellCount;

    const draw = React.useCallback(g => {
        g.clear();
        fireExpectancyArray.forEach((row, i) => {

            row.forEach((cell, j) => {
                let hex;
                const colorGreen = [0, 255, 0];
                const colorRed = [255, 0, 0];
                let weight = 0;
                let fireWeight = 0;
                let importanceWeight = 0;

                if (render.fireExpectancy) {
                    fireWeight = (cell + 1) / 2;
                }
                if (render.importance) {
                    importanceWeight += (importanceArray[i][j] + 1) / 2;
                }
                if (render.fireExpectancy && render.importance) {
                    weight += fireWeight / 2 + importanceWeight / 2;
                } else {
                    weight += fireWeight + importanceWeight;
                }

                if (render.fireExpectancy || render.importance) {
                    const pickedGradient = pickRGB(colorGreen, colorRed, weight);

                    hex = rgbToHex(pickedGradient[0], pickedGradient[1], pickedGradient[2]);

                    g.lineStyle({alignment: 0, color: 0xd3d3d3, width: render.grid ? 0.5 : 0});
                    g.beginFill(hex, 1);
                    g.drawRect(i * cellSizeX, j * cellSizeY, cellSizeX, cellSizeY);
                    g.endFill();
                }

            });
        });

        const alarmArray = [{
            x: 20,
            y: 15,
            r: 10
        }, {
            x: 15,
            y: 25,
            r: 10
        }];

        if (render.alarms) {
            alarmArray.forEach(alarm => {
                g.lineStyle(0);
                g.beginFill(0xffff0b, 0.5);
                g.drawCircle(cellSizeX * alarm.x + cellSizeX / 2, cellSizeY * alarm.y + cellSizeY / 2, (alarm.r * cellSizeX) - cellSizeX / 2)
                g.endFill();
            });

            alarmArray.forEach(alarm => {
                g.lineStyle(1, 0xfffff, 1);
                g.beginFill(0x3793ff, 1);
                g.drawCircle(cellSizeX * alarm.x + cellSizeX / 2, cellSizeY * alarm.y + cellSizeY / 2, cellSizeX / 2)
                g.endFill();
            });
        }

    }, [fireExpectancyArray, cellCount, WIDTH, HEIGHT, render]);

    const onClick = (event) => {
        console.log(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
    }

    return (
        <div id='canvas-container'>
            <Badge.Ribbon placement={'start'} color={resultSuccessful?'#87d068':'#f50'} text={resultSuccessful?'Ready':'Not ready'}>
            <Stage id={'stage'} width={WIDTH} height={HEIGHT} options={{backgroundAlpha: 0.2}}
                   onClick={e => onClick(e)}>
                    <Graphics draw={draw}/>
            </Stage>
            </Badge.Ribbon>
        </div>
    );
};

export default Canvas;