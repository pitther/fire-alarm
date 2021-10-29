import './App.css';
import React from 'react';
import Logo from './components/Logo';
import Canvas from './components/Canvas';
import { useEffect, useState } from 'react';
import { generateCells } from './util/generateCells';
import Control from './components/Control';
import { ParametersContext } from './context/ParametersContext';
import DataDisplay from './components/DataDisplay';
import {
  useAlarms,
  useCanvasSize,
  useCell,
  useCellsData,
  useMethodResult,
  useNoise,
  useRender,
} from './hooks/Parameters';

function App() {
  const { width, height } = useCanvasSize();

  const { xink, yink, type } = useNoise();

  const { setFireExpectancies, setImportances } = useCellsData();

  const {
    serverResponseData, setSuccessful,
  } = useMethodResult();

  const {
    setAlarms, radius,
  } = useAlarms();

  const alarmCount = useAlarms().count;

  const { setAlarm } = useRender();

  const { setSizeY, setSizeX } = useCell();
  const cellCount = useCell().count;

  useEffect(() => {
    setSizeX(width / cellCount);
    setSizeY(height / cellCount);

    setFireExpectancies(generateCells(cellCount, xink, yink, type));
    setImportances(generateCells(cellCount, xink, yink, type));

    setSuccessful(false);

    setAlarms([]);

    setAlarm(false);

  }, [cellCount, width, height, xink, yink, type]);

  useEffect(() => {
    if (!serverResponseData || serverResponseData.error || !serverResponseData.alarms || !serverResponseData.alarms.length) {
      setSuccessful(false);
      setAlarm(false);
    } else if (!serverResponseData.error && serverResponseData.alarms) {
      setSuccessful(true);
      setAlarm(true);
      setAlarms(serverResponseData.alarms);
    }
  }, [serverResponseData]);


  useEffect(() => {
    setSuccessful(false);
  }, [radius, alarmCount]);

  const parametersContext = {};

  return (
    <div className='container'>
      <Logo />
      <ParametersContext.Provider value={{ ...parametersContext }}>
        <hr />
        <Canvas />
        <hr />
        {/*<Control />*/}
        {/*<DataDisplay />*/}
      </ParametersContext.Provider>
    </div>
  );
}

export default App;
