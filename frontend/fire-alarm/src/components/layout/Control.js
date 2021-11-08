import React, { useContext } from 'react';
import { Col, Radio, Row, Space } from 'antd';
import { ParametersContext } from '../../context/ParametersContext';
import Checkbox from 'antd/es/checkbox/Checkbox';
import { ALARM_ICON, CANVAS_ICON, NOISE_ICON } from '../../constants/constants';
import SliderWithInput from './input/SliderWithInput';

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

  const onChangeAlarmChance = (value) => {
    alarms.setChance(value);
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
      case 'chances': {
        render.setChances(e.target.checked);
        return;
      }
      default: {
        return;
      }
    }
  };

  const optionsRender = [
    {
      label: 'Fire Expectancy',
      name: 'fire_expectancy',
      onChange: onChangeRender,
      value: render.fireExpectancy,
    },
    {
      label: 'Importance',
      name: 'importance',
      onChange: onChangeRender,
      value: render.importance,
    },
    {
      label: `Alarms`,
      name: 'alarm',
      onChange: onChangeRender,
      value: render.alarm,
      disabled: !methodResult.successful,
    },
    /*{
      label: `Chances`,
      name: 'chances',
      onChange: onChangeRender,
      value: render.chances,
      disabled: !methodResult.successful,
    },*/
  ];

  const optionsRenderAdditional = [
    {
      label: 'Grid',
      name: 'grid',
      onChange: onChangeRender,
      value: render.grid,
    },
  ];

  return (
    <div className={'control-container'}>
      <div className="control-parameters-block">
        <div className={'text-center'}>
          <h3 className={'control-section-header'}>
            Canvas settings {CANVAS_ICON}
          </h3>
          <h4>Render</h4>
          <Row>
            <Col span={12}>
              <Space
                direction="vertical"
                className={'text-left'}
                style={{ float: 'left' }}
              >
                {optionsRender.map((option) => {
                  return (
                    <Checkbox
                      name={option.name}
                      onChange={option.onChange}
                      value={option.value}
                      checked={option.value}
                      disabled={option?.disabled}
                    >
                      {option.label}
                    </Checkbox>
                  );
                })}
              </Space>
            </Col>
            <Col span={12}>
              <Space direction="vertical" className={'text-left'}>
                {optionsRenderAdditional.map((option) => {
                  return (
                    <Checkbox
                      name={option.name}
                      onChange={option.onChange}
                      value={option.value}
                      checked={option.value}
                    >
                      {option.label}
                    </Checkbox>
                  );
                })}
              </Space>
            </Col>
          </Row>
          <SliderWithInput
            label={'Cell count row/col'}
            max={100}
            min={1}
            onChange={onChangeCellCount}
            numberParameter={cell.count}
          />
        </div>

        <hr className={'control-hr'} />
        <div className={'text-center'}>
          <h3 className={'control-section-header'}>Alarm's {ALARM_ICON}</h3>
          <SliderWithInput
            label={'Count'}
            max={100}
            min={1}
            onChange={onChangeAlarmCount}
            numberParameter={alarms.count}
          />
          <SliderWithInput
            label={'Radius'}
            min={1}
            max={100}
            onChange={onChangeAlarmRadius}
            numberParameter={alarms.radius}
          />
          <SliderWithInput
            label={'Trigger chance'}
            min={0.05}
            max={1}
            step={0.01}
            onChange={onChangeAlarmChance}
            numberParameter={alarms.chance}
          />
        </div>

        <hr className={'control-hr'} />
        <div className={'text-center'}>
          <h3 className={'control-section-header'}>
            Noise settings {NOISE_ICON}
          </h3>

          <h4>Noise method</h4>

          <Radio.Group
            options={optionsNoise}
            onChange={onChangeNoiseType}
            value={noise.type}
            optionType="button"
          />

          <br />
          <br />

          <SliderWithInput
            label={'Xink'}
            max={100}
            min={1}
            step={0.01}
            onChange={onChangeXINK}
            numberParameter={noise.xink}
          />

          <SliderWithInput
            label={'Yink'}
            max={100}
            min={1}
            step={0.05}
            onChange={onChangeYINK}
            numberParameter={noise.yink}
          />
        </div>
      </div>
    </div>
  );
};

export default Control;
