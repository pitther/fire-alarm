import React, { useContext, useState } from 'react';
import { Button, Col, InputNumber, message, Radio, Row, Slider, Space, Spin } from 'antd';
import { sendPostRequest } from '../data/request';
import { DashboardFilled, FireOutlined, FormatPainterFilled, SoundFilled } from '@ant-design/icons';
import { ParametersContext } from '../context/ParametersContext';
import Checkbox from 'antd/es/checkbox/Checkbox';

const loadingIcon = <FireOutlined style={{ fontSize: 40, color: 'red' }} spin />;
const fireIcon = <FireOutlined style={{ fontSize: 15 }} />;
const noiseIcon = <DashboardFilled style={{ fontSize: 15 }} />;
const canvasIcon = <FormatPainterFilled style={{ fontSize: 15 }} />;
const alarmIcon = <SoundFilled style={{ fontSize: 15 }} />;

const optionsNoise = [
  { label: 'Perlin', value: 'perlin' },
  { label: 'Simplex', value: 'simplex' },
];

const Control = () => {
  const {
    setServerResponseData,
    fireExpectancyArray,
    importanceArray,
    cellCount, setCellCount,
    xink,
    setXink,
    setYink,
    yink,
    noiseType, setNoiseType,
    render, setRender,
    resultSuccessful,
    alarmCount, setAlarmCount,
    alarmRadius, setAlarmRadius,
  } = useContext(ParametersContext);

  const [loading, setLoading] = useState(false);

  const sendDataToServer = async () => {
    setLoading(true);

    message.info('Data has been sent to server...');

    const res = await sendPostRequest('http://localhost:3002/sendData', {
      fireExpectancyArray,
      importanceArray,
      alarm: {
        count: alarmCount,
        radius: alarmRadius,
      },
    });

    setLoading(false);

    if (res.error || !res.alarms || !res.alarms.length) {

      message.error(res.msg || 'Bad data from server');
      return;
    }

    message.success('Data has been received from server.');

    setServerResponseData(res);
  };

  const onChangeXINK = value => {
    setXink(value);
    setYink(value);
  };

  const onChangeYINK = value => {
    setYink(value);
    setXink(value);
  };

  const onChangeAlarmRadius = value => {
    setAlarmRadius(value);
  };

  const onChangeAlarmCount = value => {
    setAlarmCount(value);
  };

  const onChangeCellCount = value => {
    setCellCount(value);
  };

  const onChangeNoiseType = e => {
    setNoiseType(e.target.value);
  };

  const onChangeRender = e => {
    switch (e.target.name) {
      case 'fire_expectancy': {
        setRender({ ...render, fireExpectancy: e.target.checked });
        return;
      }
      case 'importance': {
        setRender({ ...render, importance: e.target.checked });
        return;
      }
      case 'alarm': {
        setRender({ ...render, alarms: e.target.checked });
        return;
      }
      case 'grid': {
        setRender({ ...render, grid: e.target.checked });
        return;
      }
    }
  };


  return (
    <div className={'control-container'} style={loading ? { pointerEvents: 'none', opacity: 0.7 } : {}}>
      <div id='control-spin-container' style={{ display: loading ? 'flex' : 'none' }}>
        <Spin id={'control-spin'} spinning={loading} indicator={loadingIcon} size={'large'} />
      </div>
      <div className='control-send-block'>
        <Button id={'control-send-button'} danger type='dashed' onClick={sendDataToServer}>
          Start algorithm {fireIcon}
        </Button>
      </div>
      <div className='control-parameters-block'>
        <div>
          <h3 className={'control-section-header'}>Canvas settings {canvasIcon}</h3>
          <Row>
            <Col span={24} style={{ textAlign: 'center' }}>
              <h4>Render</h4>
              <Row>
                <Col span={12}>
                  <Space direction='vertical' style={{ textAlign: 'left' }}>
                    <Checkbox name={'fire_expectancy'} onChange={onChangeRender}
                              value={render.fireExpectancy} checked={render.fireExpectancy}>Fire
                      Expectancy
                    </Checkbox>

                    <Checkbox name={'importance'} onChange={onChangeRender}
                              value={render.importance}
                              checked={render.importance}>Importance
                    </Checkbox>

                    <Checkbox name={'alarm'} onChange={onChangeRender} value={render.alarms}
                              checked={render.alarms}
                              disabled={!resultSuccessful}>Alarm's
                    </Checkbox>
                  </Space>
                </Col>
                <Col span={12}>
                  <Space direction='vertical' style={{ textAlign: 'left' }}>
                    <Checkbox name={'grid'} onChange={onChangeRender} value={render.grid}
                              checked={render.grid}>Grid
                    </Checkbox>
                  </Space>
                </Col>
              </Row>
              <div style={{ textAlign: 'center', marginLeft: '40px', marginRight: '40px' }}>
                <h4>Cell count row/col</h4>
                <Row>
                  <Col span={16} style={{ textAlign: 'center' }}>
                    <Slider
                      min={4}
                      max={200}
                      onChange={onChangeCellCount}
                      value={typeof cellCount === 'number' ? cellCount : 0}
                    />
                  </Col>
                  <Col span={8} style={{ textAlign: 'center' }}>
                    <InputNumber
                      min={4}
                      max={200}
                      style={{ margin: '0 16px' }}
                      value={cellCount}
                      onChange={onChangeCellCount}
                    />
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </div>
        <div>
          <hr className={'control-hr'} />
          <h3 className={'control-section-header'}>Alarm's {alarmIcon}</h3>
          <Row>
            <Col span={24} style={{ textAlign: 'center' }}>
              <div style={{ textAlign: 'center', marginLeft: '40px', marginRight: '40px' }}>
                <h4>Count</h4>
                <Row>
                  <Col span={16} style={{ textAlign: 'center' }}>
                    <Slider
                      min={1}
                      max={100}
                      onChange={onChangeAlarmCount}
                      value={typeof alarmCount === 'number' ? alarmCount : 0}
                    />
                  </Col>
                  <Col span={8} style={{ textAlign: 'center' }}>
                    <InputNumber
                      min={1}
                      max={100}
                      style={{ margin: '0 16px' }}
                      value={alarmCount}
                      onChange={onChangeAlarmCount}
                    />
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{ textAlign: 'center' }}>
              <div style={{ textAlign: 'center', marginLeft: '40px', marginRight: '40px' }}>
                <h4>Radius</h4>
                <Row>
                  <Col span={16} style={{ textAlign: 'center' }}>
                    <Slider
                      min={1}
                      max={100}
                      onChange={onChangeAlarmRadius}
                      value={typeof alarmRadius === 'number' ? alarmRadius : 0}
                    />
                  </Col>
                  <Col span={8} style={{ textAlign: 'center' }}>
                    <InputNumber
                      min={1}
                      max={100}
                      style={{ margin: '0 16px' }}
                      value={alarmRadius}
                      onChange={onChangeAlarmRadius}
                    />
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </div>
        <div>
          <hr className={'control-hr'} />
          <h3 className={'control-section-header'}>Noise settings {noiseIcon}</h3>
          <Row>
            <Col span={24} style={{ textAlign: 'center' }}>
              <h4>Noise method</h4>
              <Radio.Group
                options={optionsNoise}
                onChange={onChangeNoiseType}
                value={noiseType}
                optionType='button'
              />
            </Col>
          </Row>
          <br />
          <div style={{ textAlign: 'center', marginLeft: '40px', marginRight: '40px' }}>
            <h4>Xink</h4>
            <Row>
              <Col span={16} style={{ textAlign: 'center' }}>
                <Slider
                  min={1}
                  max={100}
                  onChange={onChangeXINK}
                  value={typeof xink === 'number' ? xink : 0}
                />

              </Col>
              <Col span={8} style={{ textAlign: 'center' }}>
                <InputNumber
                  min={1}
                  max={100}
                  style={{ margin: '0 16px' }}
                  value={xink}
                  onChange={onChangeXINK}
                />
              </Col>
            </Row>
          </div>

          <div style={{ textAlign: 'center', marginLeft: '40px', marginRight: '40px' }}>
            <h4>Yink</h4>
            <Row>
              <Col span={16} style={{ textAlign: 'center' }}>
                <Slider
                  min={1}
                  max={100}
                  onChange={onChangeYINK}
                  value={typeof yink === 'number' ? yink : 0}
                />
              </Col>
              <Col span={8} style={{ textAlign: 'center' }}>
                <InputNumber
                  min={1}
                  max={100}
                  style={{ margin: '0 16px' }}
                  value={yink}
                  onChange={onChangeYINK}
                />
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Control;