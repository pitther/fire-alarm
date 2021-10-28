import './App.css';
import {render} from 'react-dom';
import React from 'react';
import Logo from './components/Logo'
import Canvas from './components/Canvas'
import {useEffect, useState} from "react";

import {generateCells} from "./util/generateCells";
import Control from "./components/Control";
import {ParametersContext} from "./context/ParametersContext";


function App() {


    const [cellCount, setCellCount] = useState(40);

    const [WIDTH, setWIDTH] = useState(400);
    const [HEIGHT, setHEIGHT] = useState(400);

    const [cellSizeX, setCellSizeX] = useState(Math.floor(WIDTH / cellCount));
    const [cellSizeY, setCellSizeY] = useState(Math.floor(HEIGHT / cellCount));

    const [xink, setXink] = useState(10);
    const [yink, setYink] = useState(10);
    const [noiseType, setNoiseType] = useState('simplex');

    const [fireExpectancyArray, setFireExpectancyArray] = useState(generateCells(cellSizeX, cellSizeY, xink, yink));
    const [importanceArray, setImportanceArray] = useState(generateCells(cellSizeX, cellSizeY, xink, yink))
    const [serverResponseData, setServerResponseData] = useState();
    const [resultSuccessful, setResultSuccessful] = useState(false);

    const [render, setRender] = useState({
        fireExpectancy: true,
        importance: false,
        alarms: false,
        grid: false
    });

    useEffect(() => {
        setCellSizeX(Math.floor(WIDTH / cellCount));
        setCellSizeY(Math.floor(HEIGHT / cellCount));

        setFireExpectancyArray(generateCells(cellSizeX, cellSizeY, xink, yink, noiseType));
        setImportanceArray(generateCells(cellSizeX, cellSizeY, xink, yink, noiseType));
        setResultSuccessful(false);
    }, [cellCount, WIDTH, HEIGHT, xink, yink, noiseType]);

    useEffect(() => {
        console.log(serverResponseData);
        if (!serverResponseData || serverResponseData.error) setResultSuccessful(false);
        else if (!serverResponseData.error) setResultSuccessful(true);
    }, [serverResponseData]);

    useEffect(() => {
        setRender({...render,alarms:false})
    }, [resultSuccessful])

    const parametersContext = {
        setServerResponseData,
        fireExpectancyArray, importanceArray,
        cellCount, setCellCount,
        WIDTH, HEIGHT,
        xink, setXink,
        yink, setYink,
        noiseType, setNoiseType,
        render, setRender,
        resultSuccessful
    };

    return (
        <div className='container'>
            <Logo/>
            <hr/>
            <ParametersContext.Provider value={{...parametersContext}}>
                <Canvas/>
                <hr/>
                <Control/>
                <pre>{serverResponseData ? JSON.stringify(serverResponseData) : '{}'}</pre>
            </ParametersContext.Provider>
        </div>
    );
}

export default App;
