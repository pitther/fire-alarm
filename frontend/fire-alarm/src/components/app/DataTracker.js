import React, { useEffect } from 'react';
import { useAppControlMethods } from '../../hooks/AppControlMethods';
import { ParametersContext } from '../../context/ParametersContext';

const DataTracker = (props) => {
  const { createRelevantCellData, onIrrelevantData, handleResponseData } =
    useAppControlMethods(ParametersContext);

  useEffect(() => {
    createRelevantCellData();
  }, [createRelevantCellData]);

  useEffect(() => {
    onIrrelevantData();
  }, [onIrrelevantData]);

  useEffect(() => {
    handleResponseData();
  }, [handleResponseData]);

  return <div>{props.children}</div>;
};

export default DataTracker;
