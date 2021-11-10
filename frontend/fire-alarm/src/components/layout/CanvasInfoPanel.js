import React, { useContext } from 'react';
import { Col, Row, Statistic } from 'antd';
import { ParametersContext } from '../../context/ParametersContext';

const CanvasInfoPanel = () => {
  const { alarms, cell, cellsData, methodResult, render, drawing } =
    useContext(ParametersContext);

  let displaying = ' ';
  displaying += render.fireExpectancy ? 'FE' : '';
  displaying += render.importance ? ' IM' : '';
  displaying += render.alarm ? ' AL' : '';

  const getFigureShortName = (index) => {
    switch (index) {
      case 0:
        return 'DOT';
      case 1:
        return 'RECT';
      case 2:
        return 'CIRCLE';
      default:
        return ' ';
    }
  };

  let figure = getFigureShortName(drawing.drawingFigure);

  return (
    <div className={'canvas-info-panel'}>
      <Row>
        <Col span={4}>
          <Statistic title="DISPLAY" value={displaying} />
        </Col>
        <Col span={4}>
          <Statistic title="CELL CNT" value={cell.count} />
        </Col>
        {drawing.enabled ? (
          <>
            <Col span={4}>
              <Statistic
                title="DRAW TYPE"
                value={drawing.drawingType ? 'IM' : 'FE'}
              />
            </Col>
            <Col span={4}>
              <Statistic title="WEIGHT" value={drawing.weight} />
            </Col>
            <Col span={4}>
              <Statistic title="FIGURE" value={figure} />
            </Col>
            <Col span={4}>
              <Statistic title="SIZE" value={drawing.radius} />
            </Col>
          </>
        ) : (
          <>
            <Col span={4}>
              <Statistic title="ALRM CNT" value={alarms.count} />
            </Col>
            <Col span={4}>
              <Statistic title="ALRM RAD" value={alarms.radius} />
            </Col>
            <Col span={4}>
              <Statistic title="ALRM TRIG" value={alarms.chance} />
            </Col>
            <Col span={4}>
              <Statistic title="RESULT" value={alarms.count} />
            </Col>
          </>
        )}
      </Row>
    </div>
  );
};

export default CanvasInfoPanel;
