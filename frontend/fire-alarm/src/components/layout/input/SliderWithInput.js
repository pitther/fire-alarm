import React from 'react';
import { Col, InputNumber, Row, Slider } from 'antd';

const SliderWithInput = ({
  step,
  label,
  min,
  max,
  numberParameter,
  onChange,
}) => {
  return (
    <div className={'text-center'}>
      <h4>{label}</h4>
      <Row>
        <Col span={16} className={'text-center'}>
          <Slider
            min={min}
            max={max}
            onChange={onChange}
            step={step ? step : 1}
            value={typeof numberParameter === 'number' ? numberParameter : 0}
          />
        </Col>
        <Col span={8} style={{ textAlign: 'center' }}>
          <InputNumber
            min={min}
            max={max}
            value={numberParameter}
            onChange={onChange}
            step={step ? step : 1}
          />
        </Col>
      </Row>
    </div>
  );
};

export default SliderWithInput;
