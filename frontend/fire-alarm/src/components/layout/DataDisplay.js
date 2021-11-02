import React, { useContext } from 'react';
import { ParametersContext } from '../../context/ParametersContext';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../../constants/constants';

const DataDisplay = () => {
  const { noise, alarms, cell, cellsData, methodResult, render } =
    useContext(ParametersContext);

  const { successful, serverResponseData } = methodResult;
  const { fireExpectancies, importances } = cellsData;

  const getDataParamsOfString = () => {
    return JSON.stringify(
      {
        CANVAS_WIDTH,
        CANVAS_HEIGHT,
        successful,
        fireExpectancies_len: fireExpectancies.length,
        importances_len: importances.length,
        alarmCount: alarms.count,
        alarmRadius: alarms.radius,
        noiseType: noise.type,
        xink: noise.xink,
        yink: noise.yink,
        render,
        cellCount: cell.count,
      },
      null,
      2,
    );
  };

  return (
    <div className={'data-container'}>
      <div className="data-parameters-block">
        <div>
          <h3 className={'data-section-header'}>Parameters</h3>
          <pre className={'data-parameters-pre'}>{getDataParamsOfString()}</pre>
        </div>
        <hr className={'data-hr'} />
        <div>
          <h3 className={'data-section-header'}>Server response</h3>
          <pre className={'data-parameters-pre'}>
            {serverResponseData
              ? JSON.stringify(serverResponseData, null, 2)
              : '{}'}
          </pre>
        </div>
      </div>
    </div>
  );
};
export default DataDisplay;
