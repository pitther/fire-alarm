import './App.css';
import React from 'react';
import Logo from './components/Logo'
import Canvas from './components/Canvas'
import {useEffect, useState} from "react";

import {generateCells} from "./util/generateCells";
import Control from "./components/Control";
import {ParametersContext} from "./context/ParametersContext";
import DataDisplay from "./components/DataDisplay";


function App() {
    const [cellCount, setCellCount] = useState(40);

    const [WIDTH, setWIDTH] = useState(400);
    const [HEIGHT, setHEIGHT] = useState(400);

    const [cellSizeX, setCellSizeX] = useState(WIDTH / cellCount);
    const [cellSizeY, setCellSizeY] = useState(HEIGHT / cellCount);

    const [xink, setXink] = useState(10);
    const [yink, setYink] = useState(10);
    const [noiseType, setNoiseType] = useState('simplex');

    const [fireExpectancyArray, setFireExpectancyArray] = useState(generateCells(cellCount, xink, yink));
    const [importanceArray, setImportanceArray] = useState(generateCells(cellCount, xink, yink))
    const [serverResponseData, setServerResponseData] = useState();
    const [resultSuccessful, setResultSuccessful] = useState(false);

    const [alarmArray, setAlarmArray] = useState([]);
    const [alarmCount, setAlarmCount] = useState(5);
    const [alarmRadius, setAlarmRadius] = useState(10);

    const [render, setRender] = useState({
        fireExpectancy: true,
        importance: false,
        alarms: false,
        grid: false
    });

    useEffect(() => {
        setCellSizeX(WIDTH / cellCount);
        setCellSizeY(HEIGHT / cellCount);

        setFireExpectancyArray(generateCells(cellCount, xink, yink, noiseType));
        setImportanceArray(generateCells(cellCount, xink, yink, noiseType));
        setResultSuccessful(false);
        setAlarmArray([]);
        setRender({...render,alarms:false})
    }, [cellCount, WIDTH, HEIGHT, xink, yink, noiseType]);

    useEffect(() => {
        if (!serverResponseData || serverResponseData.error || !serverResponseData.alarms || !serverResponseData.alarms.length) {
            setResultSuccessful(false);
            setRender({...render, alarms: false});
        } else if (!serverResponseData.error && serverResponseData.alarms) {
            setResultSuccessful(true);
            setRender({...render, alarms: true});
            setAlarmArray(serverResponseData.alarms);
        }
    }, [serverResponseData]);


    useEffect(() => {
        setResultSuccessful(false);
    }, [alarmRadius, alarmCount]);

    const parametersContext = {
        setServerResponseData,
        serverResponseData,
        fireExpectancyArray, importanceArray,
        cellCount, setCellCount,
        WIDTH, HEIGHT,
        xink, setXink,
        yink, setYink,
        cellSizeX, cellSizeY,
        noiseType, setNoiseType,
        render, setRender,
        resultSuccessful,
        alarmCount, setAlarmCount,
        alarmRadius, setAlarmRadius,
        alarmArray
    };

    return (
        <div className='container'>
            <Logo/>
            <ParametersContext.Provider value={{...parametersContext}}>
                <hr/>
                <Canvas/>
                <hr/>
                <Control/>
                <DataDisplay/>
            </ParametersContext.Provider>
        </div>
    );
}

export default App;
