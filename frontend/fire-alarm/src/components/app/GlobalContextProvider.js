import React from 'react';
import { ParametersContext } from '../../context/ParametersContext';
import {
  useAlarms,
  useCell,
  useCellsData,
  useDrawing,
  useMethodResult,
  useNoise,
  useRender,
} from '../../hooks/Parameters';

const GlobalContextProvider = (props) => {
  const context = {
    noise: useNoise(),
    alarms: useAlarms(),
    cell: useCell(),
    cellsData: useCellsData(),
    methodResult: useMethodResult(),
    render: useRender(),
    drawing: useDrawing(),
  };

  return (
    <ParametersContext.Provider value={{ ...context }}>
      {props.children}
    </ParametersContext.Provider>
  );
};

export default GlobalContextProvider;
