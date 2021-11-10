import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../constants/constants';
import { generateCells } from '../util/generateCells';
import { useCallback, useContext } from 'react';

function useAppControlMethods(context) {
  const { noise, alarms, cell, cellsData, methodResult, render } =
    useContext(context);

  const { setFireExpectancies, setImportances, fireExpectancies, importances } =
    cellsData;
  const { setSuccessful, serverResponseData } = methodResult;
  const { setAlarms } = alarms;
  const { setAlarm, setChances } = render;
  const { setSizeY, setSizeX } = cell;

  const changeSuccessStatus = (value) => {
    setSuccessful(value);
    setAlarm(value);
    setChances(value);
    if (!value) {
      alarms.setChances([]);
      setAlarms([]);
    }
  };

  const handleResponseData = useCallback(() => {
    if (!serverResponseData?.alarms?.length || serverResponseData.error) {
      changeSuccessStatus(false);
    } else if (!serverResponseData.error && serverResponseData.alarms) {
      changeSuccessStatus(true);
      setAlarms(serverResponseData.alarms);
      alarms.setChances(serverResponseData.chances);
    }
  }, [serverResponseData, setAlarm, setAlarms, setSuccessful]);

  const onIrrelevantData = useCallback(() => {
    changeSuccessStatus(false);
  }, [
    setSuccessful,
    setAlarms,
    setAlarm,
    fireExpectancies,
    importances,
    alarms.count,
    alarms.radius,
    alarms.chance,
    cell.count,
    noise.type,
    noise.xink,
    noise.yink,
  ]);

  const createRelevantCellData = useCallback(() => {
    setSizeY(CANVAS_HEIGHT / cell.count);
    setSizeX(CANVAS_WIDTH / cell.count);

    setFireExpectancies(
      generateCells(cell.count, noise.xink, noise.yink, noise.type),
    );
    setImportances(
      generateCells(cell.count, noise.xink, noise.yink, noise.type),
    );
  }, [
    cell.count,
    noise.type,
    noise.xink,
    noise.yink,
    setFireExpectancies,
    setImportances,
    setSizeX,
    setSizeY,
  ]);

  return { createRelevantCellData, onIrrelevantData, handleResponseData };
}

export { useAppControlMethods };
