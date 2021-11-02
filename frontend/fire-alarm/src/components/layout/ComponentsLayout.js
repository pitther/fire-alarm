import React, { useState } from 'react';
import Control from './Control';
import DataDisplay from './DataDisplay';
import { Drawer } from 'antd';
import Logo from './Logo';
import Canvas from './Canvas';
import ActionButtons from './ActionButtons';
import {
  DATA_DRAWER_BODY_STYLE,
  DATA_DRAWER_HEADER_STYLE,
  DRAWER_CONTENT_WRAPPER_STYLE,
  SETTINGS_DRAWER_BODY_STYLE,
  SETTINGS_DRAWER_HEADER_STYLE,
} from '../../styles/inlineStyles';
import { DATA_ICON, SETTINGS_ICON } from '../../constants/constants';
import BackgroundParticles from './BackgroundParticles';

const ComponentsLayout = () => {
  const [visibleSettingsDrawer, setVisibleSettingsDrawer] = useState(false);
  const [visibleDataDrawer, setVisibleDataDrawer] = useState(false);

  const showSettingsDrawer = () => {
    setVisibleSettingsDrawer(true);
  };

  const showDataDrawer = () => {
    setVisibleDataDrawer(true);
  };

  const onCloseSettingsDrawer = () => {
    setVisibleSettingsDrawer(false);
  };

  const onCloseDataDrawer = () => {
    setVisibleDataDrawer(false);
  };

  return (
    <div>
      <BackgroundParticles />
      <Drawer
        title={<>Settings {SETTINGS_ICON}</>}
        placement="right"
        onClose={onCloseSettingsDrawer}
        visible={visibleSettingsDrawer}
        width={'100%'}
        contentWrapperStyle={DRAWER_CONTENT_WRAPPER_STYLE}
        bodyStyle={SETTINGS_DRAWER_BODY_STYLE}
        headerStyle={SETTINGS_DRAWER_HEADER_STYLE}
      >
        <Control />
      </Drawer>
      <Drawer
        title={<>Data {DATA_ICON}</>}
        placement="left"
        onClose={onCloseDataDrawer}
        visible={visibleDataDrawer}
        width={'100%'}
        contentWrapperStyle={DRAWER_CONTENT_WRAPPER_STYLE}
        bodyStyle={DATA_DRAWER_BODY_STYLE}
        headerStyle={DATA_DRAWER_HEADER_STYLE}
      >
        <DataDisplay />
      </Drawer>
      <div className="container">
        <Logo />
        <hr />
        <Canvas />
        <ActionButtons
          showSettingsDrawer={showSettingsDrawer}
          showDataDrawer={showDataDrawer}
        />
      </div>
    </div>
  );
};

export default ComponentsLayout;
