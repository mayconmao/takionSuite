import React, { createContext, useContext, useState, useEffect, } from 'react';

const ControlsContext = createContext();

export const ControlsProvider = ({ children }) => {
  const [temperatura, setTemperatura] = useState(20);
  const [velocidade, setVelocidade] = useState(1);

  const contextValue = {
    temperatura,
    velocidade,
    setTemperatura,
    setVelocidade
  };

  return (
    <ControlsContext.Provider value={contextValue}>
      {children}
    </ControlsContext.Provider>
  );
};

export const useControlsContext = () => {
  const context = useContext(ControlsContext);
  if (!context) {
    throw new Error('useBleContext must be used within a BleProvider');
  }
  return context;
};