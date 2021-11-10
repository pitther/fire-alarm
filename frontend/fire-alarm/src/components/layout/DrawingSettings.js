import React, { useContext, useEffect, useState } from 'react';
import { Button, Radio, Switch } from 'antd';
import { FormatPainterOutlined } from '@ant-design/icons';
import SliderWithInput from './input/SliderWithInput';
import { ParametersContext } from '../../context/ParametersContext';
import { generateCells } from '../../util/generateCells';

const optionsDrawingType = [
  { label: 'Fire Expectancy', value: 0 },
  { label: 'Importance', value: 1 },
];

const optionsFigues = [
  { label: 'Dot', value: 0 },
  { label: 'Rect', value: 1 },
  { label: 'Circle', value: 2 },
];

const DrawingSettings = () => {
  const [switchRenders, setSwitchRenders] = useState(true);
  const { drawing, cellsData, cell, render } = useContext(ParametersContext);
  const {
    enabled,
    setEnabled,
    weight,
    setWeight,
    drawingType,
    setDrawingType,
    radius,
    setRadius,
    drawingFigure,
    setDrawingFigure,
  } = drawing;

  const changeSwitchRenders = () => {
    setSwitchRenders((prev) => !prev);
  };

  useEffect(() => {
    if (!switchRenders) {
      render.setImportance(true);
      render.setFireExpectancy(true);
    } else {
      if (!drawingType) {
        render.setImportance(false);
        render.setFireExpectancy(true);
      } else {
        render.setImportance(true);
        render.setFireExpectancy(false);
      }
    }
  }, [switchRenders]);

  const changeWeight = (value) => {
    setWeight(value);
  };

  const changeRadius = (value) => {
    setRadius(value);
  };

  const changeDrawingMode = () => {
    setEnabled((prev) => !prev);
  };

  const onChangeDrawingType = (type) => {
    const value = type.target.value;
    setDrawingType(value);

    if (switchRenders)
      if (!value) {
        render.setImportance(false);
        render.setFireExpectancy(true);
      } else {
        render.setImportance(true);
        render.setFireExpectancy(false);
      }
  };

  const onChangeDrawingFigure = (type) => {
    const value = type.target.value;
    setDrawingFigure(value);
  };

  const clearFireExpectancies = () => {
    cellsData.setFireExpectancies(
      generateCells(cell.count, 0, 0, 'perlin', true),
    );
  };

  const clearImportances = () => {
    cellsData.setImportances(generateCells(cell.count, 0, 0, 'perlin', true));
  };

  return (
    <div className={'drawing-container'}>
      <Switch
        className={'drawing-switch'}
        checkedChildren={
          <>
            Draw! <FormatPainterOutlined />
          </>
        }
        unCheckedChildren={
          <>
            Drawing disabled <FormatPainterOutlined />
          </>
        }
        checked={enabled}
        onChange={changeDrawingMode}
      />
      <div
        className={`drawing-options ${enabled ? 'drawing-options-expand' : ''}`}
      >
        <div className={'drawing-options-container'}>
          <h4>Drawing type</h4>
          <Radio.Group
            className={'drawing-radio'}
            options={optionsDrawingType}
            onChange={onChangeDrawingType}
            value={drawingType}
            optionType="button"
          />
          <br />
          <br />
          <Switch
            checkedChildren="Switch renders"
            unCheckedChildren="Combine renders"
            checked={switchRenders}
            onChange={changeSwitchRenders}
          />
          <br />
          <br />
          <SliderWithInput
            step={0.01}
            label="Weight"
            min={0}
            max={1}
            numberParameter={weight}
            onChange={changeWeight}
          />
          <hr className={'control-hr'} />
          <h4>Figure</h4>
          <Radio.Group
            className={'drawing-radio'}
            options={optionsFigues}
            onChange={onChangeDrawingFigure}
            value={drawingFigure}
            optionType="button"
          />
          <br />
          <br />
          <SliderWithInput
            step={1}
            label="Size"
            min={1}
            max={20}
            numberParameter={radius}
            onChange={changeRadius}
          />
          <hr className={'control-hr'} />
          <h4>Clear data</h4>
          <Button
            className={'clear-data-button'}
            type="danger"
            onClick={clearFireExpectancies}
          >
            FireExpectancies
          </Button>
          <Button
            type="danger"
            className={'clear-data-button'}
            onClick={clearImportances}
          >
            Importances
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DrawingSettings;
