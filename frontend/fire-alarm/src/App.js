import './App.css';
import React, { useCallback } from 'react';
import Logo from './components/Logo';
import Canvas from './components/Canvas';
import { useEffect } from 'react';
import { generateCells } from './util/generateCells';
import Control from './components/Control';
import { ParametersContext } from './context/ParametersContext';
import DataDisplay from './components/DataDisplay';
import {
  useAlarms,
  useCell,
  useCellsData,
  useMethodResult,
  useNoise,
  useRender,
} from './hooks/Parameters';
import { CANVAS_HEIGHT, CANVAS_WIDTH } from './constants/constants';

function App() {
  const noise = useNoise();
  const cellsData = useCellsData();
  const methodResult = useMethodResult();

  const alarms = useAlarms();

  const render = useRender();

  const cell = useCell();

  const handleResponseData = useCallback( () => {
    const { serverResponseData, setSuccessful } = methodResult;
    if (!serverResponseData?.alarms?.length || serverResponseData.error) {
      setSuccessful(false);

      render.setAlarm(false);
    } else if (!serverResponseData.error && serverResponseData.alarms) {
      setSuccessful(true);

      render.setAlarm(true);
      alarms.setAlarms(serverResponseData.alarms);
    }
  },[alarms, methodResult, render]);

  const onIrrelevantData = useCallback(() => {
    methodResult.setSuccessful(false);
    alarms.setAlarms([]);
    render.setAlarm(false);
  }, [alarms, methodResult, render]);

  const createRelevantCellData = useCallback(() => {
    const {
      setSizeX, setSizeY,
      setFireExpectancies, setImportances,
      xink, yink, type,
      count,
    } = { ...cell, ...cellsData, ...noise };

    setSizeX(CANVAS_WIDTH / count);
    setSizeY(CANVAS_HEIGHT / count);

    setFireExpectancies(generateCells(count, xink, yink, type));
    setImportances(generateCells(count, xink, yink, type));
  }, [
    cell, cellsData, noise,
  ]);

  useEffect(() => {
    createRelevantCellData();
  }, [
    cell.count, noise.xink,
    noise.yink, noise.type
  ]);

  useEffect(() => {
    onIrrelevantData();
  }, [
    alarms.radius, alarms.count,
    cellsData.fireExpectancies,
    cellsData.importances]);

  useEffect(() => {
    handleResponseData();
  }, [methodResult.serverResponseData]);


  const parametersContext = {
    noise,
    alarms,
    cell,
    cellsData,
    methodResult,
    render,
  };

  return (
    <div className='container'>
      <Logo />
      <ParametersContext.Provider value={{ ...parametersContext }}>
        <hr />
        <Canvas />
        <hr />
        <Control />
        <DataDisplay />
      </ParametersContext.Provider>
    </div>
  );
}

export default App;
