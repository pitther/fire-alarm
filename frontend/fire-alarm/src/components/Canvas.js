import React, { useCallback, useContext, useState } from 'react';
import { Graphics, Stage } from '@inlet/react-pixi';
import { pickRGB, rgbToHex } from '../util/colors';
import { ParametersContext } from '../context/ParametersContext';
import { Badge, message } from 'antd';
import { useAlarms, useCanvasSize, useCell, useCellsData, useMethodResult, useRender } from '../hooks/Parameters';

const Canvas = () => {
  const { successful } = useMethodResult();
  const { width, height } = useCanvasSize();
  const { sizeX, sizeY } = useCell();

  const {
    fireExpectancy,
    importance,
    alarm,
    grid,
  } = useRender();

  const cellCount = useCell().count;
  const { alarms, radius } = useAlarms();
  const { fireExpectancies, importances } = useCellsData();


  const draw = React.useCallback(g => {
    g.clear();
    fireExpectancies.forEach((row, i) => {

      row.forEach((cell, j) => {
        let hex;
        const colorGreen = [0, 255, 0];
        const colorRed = [255, 0, 0];
        let weight = 0;
        let fireWeight = cell;
        let importanceWeight = importances[i][j];

        if (fireExpectancy){
          weight = fireWeight;
        } else if (importance){
          weight = importanceWeight;
        }
        if (fireExpectancy && importance) {
          weight += fireWeight / 2 + importanceWeight / 2;
        }

        if (fireExpectancy || importance) {
          const pickedGradient = pickRGB(colorRed, colorGreen, weight);

          hex = rgbToHex(...pickedGradient);

          g.lineStyle({ alignment: 0, color: 0xd3d3d3, width: grid ? 0.5 : 0 });
          g.beginFill(hex, 1);
          g.drawRect(i * sizeX, j * sizeY, sizeX, sizeY);
          g.endFill();
        }

      });
    });

    if (alarm) {
      alarms.forEach(alarm => {
        g.lineStyle(0);
        g.beginFill(0xffff0b, 0.5);
        g.drawCircle(sizeX * alarm.x + sizeX / 2, sizeY * alarm.y + sizeY / 2, (radius * sizeX) - sizeX / 2);
        g.endFill();
      });

      alarms.forEach(alarm => {
        g.lineStyle(1, 0xfffff, 1);
        g.beginFill(0x3793ff, 1);
        g.drawCircle(sizeX * alarm.x + sizeX / 2, sizeY * alarm.y + sizeY / 2, sizeX / 2);
        g.endFill();
      });
    }

  }, [
    alarms, importances, fireExpectancies,
    cellCount,
    width, height,
    fireExpectancy, grid, alarm, importance,
    sizeX, sizeY]);

  const onClick = useCallback((event) => {
    const x = event.nativeEvent.offsetX;
    const y = event.nativeEvent.offsetY;
    const xIndex = Math.floor(x / sizeX);
    const yIndex = Math.floor(y / sizeY);
    const cellFireExpectancy = fireExpectancies[xIndex][yIndex];
    const cellImportance = importances[xIndex][yIndex];

    message.info(`FireExp: ${cellFireExpectancy.toFixed(3)}, Importance: ${cellImportance.toFixed(3)}`);
  }, [fireExpectancies, importances, sizeX, sizeY]);

  return (
    <div id='canvas-container'>
      <Badge.Ribbon id={'canvas-ribbon'} placement={'start'}
                    color={successful ? '#87d068' : '#f50'}
                    text={successful ? 'Ready' : 'Not ready'}>
        <Stage id={'stage'} width={width} height={width}
               options={{ backgroundAlpha: 0.2 }}
               onClick={e => onClick(e)}>
          <Graphics draw={draw} />
        </Stage>
      </Badge.Ribbon>
    </div>
  );
};

export default Canvas;