import React, { createContext, useContext, useEffect } from 'react';
import { BackHandler } from 'react-native';

const BackHandlerContext = createContext();

export function BackHandlerProvider({ children }) {
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', () => true);
    };
  }, []);

  return <BackHandlerContext.Provider value={null}>{children}</BackHandlerContext.Provider>;
}
