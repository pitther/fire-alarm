import React, { useState } from 'react';
import { Button } from 'antd';
import Particles from 'react-tsparticles';
import { particlesOptions } from '../../constants/particlesOptions';
import { DotChartOutlined } from '@ant-design/icons';

const BackgroundParticles = () => {
  const [particlesEnabled, setParticlesEnabled] = useState(true);

  const changeParticlesStatus = () => {
    setParticlesEnabled((prevState) => !prevState);
  };

  return (
    <div>
      <Button
        id={'button-disable-particles'}
        icon={<DotChartOutlined />}
        size={'large'}
        onClick={changeParticlesStatus}
      />
      <Particles
        style={{ display: particlesEnabled ? 'block' : 'none' }}
        options={particlesOptions}
      />
    </div>
  );
};

export default BackgroundParticles;
