import React, { useCallback, useContext } from 'react';
import { Graphics, Stage } from '@inlet/react-pixi';
import { pickRGB, rgbToHex } from '../util/colors';
import { ParametersContext } from '../context/ParametersContext';
import { Badge, message } from 'antd';
import {
  CANVAS_GRADIENT_COLOR_1,
  CANVAS_GRADIENT_COLOR_2,
  CANVAS_HEIGHT,
  CANVAS_WIDTH, SUCCESSFUL_COLOR,
  UNSUCCESSFUL_COLOR,
} from '../constants/constants';

const Canvas = () => {
  const {
    alarms,
    cell,
    cellsData,
    methodResult,
    render,
  } = useContext(ParametersContext);

  const { successful } = methodResult;
  const { sizeX, sizeY } = cell;
  const {
    fireExpectancy,
    importance,
    alarm,
    grid,
  } = render;

  const { fireExpectancies, importances } = cellsData;

  const drawFigure = ({ graphic, figureName, lineStyle, fillStyle, x, y, sizeX, sizeY }) => {
    if (!graphic || !figureName || (!sizeX && !sizeY) || !fillStyle) return;

    graphic.lineStyle(lineStyle || 0);
    graphic.beginFill(fillStyle.hexColor || 0, fillStyle.alpha || 0);

    if (figureName === 'rect') {
      graphic.drawRect(x, y, sizeX, sizeY);
    } else if (figureName === 'circle') {
      graphic.drawCircle(x, y, sizeX || sizeY);
    }

    graphic.endFill();
  };

  const draw = React.useCallback(g => {
    g.clear();
    fireExpectancies.forEach((row, i) => {
      row.forEach((cell, j) => {
        let fireWeight = fireExpectancy ? cell : 0;
        let importanceWeight = importance ? importances[i][j] : 0;
        let weight = fireWeight + importanceWeight;


        if (fireExpectancy && importance) {
          weight = fireWeight / 2 + importanceWeight / 2;
        }

        if (fireExpectancy || importance) {
          const pickedGradient = pickRGB(CANVAS_GRADIENT_COLOR_2, CANVAS_GRADIENT_COLOR_1, weight);
          const fillHex = rgbToHex(...pickedGradient);

          drawFigure({
            graphic: g,
            figureName: 'rect',
            lineStyle: {
              alignment: 0,
              color: '0xd3d3d3',
              width: grid ? 0.5 : 0,
            },
            fillStyle: {
              hexColor: fillHex,
              alpha: 1,
            },
            x: sizeX * i,
            y: sizeY * j,
            sizeY,
            sizeX,
          });
        }

      });
    });

    if (alarm) {
      alarms?.alarms.forEach(alarm => {
        drawFigure({
          graphic: g,
          figureName: 'circle',
          fillStyle: {
            hexColor: '0xffff0b',
            alpha: 0.5,
          },
          x: sizeX * alarm.x + sizeX / 2,
          y: sizeY * alarm.y + sizeY / 2,
          sizeX: (alarm.r * sizeX) - sizeX / 2,
        });
      });

      alarms?.alarms.forEach(alarm => {
        drawFigure({
          graphic: g,
          figureName: 'circle',
          lineStyle: {
            alignment: 1,
            color: '0xffffff',
            width: 1,
          },
          fillStyle: {
            hexColor: '0x3793ff',
            alpha: 1,
          },
          x: sizeX * alarm.x + sizeX / 2,
          y: sizeY * alarm.y + sizeY / 2,
          sizeX: sizeX / 2,
        });
      });
    }

  }, [alarms?.alarms, importances, fireExpectancies, fireExpectancy, grid, alarm, importance, sizeX, sizeY]);

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
                    color={successful ? SUCCESSFUL_COLOR : UNSUCCESSFUL_COLOR}
                    text={successful ? 'Ready' : 'Not ready'}>
        <Stage id={'stage'} width={CANVAS_WIDTH} height={CANVAS_HEIGHT}
               options={{ backgroundAlpha: 0.1 }}
               onClick={e => onClick(e)}>
          <Graphics draw={draw} />
        </Stage>
      </Badge.Ribbon>
    </div>
  );
};

export default Canvas;