import { useState } from 'react';
import { generateCells } from '../util/generateCells';

const useCanvasSize = () => {
  const [width, setWidth] = useState(400);
  const [height, setHeight] = useState(400);

  return { width, height, setWidth, setHeight };
};

const useCell = () => {
  const [count, setCount] = useState(40);
  const [sizeX, setSizeX] = useState(useCanvasSize().width / count);
  const [sizeY, setSizeY] = useState(useCanvasSize().height / count);

  return { count, setCount, sizeX, sizeY, setSizeY, setSizeX };
};

const useNoise = () => {
  const [xink, setXink] = useState(10);
  const [yink, setYink] = useState(10);
  const [type, setType] = useState('simplex');

  return { xink, setXink, yink, setYink, type, setType };
};

const useCellsData = () => {
  const { count } = useCell();
  const { xink, yink } = useNoise();

  const [fireExpectancies, setFireExpectancies] = useState(
    generateCells(count, xink, yink),
  );

  const [importances, setImportances] = useState(
    generateCells(count, xink, yink),
  );

  return { fireExpectancies, setFireExpectancies, importances, setImportances };
};

const useMethodResult = () => {
  const [serverResponseData, setServerResponseData] = useState();
  const [successful, setSuccessful] = useState(false);

  return {
    serverResponseData,
    setServerResponseData,
    successful,
    setSuccessful,
  };
};

const useAlarms = () => {
  const [alarms, setAlarms] = useState([]);
  const [count, setCount] = useState(5);
  const [radius, setRadius] = useState(10);

  return { alarms, setAlarms, count, setCount, radius, setRadius };
};

const useRender = () => {
  const [fireExpectancy, setFireExpectancy] = useState(true);
  const [importance, setImportance] = useState(false);
  const [alarm, setAlarm] = useState(false);
  const [grid, setGrid] = useState(false);

  return {
    fireExpectancy,
    setFireExpectancy,
    importance,
    setImportance,
    alarm,
    setAlarm,
    grid,
    setGrid,
  };
};

export {
  useAlarms,
  useNoise,
  useRender,
  useCanvasSize,
  useCell,
  useMethodResult,
  useCellsData,
};
