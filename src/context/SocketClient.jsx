// import React, { createContext, useContext, useState, useEffect } from 'react';
// import io from 'socket.io-client';

// export const SocketContext = createContext();

// export const SocketClientProvider = ({ children }) => {
//   const [socket, setSocket] = useState(null);
//   const [status, setStatus] = useState('Disconnected');
//   const [messages, setMessages] = useState([]);

//   useEffect(() => {
//     const newSocket = io('http://192.168.1.70:3000', {
//       transports: ['websocket'], // Use WebSocket, não polling
//       query: { numApto: "Suite-1" },
//     });

//     setSocket(newSocket);

//     newSocket.on('connect', () => {
//       setStatus('Connected');
//       console.log('connected to websocket server');
//     });

//     newSocket.on('message', (data) => {
//       console.log('Received message from recepcao:', data);
//       setMessages(data);
//     });

//     newSocket.on('current_situation', (data) => {
//       console.log('current_situation:', data.situacao);
//       setMessages(data.situacao);
//     });

//     newSocket.on('disconnect', () => {
//       setStatus('Disconnected');
//       console.log('disconnected from websocket server');
//     });

//     newSocket.on('connect_error', (err) => {
//       console.log('Error connecting to websocket server:', err.message);
//       setStatus(`Connection Failed: ${err.message}`);
//     });

//     return () => newSocket.close();
//   }, []);

//   const sendMessage = (message) => {
//     if (socket) {
//       socket.emit("cozinha", message);
//     } else {
//       console.error('Socket not connected');
//     }
//   };

//   return (
//     <SocketContext.Provider value={{ socket, status, messages, sendMessage }}>
//       {children}
//     </SocketContext.Provider>
//   );
// };

// export const useSocketContext = () => {
//   const context = useContext(SocketContext);
//   if (!context) {
//     throw new Error("useSocketContext must be used within a SocketClientProvider");
//   }
//   return context;
// };




// // Adicionando mais eventos de depuração
// // newSocket.on('error', (err) => {
// //   console.log('Socket error:', err);
// // });
// // newSocket.on('connect_timeout', (err) => {
// //   console.log('Connection timeout:', err);
// // });
// // newSocket.on('reconnect_attempt', () => {
// //   console.log('Attempting to reconnect');
// // });
// // newSocket.on('reconnect_error', (err) => {
// //   console.log('Reconnection error:', err);
// // });
// // newSocket.on('reconnect_failed', () => {
// //   console.log('Reconnection failed');
// // });

// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { Alert } from 'react-native';
// import io from 'socket.io-client';

// export const SocketContext = createContext();

// export const SocketClientProvider = ({ children }) => {
//   const [socket, setSocket] = useState(null);
//   const [status, setStatus] = useState('Disconnected');
//   const [messages, setMessages] = useState([]);
//   const [deviceName, setDeviceName] = useState('');
//   console.log("nome", deviceName)

//   useEffect(() => {
//     if (!deviceName) {
//       Alert.alert('Erro', 'Por favor, defina um nome para o dispositivo antes de conectar.');
//       return;
//     }

//     const newSocket = io('http://192.168.1.70:3000', {
//       transports: ['websocket'],
//       query: { numApto: deviceName.trim() },
//     });

//     setSocket(newSocket);

//     newSocket.on('connect', () => {
//       setStatus('Connected');
//       console.log('connected to websocket server');
//     });

//     newSocket.on('message', (data) => {
//       console.log('Received message from recepcao:', data);
//       setMessages(data);
//     });

//     newSocket.on('current_situation', (data) => {
//       console.log('current_situation:', data.situacao);
//       setMessages(data.situacao);
//     });

//     newSocket.on('disconnect', () => {
//       setStatus('Disconnected');
//       console.log('disconnected from websocket server');
//     });

//     newSocket.on('connect_error', (err) => {
//       console.log('Error connecting to websocket server:', err.message);
//       setStatus(`Connection Failed: ${err.message}`);
//     });

//     return () => newSocket.close();
//   }, [deviceName]);


//   const sendMessage = (message) => {
//     if (socket) {
//       socket.emit("cozinha", message);
//     } else {
//       console.error('Socket not connected');
//     }
//   };

//   const setDeviceNameAndConnect = (name) => {
//     setDeviceName(name);
//   };

//   return (
//     <SocketContext.Provider value={{ socket, status, messages, sendMessage, setDeviceNameAndConnect }}>
//       {children}
//     </SocketContext.Provider>
//   );
// };

// export const useSocketContext = () => {
//   const context = useContext(SocketContext);
//   if (!context) {
//     throw new Error("useSocketContext must be used within a SocketClientProvider");
//   }
//   return context;
// };

import React, { createContext, useContext, useState, useEffect } from 'react';
import io from 'socket.io-client';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const SocketContext = createContext();

export const SocketClientProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [status, setStatus] = useState('Disconnected');
  const [messages, setMessages] = useState([]);
  const [deviceName, setDeviceName] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const initializeSocket = async () => {
      // const storedDeviceName = await AsyncStorage.getItem('deviceName');
      const storedDeviceName = 'deviceName';

      if (storedDeviceName) {
        setDeviceName(storedDeviceName);
        //ip mac http://192.168.1.70:3000
        //ip win http://192.168.1.80:3000
        const newSocket = io('http://192.168.1.69:3333', {
          transports: ['websocket'],
          // query: { numApto: storedDeviceName.trim() },
          query: { clientName: storedDeviceName.trim() },
        });

        setSocket(newSocket);

        newSocket.on('connect', () => {
          setStatus('Connected');
          setIsConnected(true);
          console.log('connected to websocket server');
        });

        newSocket.on('message', (data) => {
          console.log('Received message from recepcao:', data);
          setMessages(data);
        });

        newSocket.on('current_situation', (data) => {
          console.log('current_situation:', data.situacao);
          setMessages(data.situacao);
        });

        newSocket.on('disconnect', () => {
          setStatus('Disconnected');
          setIsConnected(false);
          console.log('disconnected from websocket server');
        });

        newSocket.on('connect_error', (err) => {
          // console.log('Error connecting to websocket server:', err.message);
          setStatus(`Connection Failed: ${err.message}`);
        });

        return () => newSocket.close();
      } else {
        Alert.alert('Erro', 'Por favor, defina um nome para o dispositivo antes de conectar.');
        // console.log('nome do quarto');
      }
    };

    initializeSocket();
  }, [deviceName]);

  const sendMessage = (message) => {
    if (socket) {
      socket.emit("cozinha", message);
    } else {
      console.error('Socket not connected');
    }
  };

  const setDeviceNameAndConnect = async (name) => {
    if (name.trim() !== '') {
      await AsyncStorage.setItem('deviceName', name.trim());
      setDeviceName(name.trim());
    } else {
      Alert.alert('Erro', 'Por favor, defina um nome para o dispositivo antes de conectar.');
    }
  };

  // if (!isConnected) {
  //   // return null; // Bloqueia o carregamento dos contextos seguintes até a conexão
  //   console.log("eu que caisei esse problema")
  // }

  return (
    <SocketContext.Provider value={{ socket, status, messages, sendMessage, setDeviceNameAndConnect }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocketContext must be used within a SocketClientProvider");
  }
  return context;
};
