import React, { useContext } from 'react';
import { Col, InputNumber, Radio, Row, Slider, Space } from 'antd';
import { ParametersContext } from '../../context/ParametersContext';
import Checkbox from 'antd/es/checkbox/Checkbox';
import { ALARM_ICON, CANVAS_ICON, NOISE_ICON } from '../../constants/constants';

const optionsNoise = [
  { label: 'Perlin', value: 'perlin' },
  { label: 'Simplex', value: 'simplex' },
];

const Control = () => {
  const { noise, alarms, cell, methodResult, render } =
    useContext(ParametersContext);

  const onChangeXINK = (value) => {
    noise.setXink(value);
    noise.setYink(value);
  };

  const onChangeYINK = (value) => {
    noise.setYink(value);
    noise.setXink(value);
  };

  const onChangeAlarmRadius = (value) => {
    alarms.setRadius(value);
  };

  const onChangeAlarmCount = (value) => {
    alarms.setCount(value);
  };

  const onChangeCellCount = (value) => {
    cell.setCount(value);
  };

  const onChangeNoiseType = (e) => {
    noise.setType(e.target.value);
  };

  const onChangeRender = (e) => {
    switch (e.target.name) {
      case 'fire_expectancy': {
        render.setFireExpectancy(e.target.checked);
        return;
      }
      case 'importance': {
        render.setImportance(e.target.checked);
        return;
      }
      case 'alarm': {
        render.setAlarm(e.target.checked);
        return;
      }
      case 'grid': {
        render.setGrid(e.target.checked);
        return;
      }
      default: {
        return;
      }
    }
  };

  return (
    <div
      className={'control-container'}
      /*
      style={loading ? { pointerEvents: 'none', opacity: 0.7 } : {}}
*/
    >
      <div className="control-parameters-block">
        <div>
          <h3 className={'control-section-header'}>
            Canvas settings {CANVAS_ICON}
          </h3>
          <Row>
            <Col span={24} style={{ textAlign: 'center' }}>
              <h4>Render</h4>
              <Row>
                <Col span={12}>
                  <Space direction="vertical" style={{ textAlign: 'left' }}>
                    <Checkbox
                      name={'fire_expectancy'}
                      onChange={onChangeRender}
                      value={render.fireExpectancy}
                      checked={render.fireExpectancy}
                    >
                      Fire Expectancy
                    </Checkbox>

                    <Checkbox
                      name={'importance'}
                      onChange={onChangeRender}
                      value={render.importance}
                      checked={render.importance}
                    >
                      Importance
                    </Checkbox>

                    <Checkbox
                      name={'alarm'}
                      onChange={onChangeRender}
                      value={render.alarm}
                      checked={render.alarm}
                      disabled={!methodResult.successful}
                    >
                      Alarm's
                    </Checkbox>
                  </Space>
                </Col>
                <Col span={12}>
                  <Space direction="vertical" style={{ textAlign: 'left' }}>
                    <Checkbox
                      name={'grid'}
                      onChange={onChangeRender}
                      value={render.grid}
                      checked={render.grid}
                    >
                      Grid
                    </Checkbox>
                  </Space>
                </Col>
              </Row>
              <div
                style={{
                  textAlign: 'center',
                }}
              >
                <h4>Cell count row/col</h4>
                <Row>
                  <Col span={16} style={{ textAlign: 'center' }}>
                    <Slider
                      min={4}
                      max={200}
                      onChange={onChangeCellCount}
                      value={typeof cell.count === 'number' ? cell.count : 0}
                    />
                  </Col>
                  <Col span={8} style={{ textAlign: 'center' }}>
                    <InputNumber
                      min={4}
                      max={200}
                      value={cell.count}
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
          <h3 className={'control-section-header'}>Alarm's {ALARM_ICON}</h3>
          <Row>
            <Col span={24} style={{ textAlign: 'center' }}>
              <div
                style={{
                  textAlign: 'center',
                }}
              >
                <h4>Count</h4>
                <Row>
                  <Col span={16} style={{ textAlign: 'center' }}>
                    <Slider
                      min={1}
                      max={100}
                      onChange={onChangeAlarmCount}
                      value={
                        typeof alarms.count === 'number' ? alarms.count : 0
                      }
                    />
                  </Col>
                  <Col span={8} style={{ textAlign: 'center' }}>
                    <InputNumber
                      min={1}
                      max={100}
                      value={alarms.count}
                      onChange={onChangeAlarmCount}
                    />
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{ textAlign: 'center' }}>
              <div
                style={{
                  textAlign: 'center',
                }}
              >
                <h4>Radius</h4>
                <Row>
                  <Col span={16} style={{ textAlign: 'center' }}>
                    <Slider
                      min={1}
                      max={100}
                      onChange={onChangeAlarmRadius}
                      value={
                        typeof alarms.radius === 'number' ? alarms.radius : 0
                      }
                    />
                  </Col>
                  <Col span={8} style={{ textAlign: 'center' }}>
                    <InputNumber
                      min={1}
                      max={100}
                      value={alarms.radius}
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
          <h3 className={'control-section-header'}>
            Noise settings {NOISE_ICON}
          </h3>
          <Row>
            <Col span={24} style={{ textAlign: 'center' }}>
              <h4>Noise method</h4>
              <Radio.Group
                options={optionsNoise}
                onChange={onChangeNoiseType}
                value={noise.type}
                optionType="button"
              />
            </Col>
          </Row>
          <br />
          <div
            style={{
              textAlign: 'center',
            }}
          >
            <h4>Xink</h4>
            <Row>
              <Col span={16} style={{ textAlign: 'center' }}>
                <Slider
                  min={1}
                  max={100}
                  onChange={onChangeXINK}
                  value={typeof noise.xink === 'number' ? noise.xink : 0}
                />
              </Col>
              <Col span={8} style={{ textAlign: 'center' }}>
                <InputNumber
                  min={1}
                  max={100}
                  value={noise.xink}
                  onChange={onChangeXINK}
                />
              </Col>
            </Row>
          </div>

          <div
            style={{
              textAlign: 'center',
            }}
          >
            <h4>Yink</h4>
            <Row>
              <Col span={16} style={{ textAlign: 'center' }}>
                <Slider
                  min={1}
                  max={100}
                  onChange={onChangeYINK}
                  value={typeof noise.yink === 'number' ? noise.yink : 0}
                />
              </Col>
              <Col span={8} style={{ textAlign: 'center' }}>
                <InputNumber
                  min={1}
                  max={100}
                  value={noise.yink}
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
