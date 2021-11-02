import React, { useContext, useState } from 'react';
import { Button, Col, message, Row, Spin } from 'antd';
import {
  DATA_ICON,
  FIRE_ICON,
  LOADING_ICON,
  SETTINGS_ICON,
} from '../../constants/constants';
import { sendPostRequest } from '../../data/request';
import { ParametersContext } from '../../context/ParametersContext';

const ActionButtons = ({ showSettingsDrawer, showDataDrawer }) => {
  const { alarms, cellsData, methodResult } = useContext(ParametersContext);
  const [loading, setLoading] = useState(false);

  const sendDataToServer = async () => {
    setLoading(true);
    message.info('Data has been sent to server...');

    const res = await sendPostRequest('http://localhost:3002/sendData', {
      fireExpectancies: cellsData.fireExpectancies,
      importances: cellsData.importances,
      alarm: {
        count: alarms.count,
        radius: alarms.radius,
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
    </div>
  );
};

export default ActionButtons;
