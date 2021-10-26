import React from 'react';
import {Button} from 'antd';
import {sendPostRequest} from "../data/request";

const Control = ({setServerResponseData,fireExpectancyArray,importanceArray}) => {
    const sendDataToServer = async () => {
        const res = await sendPostRequest('http://localhost:3002/sendData',{fireExpectancyArray,importanceArray});
        setServerResponseData(res);
    }
    return (
        <div className={'control-container'}>
            <Button type="primary" onClick={sendDataToServer}>Send to server</Button>
        </div>
    );
};

export default Control;