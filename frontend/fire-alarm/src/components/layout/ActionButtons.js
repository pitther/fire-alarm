import React, { useContext, useState } from 'react';
import { Button, Col, message, Row, Spin } from 'antd';
import {
  DATA_ICON,
  FIRE_ICON,
  LOADING_ICON,
  SETTINGS_ICON,
  SERVER_PORT,
  SERVER_URL,
} from '../../constants/constants';
import { sendPostRequest } from '../../data/request';
import { ParametersContext } from '../../context/ParametersContext';
import DrawingSettings from './DrawingSettings';

const ActionButtons = ({ showSettingsDrawer, showDataDrawer }) => {
  const { alarms, cellsData, methodResult, drawing } =
    useContext(ParametersContext);
  const [loading, setLoading] = useState(false);

  const sendDataToServer = async () => {
    setLoading(true);
    drawing.setEnabled(false);
    message.info('Data has been sent to server...');
    console.log(`${SERVER_URL}:${SERVER_PORT}/sendData`);
    const res = await sendPostRequest(`${SERVER_URL}:${SERVER_PORT}/sendData`, {
      fireExpectancies: cellsData.fireExpectancies,
      importances: cellsData.importances,
      alarms: {
        count: alarms.count,
        radius: alarms.radius,
        chance: alarms.chance,
      },
    });
    console.log(res);
    setLoading(false);
    if (res.error || !res?.alarms?.length) {
      message.error(res.msg || 'Bad data from server');
      return;
    }
    message.success('Data has been received from server.');
    methodResult.setServerResponseData(res);
  };

  return (
    <div className="control-send-block">
      <div
        id="control-spin-container"
        style={{ display: loading ? 'flex' : 'none' }}
      >
        <Spin
          id={'control-spin'}
          spinning={loading}
          indicator={LOADING_ICON}
          size={'large'}
        />
      </div>
      <Row>
        <Col span={24} className={'action-buttons-col'}>
          <Button
            id={'control-send-button'}
            danger
            type="dashed"
            onClick={sendDataToServer}
          >
            Start algorithm {FIRE_ICON}
          </Button>
        </Col>
      </Row>
      <Row>
        <Col span={12} className={'action-buttons-col'}>
          <Button
            id={'control-data-button'}
            type="dashed"
            onClick={showDataDrawer}
          >
            Data {DATA_ICON}
          </Button>
        </Col>
        <Col span={12} className={'action-buttons-col'}>
          <Button
            id={'control-settings-button'}
            type="dashed"
            onClick={showSettingsDrawer}
          >
            Settings {SETTINGS_ICON}
          </Button>
        </Col>
      </Row>
      <Row>
        <Col span={24} className={'action-buttons-col'}>
          <DrawingSettings />
        </Col>
      </Row>
    </div>
  );
};

export default ActionButtons;
