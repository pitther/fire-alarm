import React, {useContext, useState} from 'react';
import {Graphics, Stage} from '@inlet/react-pixi';
import {pickRGB, rgbToHex} from "../util/colors";
import {ParametersContext} from "../context/ParametersContext";
import {Badge, message} from "antd";

const Canvas = () => {
    const {
        resultSuccessful,
        WIDTH,
        HEIGHT,
        cellCount,
        fireExpectancyArray,
        render,
        importanceArray,
        cellSizeX, cellSizeY,
        alarmArray
    } = useContext(ParametersContext);


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
                    fireWeight = cell;
                }
                if (render.importance) {
                    importanceWeight += importanceArray[i][j];
                }
                if (render.fireExpectancy && render.importance) {
                    weight += fireWeight / 2 + importanceWeight / 2;
                } else {
                    weight += fireWeight + importanceWeight;
                }

                if (render.fireExpectancy || render.importance) {
                    const pickedGradient = pickRGB(colorRed, colorGreen, weight);

                    hex = rgbToHex(pickedGradient[0], pickedGradient[1], pickedGradient[2]);

                    g.lineStyle({alignment: 0, color: 0xd3d3d3, width: render.grid ? 0.5 : 0});
                    g.beginFill(hex, 1);
                    g.drawRect(i * cellSizeX, j * cellSizeY, cellSizeX, cellSizeY);
                    g.endFill();
                }

            });
        });

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

    }, [alarmArray, importanceArray, fireExpectancyArray, cellCount, WIDTH, HEIGHT, render, cellSizeX, cellSizeY]);

    const onClick = (event) => {
        const x = event.nativeEvent.offsetX;
        const y = event.nativeEvent.offsetY;
        const xIndex = Math.floor(x / cellSizeX);
        const yIndex = Math.floor(y / cellSizeY)
        const cellFireExpectancy = fireExpectancyArray[xIndex][yIndex];
        const cellImportance = importanceArray[xIndex][yIndex];

        message.info(`FireExp: ${cellFireExpectancy.toFixed(3)}, Importance: ${cellImportance.toFixed(3)}`);
    }

    const [canvasHover, setCanvasHover] = useState(false);

    const onCanvasOver = () => {
        if (canvasHover !== true) {
            setCanvasHover(true);
        }
    }
    const onCanvasOut = () => {
        if (canvasHover !== false) {
            setCanvasHover(false);
        }
    }

    return (
        <div id='canvas-container'>
            <Badge.Ribbon style={{display: canvasHover ? 'none' : 'block'}} id={'canvas-ribbon'} placement={'start'}
                          color={resultSuccessful ? '#87d068' : '#f50'}
                          text={resultSuccessful ? 'Ready' : 'Not ready'}>
                <Stage onMouseOut={onCanvasOut} onMouseOver={onCanvasOver} id={'stage'} width={WIDTH} height={HEIGHT}
                       options={{backgroundAlpha: 0.2}}
                       onClick={e => onClick(e)}>
                    <Graphics draw={draw}/>
                </Stage>
            </Badge.Ribbon>
        </div>
    );
};

export default Canvas;