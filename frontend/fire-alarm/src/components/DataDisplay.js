import React, {useContext} from 'react';
import {ParametersContext} from "../context/ParametersContext";

const DataDisplay = () => {
    const {
        serverResponseData, resultSuccessful,
        fireExpectancyArray, importanceArray,
        alarmCount, alarmRadius,
        noiseType, render,
        xink, yink,
        WIDTH, HEIGHT,
        cellCount
    } = useContext(ParametersContext);

    return (
        <div className={'data-container'}>
            <div className="data-parameters-block">
                <div>
                    <h3 className={'data-section-header'}>
                        Parameters
                    </h3>
                    <pre className={'data-parameters-pre'}>
                        {
                            `${JSON.stringify({
                                resultSuccessful,
                                ['fireExpectancyLength']: fireExpectancyArray.length,
                                ['importanceLength']: importanceArray.length,
                                alarmCount,
                                alarmRadius,
                                noiseType,
                                render,
                                xink,
                                yink,
                                WIDTH,
                                HEIGHT,
                                cellCount
                            }, null, 2)}`}
                    </pre>
                </div>
                <hr className={'data-hr'}/>
                <h3 className={'data-section-header'}>
                    Server response
                </h3>

                <pre className={'data-parameters-pre'}>
                    {serverResponseData ? JSON.stringify(serverResponseData, null, 2) : '{}'}
                </pre>
            </div>
        </div>
    );
};

export default DataDisplay;