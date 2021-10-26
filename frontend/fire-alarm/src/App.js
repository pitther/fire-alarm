import './App.css';
import {render} from 'react-dom';
import Logo from './components/Logo'
import Canvas from './components/Canvas'
import {useEffect, useState} from "react";

import {generateCells} from "./util/generateCells";
import Control from "./components/Control";


function App() {


    const [cellSize, setCellSize] = useState(10);

    const [WIDTH, setWIDTH] = useState(400);
    const [HEIGHT, setHEIGHT] = useState(400);

    const [cellCountX, setCellCountX] = useState(Math.floor(WIDTH / cellSize));
    const [cellCountY, setCellCountY] = useState(Math.floor(HEIGHT / cellSize));

    const [xink, setXink] = useState(10);
    const [yink, setYink] = useState(10);

    const [fireExpectancyArray, setFireExpectancyArray] = useState(generateCells(cellCountX, cellCountY, xink, yink));
    const [importanceArray,setImportanceArray] = useState(generateCells(cellCountX,cellCountY,xink,yink))
    const [serverResponseData,setServerResponseData] = useState();

    useEffect(() => {
        setCellCountX(Math.floor(WIDTH / cellSize));
        setCellCountY(Math.floor(HEIGHT / cellSize));


        setFireExpectancyArray(generateCells(cellCountX, cellCountY, xink, yink));
        setImportanceArray(generateCells(cellCountX, cellCountY, xink, yink));
    }, [cellSize, WIDTH, HEIGHT]);

    useEffect(() => {
        console.log(serverResponseData);
    }, [serverResponseData]);


    const canvasArgs = {fireExpectancyArray,cellSize,WIDTH,HEIGHT} ;
    const controlArgs = {setServerResponseData,fireExpectancyArray,importanceArray};
    return (
        <div className='container'>
            <Logo/>
            <hr/>
            <Canvas {...canvasArgs}/>
            <hr/>
            <Control {...controlArgs}/>
            <pre>{serverResponseData?JSON.stringify(serverResponseData):'{}'}</pre>
        </div>
    );
}

export default App;
