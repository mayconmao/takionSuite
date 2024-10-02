// import React, { createContext, useState, useContext, useEffect, useRef, NativeModules } from 'react';
// import { View, TouchableWithoutFeedback, Modal, StyleSheet, Image } from 'react-native';

// const ScreenSaverContext = createContext();

// export const useScreenSaver = () => useContext(ScreenSaverContext);

// const RenderScreenSaver = ({ onDismiss }) => (
//   <Modal
//     visible={true}
//     transparent={true}
//     animationType="fade"
//     onRequestClose={onDismiss}
//     statusBarTranslucent={true}>
//     <TouchableWithoutFeedback onPress={onDismiss}>
//       <View style={styles.screenSaver}>
//         <Image
//           source={require('../assets/black.bmp')}
//           style={styles.backgroundImage}
//         />
//       </View>
//     </TouchableWithoutFeedback>
//   </Modal>
// );

// export const ScreenSaverProvider = ({ children }) => {
//   const [isScreenSaverActive, setIsScreenSaverActive] = useState(false);
//   const inactivityTimer = useRef(null);

//   const resetInactivityTimer = () => {
//     console.log("Resetando o temporizador de inatividade"); // Para depuração
//     clearTimeout(inactivityTimer.current); // Limpa o temporizador atual antes de definir um novo
//     inactivityTimer.current = setTimeout(() => {
//       console.log("Protetor de tela ativado"); // Para depuração
//       setIsScreenSaverActive(true);
//     }, 15000); // 15 segundos de inatividade para ativar o protetor de tela
//   };

//   useEffect(() => {
//     resetInactivityTimer();
//     return () => clearTimeout(inactivityTimer.current);
//   }, []);

//   const handleDismiss = () => {
//     setIsScreenSaverActive(false);
//     resetInactivityTimer();
//   };

//   return (
//     <ScreenSaverContext.Provider value={{ isScreenSaverActive, resetInactivityTimer }}>
//       <TouchableWithoutFeedback onPress={resetInactivityTimer}>
//         <View style={{ flex: 1, backgroundColor: 'black' }}>
//           {children}
//           {isScreenSaverActive && <RenderScreenSaver onDismiss={handleDismiss} />}
//         </View>
//       </TouchableWithoutFeedback>
//     </ScreenSaverContext.Provider>
//   );
// };

// const styles = StyleSheet.create({
//   screenSaver: {
//     flex: 1,
//     // backgroundColor: 'black',
//     // backgroundColor: 'rgba(0, 0, 0, 1)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   backgroundImage: {
//     flex: 1,
//     width: '100%',
//     height: '100%',
//     resizeMode: 'cover', // Garante que a imagem cubra toda a tela, mantendo suas proporções
//   },
// });

import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { View, TouchableWithoutFeedback, Modal, Image, StyleSheet, NativeModules, Platform } from 'react-native';

// Contexto do Protetor de Tela
const ScreenSaverContext = createContext();

// Hook personalizado para usar o contexto
export const useScreenSaver = () => useContext(ScreenSaverContext);

// Componente RenderScreenSaver
const RenderScreenSaver = ({ onDismiss }) => (
  <Modal
    visible={true}
    transparent={true}
    animationType="fade"
    onRequestClose={onDismiss}
    statusBarTranslucent={true}>
    <TouchableWithoutFeedback onPress={onDismiss}>
      <View style={styles.screenSaver}>
        <Image
          source={require('../assets/preto.png')}
          style={styles.backgroundImage}
        />
      </View>
    </TouchableWithoutFeedback>
  </Modal>
);

// Provider do Protetor de Tela
export const ScreenSaverProvider = ({ children }) => {
  const [isScreenSaverActive, setIsScreenSaverActive] = useState(false);
  const inactivityTimer = useRef(null);

  const resetInactivityTimer = () => {
    clearTimeout(inactivityTimer.current);
    inactivityTimer.current = setTimeout(() => {
      setIsScreenSaverActive(true);
      // Diminuir a luminosidade quando o protetor de tela é ativado
      if (Platform.OS === 'android') {
        NativeModules.ScreenBrightness.setBrightness(0.0);
      }
    }, 1000); //reset time
  };

  useEffect(() => {
    resetInactivityTimer();
    return () => {
      clearTimeout(inactivityTimer.current);
      // Restaurar a luminosidade quando o componente é desmontado
      if (Platform.OS === 'android') {
        NativeModules.ScreenBrightness.setBrightness(0.5);
      }
    };
  }, []);

  const handleDismiss = () => {
    setIsScreenSaverActive(false);
    resetInactivityTimer();
    // Restaurar a luminosidade quando o protetor de tela é desativado
    if (Platform.OS === 'android') {
      NativeModules.ScreenBrightness.setBrightness(0.5);
    }
  };

  return (
    <ScreenSaverContext.Provider value={{ isScreenSaverActive, resetInactivityTimer }}>
      <TouchableWithoutFeedback onPress={resetInactivityTimer}>
        <View style={{ flex: 1 }}>
          {children}
          {isScreenSaverActive && <RenderScreenSaver onDismiss={handleDismiss} />}
        </View>
      </TouchableWithoutFeedback>
    </ScreenSaverContext.Provider>
  );
};

// Estilos
const styles = StyleSheet.create({
  screenSaver: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000'
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
