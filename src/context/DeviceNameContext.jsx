import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export const DeviceNameContext = createContext();

export const DeviceNameProvider = ({ children }) => {
  const [deviceName, setDeviceName] = useState("teste");
  const [isLoading, setIsLoading] = useState(true);
  // const navigation = useNavigation();

  // useEffect(() => {
  //   const checkDeviceName = async () => {
  //     const storedDeviceName = await AsyncStorage.getItem('deviceName');
  //     if (!storedDeviceName) {
  //       // Redireciona para a tela de configurações se o nome do dispositivo não estiver definido
  //       // navigation.navigate('Settings');
  //     } else {
  //       setDeviceName(storedDeviceName);
  //     }
  //     setIsLoading(false);
  //   };

  //   checkDeviceName();
  // }, []);

  // const setDeviceNameAndSave = async (name) => {
  //   if (name.trim()) {
  //     await AsyncStorage.setItem('deviceName', name.trim());
  //     setDeviceName(name.trim());
  //   }
  // };

  // if (isLoading) {
  //   return null; // Aguarda o carregamento
  // }

  return (
    // <DeviceNameContext.Provider value={{ deviceName, setDeviceNameAndSave }}>

    <DeviceNameContext.Provider value={{ deviceName }}>
      {children}
    </DeviceNameContext.Provider>
  );
};

export const useDeviceName = () => {
  const context = useContext(DeviceNameContext);
  if (!context) {
    throw new Error("useDeviceName must be used within a DeviceNameProvider");
  }
  return context;
};
