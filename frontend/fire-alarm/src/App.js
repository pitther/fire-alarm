import './App.css';
import React from 'react';

import GlobalContextProvider from './components/app/GlobalContextProvider';
import DataTracker from './components/app/DataTracker';
import ComponentsLayout from './components/layout/ComponentsLayout';
import BackgroundParticles from './components/layout/BackgroundParticles';

function App() {
  return (
    <GlobalContextProvider>
      <DataTracker />
      <ComponentsLayout />
    </GlobalContextProvider>
  );
}

export default App;
