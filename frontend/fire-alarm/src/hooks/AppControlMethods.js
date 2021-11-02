import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../constants/constants';
import { generateCells } from '../util/generateCells';
import { useCallback, useContext } from 'react';

function useAppControlMethods(context) {
  const { noise, alarms, cell, cellsData, methodResult, render } =
    useContext(context);

  const { setFireExpectancies, setImportances } = cellsData;
  const { setSuccessful, serverResponseData } = methodResult;
  const { setAlarms } = alarms;
  const { setAlarm } = render;
  const { setSizeY, setSizeX } = cell;

  const handleResponseData = useCallback(() => {
    if (!serverResponseData?.alarms?.length || serverResponseData.error) {
      setSuccessful(false);

      setAlarm(false);
    } else if (!serverResponseData.error && serverResponseData.alarms) {
      setSuccessful(true);

      setAlarm(true);
      setAlarms(serverResponseData.alarms);
    }
  }, [serverResponseData, setAlarm, setAlarms, setSuccessful]);

  const onIrrelevantData = useCallback(() => {
    setSuccessful(false);
    setAlarms([]);
    setAlarm(false);
  }, [
    setSuccessful,
    setAlarms,
    setAlarm,
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
