import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { PermissionsAndroid, Platform, Modal, Alert, Text, View, BackHandler } from 'react-native';
import { NativeModules, NativeEventEmitter, StyleSheet } from "react-native";
import BleManager, {
  BleScanCallbackType,
  BleScanMatchMode,
  BleScanMode,
} from 'react-native-ble-manager';
import { Buffer } from 'buffer';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);
const BleContext = createContext();

const SECONDS_TO_SCAN_FOR = 1;
const SERVICE_UUIDS = [];
const ALLOW_DUPLICATES = false;

export const BleProvider = ({ children }) => {
  const [permission, setPermission] = useState(false);
  const [bluetoothOn, setBluetoothOn] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [peripherals, setPeripherals] = useState(new Map());
  const [desiredDeviceName, setDesiredDeviceName] = useState('Takion-BT04-01'); //Takion-BT04-01
  const [noConnection, setNoConnection] = useState(false);
  const [peripheralId, setPeripheralId] = useState({});
  const [dataReceived, setDataReceived] = useState([]);
  const [start, setStart] = useState(false);

  const [characteristicUUID, setCharacteristicUUID] = useState('');
  const [serviceUUID, setServiceUUID] = useState('');

  //estados de reconexao
  const [attemptingReconnect, setAttemptingReconnect] = useState(false);
  const [modal, setModal] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const reconnectAttempts = useRef(0);

  const [iconnect, seIconnect] = useState(false)

  const [select, setSelect] = useState(null);
  const [selectedControl, setSelectedControl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const enableBluetooth = async () => {
    try {
      const state = await BleManager.checkState();
      console.log("stado do ble", state)
      switch (state) {
        case 'on':
          // console.log('Bluetooth está ativado', state);
          return setBluetoothOn(true);
        case 'off':
          console.log('Bluetooth está desativado', state);
          return on();
        case 'poweredOn':
          // console.log('Bluetooth está ativado', state);
          return setBluetoothOn(true);
        case 'poweredOff':
          console.log('Bluetooth está desativado', state);
          return on();
        default:
          console.log('Estado do Bluetooth desconhecido:', state);
          return false;
      }
    } catch (error) {
      console.error('Erro ao verificar o estado do Bluetooth:', error);
      return false;
    }
  };

  const on = async () => {
    if (Platform.OS === 'ios') {
      // No iOS, você pode direcionar o usuário para as configurações do Bluetooth
      // Linking.openURL('App-Prefs:root=BLUETOOTH')
      try {
        Alert.alert('Controller Precisa que ligue o Bluetooth', [
          { text: 'OK', onPress: () => { } },
        ])
      } catch (error) {
        Alert.alert('Controller Precisa que ligue o Bluetooth', [
          { text: 'OK', onPress: () => { } },
        ])
      }
    } else {
      // No Android, você pode solicitar permissões para ativar o Bluetooth
      // Note que você pode precisar de permissões no AndroidManifest.xml
      await BleManager.enableBluetooth();
    }

    return
  }

  const startScan = () => {
    if (!isScanning) {
      // reset found peripherals before scan
      setPeripherals(new Map());

      try {
        console.debug('[startScan] starting scan...');
        setIsScanning(true);
        BleManager.scan(SERVICE_UUIDS, SECONDS_TO_SCAN_FOR, ALLOW_DUPLICATES, {
          matchMode: BleScanMatchMode.Sticky,
          scanMode: BleScanMode.LowLatency,
          callbackType: BleScanCallbackType.AllMatches,
        })
          .then(() => {
            console.debug('[startScan] scan promise returned successfully.');
          })
          .catch((err) => {
            console.error('[startScan] ble scan returned in error', err);
          });
      } catch (error) {
        console.error('[startScan] ble scan error thrown', error);
      }
    }
  };

  const handleStopScan = () => {
    setIsScanning(false);
    console.debug('[handleStopScan] scan is stopped.');
  };

  const handleDiscoverPeripheral = (peripheral) => {

    if (!peripheral.name) {
      peripheral.name = 'NO NAME';
    }
    if (peripheral.name === desiredDeviceName) {
      console.log("numero ID:", desiredDeviceName)
      setPeripherals(map => new Map(map.set(peripheral.id, peripheral)));
    }
    // if (peripheral.id === desiredDeviceName) {
    //   console.log("numero ID:", desiredDeviceName)
    //   setPeripherals(map => new Map(map.set(peripheral.id, peripheral)));
    // }

  };

  const togglePeripheralConnection = async (device) => {
    if (device && device.connected) {
      try {
        await BleManager.disconnect(device.id);
      } catch (error) {
        console.error(
          `[togglePeripheralConnection][${device.id}] error when trying to disconnect device.`,
          error,
        );
      }
    } else {
      await connectPeripheral(device);
    }
  };

  const connectPeripheral = async (device) => {
    try {
      if (device) {
        setPeripherals(map => {
          let p = map.get(device.id);
          if (p) {
            p.connecting = true;
            return new Map(map.set(p.id, p));
          }
          return map;
        });

        await BleManager.connect(device.id);
        // console.debug(`[connectPeripheral][${device.id}] connected.`);

        setPeripherals(map => {
          let p = map.get(device.id);
          if (p) {
            p.connecting = false;
            p.connected = true;
            setNoConnection(true)
            return new Map(map.set(p.id, p));
          }
          return map;
        });

        // before retrieving services, it is often a good idea to let bonding & connection finish properly
        await sleep(900);

        /* Test read current RSSI value, retrieve services first */
        const peripheralData = await BleManager.retrieveServices(device.id);

        if (peripheralData.services && peripheralData.characteristics) {
          if (peripheralData.characteristics.length > 0) {
            const ultimoObjeto = peripheralData.characteristics[peripheralData.characteristics.length - 1];

            setCharacteristicUUID(ultimoObjeto.characteristic);
            setServiceUUID(ultimoObjeto.service);

            // console.log("AQUI SERVICE (iOS):", ultimoObjeto);
            // readCharacteristic()
            // startNotification()
          } else {
            console.log('A matriz characteristics está vazia (iOS).');
          }
        }

        setPeripheralId(device.id);
        seIconnect(true);

        const rssi = await BleManager.readRSSI(device.id);

        setPeripherals(map => {
          let p = map.get(device.id);
          if (p) {
            p.rssi = rssi;
            return new Map(map.set(p.id, p));
          }
          return map;
        });
      }
    } catch (error) {
      console.error(
        `[connectPeripheral][${device.id}] connectPeripheral error`,
        error,
      );
    }
  };

  const handleConnectPeripheral = (event) => {
    console.log(`[handleConnectPeripheral][${event.peripheral}] connected.`);
  };

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const handleDisconnectedPeripheral = async (event) => {
    // console.debug(
    //   `[handleDisconnectedPeripheral][${event.peripheral}] disconnected.`,
    // );
    // setModal(true); // Exibe o modal de "Conectando..."
    // // Atualiza o estado do dispositivo no mapa de periféricos
    // setPeripherals((prevMap) => {
    //   const updatedMap = new Map(prevMap);
    //   const peripheral = updatedMap.get(event.peripheral);
    //   if (peripheral) {
    //     peripheral.connected = false;
    //     updatedMap.set(event.peripheral, peripheral);
    //   }
    //   return updatedMap;
    // });
    // // //verifica a conexao
    // if (!attemptingReconnect && reconnectAttempts.current < 3) { // Limita a 3 tentativas
    //   console.log("dentro do if", reconnectAttempts)
    //   setAttemptingReconnect(true);
    //   await reconnectPeripheral(event.peripheral);
    //   reconnectAttempts.current += 1; // Atualiza diretamente o valor de ref
    //   setAttemptingReconnect(false); // Reset após a tentativa
    //   if (reconnectAttempts.current >= 3) {
    //     showReconnectAlert(); // Mostra o alerta após 3 tentativas falhas
    //   }
    // }

    if (!attemptingReconnect) {
      // console.log(`Tentativa de reconexão: ${reconnectAttempts.current + 1}`);
      setModal(true); // Exibe o modal de "Conectando..."
      setAttemptingReconnect(true);

      // Atualiza o estado do dispositivo no mapa de periféricos
      setPeripherals((prevMap) => {
        const updatedMap = new Map(prevMap);
        const peripheral = updatedMap.get(event.peripheral);
        if (peripheral) {
          peripheral.connected = false;
          updatedMap.set(event.peripheral, peripheral);
        }
        return updatedMap;
      });

      await reconnectPeripheral(event.peripheral); // Tentativa de reconexão
    }

  };

  //funcao de reconexao 
  const reconnectPeripheral = async (peripheralId) => {
    // BleManager.connect(peripheralId)
    //   .then(() => {
    //     console.log("Reconexão bem-sucedida.");
    //     // Reinicia a contagem de tentativas e o estado de tentativa de reconexão
    //     setModal(false);
    //     // setReconnectAttempts(0);
    //     setAttemptingReconnect(false);

    //     // Atualiza o estado de conexão do dispositivo
    //     setPeripherals((prevMap) => {
    //       const updatedMap = new Map(prevMap);
    //       const peripheral = updatedMap.get(peripheralId);
    //       if (peripheral) {
    //         peripheral.connected = true;
    //         updatedMap.set(peripheralId, peripheral);
    //       }
    //       return updatedMap;
    //     });
    //   })
    //   .catch((error) => {
    //     console.log("Erro na tentativa de reconexão", error);
    //     setAttemptingReconnect(false);
    //   });

    BleManager.connect(peripheralId)
      .then(() => {
        console.log("Reconexão bem-sucedida.");
        setModal(false); // Esconde o modal de "Conectando..."
        reconnectAttempts.current = 0; // Reinicia a contagem de tentativas após sucesso
        setAttemptingReconnect(false); // Reseta o estado de tentativa de reconexão

        // Atualiza o estado de conexão do dispositivo
        setPeripherals((prevMap) => {
          const updatedMap = new Map(prevMap);
          const peripheral = updatedMap.get(peripheralId);
          if (peripheral) {
            peripheral.connected = true;
            updatedMap.set(peripheralId, peripheral);
          }
          return updatedMap;
        });
      })
      .catch((error) => {
        console.error("Erro na tentativa de reconexão:", error);
        reconnectAttempts.current += 1; // Incrementa a contagem apenas em caso de falha
        setAttemptingReconnect(false); // Reseta o estado de tentativa de reconexão após falha
        setModal(false); // Esconde o modal de "Conectando..."

        // if (reconnectAttempts.current >= 3) {
        //   showReconnectAlert(); // Mostra o alerta após 3 tentativas falhas
        // }

        // if (reconnectAttempts.current === 3) {
        //   showReconnectAlert(); // Exibe o alerta a cada 3 tentativas falhas
        // } else if (reconnectAttempts.current > 3) {
        //   // Se o usuário optar por continuar após o alerta, tenta reconectar novamente
        //   handleDisconnectedPeripheral({ peripheral: peripheralId });
        // }

      });
  };

  const showReconnectAlert = () => {
    setModal(false);
    Alert.alert(
      "Bluetooth não está disponível",
      "Não foi possível reconectar. Entre em contato com a recepção",
      [
        {
          text: "Sim", onPress: () => {
            setModal(true); // Mostra o modal novamente
            // setReconnectAttempts(0); // Reinicia as tentativas
            reconnectAttempts.current = 0;
            // setIsReconnecting(true); // Reinicia o processo de reconexão
            // reconnectPeripheral(peripheralId);
            // handleDisconnectedPeripheral()
            setAttemptingReconnect(true); // Permite novas tentativas de reconexão
            reconnectPeripheral(peripheralId.current);
          }
        },
        // {
        //   text: "Não", onPress: () => {
        //     console.log("Usuário optou por não reconectar");
        //     // setReconnectAttempts(0); // Reinicia as tentativas para futuras conexões
        //     // setIsReconnecting(false); // Permite novas tentativas de reconexão
        //     setModal(true);
        //     // Aqui você pode adicionar lógica para navegar de volta à tela inicial ou outra ação
        //   }
        // }
      ],
      { cancelable: false }
    );
  };

  const renderConnectingModal = () => (
    <Modal
      visible={modal}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setModal(false)}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Bluetooth não está disponível</Text>
          <Text style={styles.modalText}>Não foi possível reconectar. Entre em contato com a recepção</Text>
          <Text style={styles.modalText}>Reconectando...</Text>
        </View>
      </View>
    </Modal>
  );

  const decodeValueAsync = async (value) => {
    // Simula uma operação que pode falhar aleatoriamente
    // if (Math.random() > 0.5) {
    return Buffer.from(value, 'base64').toString('utf-8');
    // } else {
    //   throw new Error('Falha na decodificação');
    // }
  };

  //ler os dados do esp32
  const handleUpdateValueForCharacteristic = async ({ value }) => {
    try {
      // Decodificar o valor de base64 para uma string UTF-8
      // const decodedValue = Buffer.from(value, 'base64').toString('utf-8');
      const decodedValue = await decodeValueAsync(value);
      // Criar um objeto com uma nova entrada no formato desejado e atualizar o estado
      setDataReceived((prevValorRecebido) => [
        ...prevValorRecebido,
        { id: prevValorRecebido.length + 1, title: decodedValue }
      ]);
    } catch (error) {
      console.error('Falha ao decodificar o valor:', error);
    }
  };

  const handleAndroidPermissions = () => {
    if (Platform.OS === 'android' && Platform.Version >= 31) {
      PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]).then(result => {
        if (result) {
          console.debug(
            '[handleAndroidPermissions] User accepts runtime permissions android 12+',
          );
        } else {
          console.error(
            '[handleAndroidPermissions] User refuses runtime permissions android 12+',
          );
        }
      });
    } else if (Platform.OS === 'android' && Platform.Version >= 23) {
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ).then(checkResult => {
        if (checkResult) {
          console.debug(
            '[handleAndroidPermissions] runtime permission Android <12 already OK',
          );
        } else {
          PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ).then(requestResult => {
            if (requestResult) {
              console.debug(
                '[handleAndroidPermissions] User accepts runtime permission android <12',
              );
            } else {
              console.error(
                '[handleAndroidPermissions] User refuses runtime permission android <12',
              );
            }
          });
        }
      });
    }
  };

  useEffect(() => {
    try {
      BleManager.start({ showAlert: true })
        .then(() => console.debug('BleManager started.'))
        .catch((error) =>
          console.error('BeManager could not be started.', error),
        );
    } catch (error) {
      console.error('unexpected error starting BleManager.', error);
      return;
    }

    const listeners = [
      bleManagerEmitter.addListener(
        'BleManagerDiscoverPeripheral',
        handleDiscoverPeripheral,
      ),
      bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan),
      bleManagerEmitter.addListener(
        'BleManagerDisconnectPeripheral',
        handleDisconnectedPeripheral,
      ),
      bleManagerEmitter.addListener(
        'BleManagerDidUpdateValueForCharacteristic',
        handleUpdateValueForCharacteristic,
      ),
      bleManagerEmitter.addListener(
        'BleManagerConnectPeripheral',
        handleConnectPeripheral,
      ),
    ];

    // setup();
    return () => {
      console.debug('[app] main component unmounting. Removing listeners...');
      for (const listener of listeners) {
        listener.remove();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [desiredDeviceName]);

  const contextValue = {
    isScanning,
    peripherals,
    desiredDeviceName,
    permission,
    bluetoothOn,
    peripheralId,
    dataReceived,
    start,
    characteristicUUID,
    serviceUUID,
    select,
    isPlaying,
    selectedControl,
    iconnect,
    setSelect,
    setSelectedControl,
    setStart,
    startScan,
    togglePeripheralConnection,
    enableBluetooth,
    setPermission,
    handleConnectPeripheral,
    connectPeripheral,
    setPeripherals,
    setDesiredDeviceName,
  };

  return (
    <BleContext.Provider value={contextValue}>
      {children}
      {renderConnectingModal()}
    </BleContext.Provider>
  );
};

export const useBleContext = () => {
  const context = useContext(BleContext);
  if (!context) {
    throw new Error('useBleContext must be used within a BleProvider');
  }
  return context;
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)"
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});


// export const BleContext = createContext();

// const BleManagerModule = NativeModules.BleManager;
// const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

// export const BleProvider = ({ children }) => {
//   const [permission, setPermission] = useState(false);
//   const [bluetoothOn, setBluetoothOn] = useState(false);
//   const [isScanning, setIsScanning] = useState(false);
//   const [peripherals, setPeripherals] = useState(new Map());
//   const [desiredDeviceName, setDesiredDeviceName] = useState('Takion-BT04-01');
//   const [peripheralId, setPeripheralId] = useState(null);
//   const [dataReceived, setDataReceived] = useState([]);
//   const [characteristicUUID, setCharacteristicUUID] = useState('');
//   const [serviceUUID, setServiceUUID] = useState('');
//   const [modalVisible, setModalVisible] = useState(false);
//   const [isBleReady, setIsBleReady] = useState(false);

//   const reconnectAttempts = useRef(0);

//   const SECONDS_TO_SCAN_FOR = 5;
//   const SERVICE_UUIDS = [];
//   const ALLOW_DUPLICATES = false;
//   const MAX_RECONNECT_ATTEMPTS = 5;

//   // Função para verificar e ativar o Bluetooth
//   const enableBluetooth = async () => {
//     try {
//       const state = await BleManager.checkState();
//       if (state === 'off' || state === 'poweredOff') {
//         Alert.alert('Bluetooth Desligado', 'Por favor, ligue o Bluetooth para continuar.');
//         await BleManager.enableBluetooth();
//       }
//       setBluetoothOn(true);
//     } catch (error) {
//       console.error('Erro ao verificar/ativar o Bluetooth:', error);
//     }
//   };

//   // Função para iniciar a varredura Bluetooth
//   const startScan = async () => {
//     // if (isScanning || !bluetoothOn) {

//     //   console.log('Varredura não iniciada: já está escaneando ou Bluetooth está desligado.');

//     //   return;
//     // }

//     setPeripherals(new Map());
//     setIsScanning(true);
//     // console.debug('[startScan] Iniciando varredura...');

//     try {
//       await BleManager.scan(SERVICE_UUIDS, SECONDS_TO_SCAN_FOR, ALLOW_DUPLICATES, {
//         matchMode: BleScanMatchMode.Sticky,
//         scanMode: BleScanMode.LowLatency,
//         callbackType: BleScanCallbackType.AllMatches,
//       });
//       console.debug('[startScan] Varredura iniciada com sucesso.');
//     } catch (err) {
//       console.error('[startScan] Erro na varredura:', err);
//     }
//   };

//   // Função chamada ao encontrar um periférico
//   const handleDiscoverPeripheral = (peripheral) => {
//     if (!peripheral.name) return;

//     // console.log(`[handleDiscoverPeripheral] Dispositivo encontrado: ${peripheral.name}`);

//     // Adiciona periférico ao estado
//     setPeripherals((map) => new Map(map.set(peripheral.id, peripheral)));

//     if (peripheral.name === desiredDeviceName) {
//       setIsScanning(false); // Parar varredura
//       connectPeripheral(peripheral);
//     }
//   };

//   // Função para conectar ao periférico Bluetooth
//   const connectPeripheral = async (device) => {
//     try {
//       await BleManager.connect(device.id);
//       // console.log(`[connectPeripheral] Conectado ao dispositivo ${device.name}`);

//       setPeripherals((map) => {
//         const p = map.get(device.id);
//         if (p) {
//           p.connected = true;
//           return new Map(map.set(p.id, p));
//         }
//         return map;
//       });

//       await BleManager.retrieveServices(device.id)
//         .then((peripheralData) => {
//           const characteristics = peripheralData.characteristics;
//           if (characteristics.length > 0) {
//             const lastCharacteristic = characteristics[characteristics.length - 1];
//             setCharacteristicUUID(lastCharacteristic.characteristic);
//             setServiceUUID(lastCharacteristic.service);
//           }
//         });

//       setPeripheralId(device.id);
//       reconnectAttempts.current = 0; // Reiniciar as tentativas de reconexão após sucesso
//     } catch (error) {
//       console.error(`[connectPeripheral] Erro ao conectar com ${device.name}:`, error);
//     }
//   };

//   // Função para tentar reconectar se a conexão for perdida
//   const handleDisconnectedPeripheral = async (event) => {
//     const { peripheral } = event;
//     if (peripheral === peripheralId) {
//       console.log(`Conexão perdida com ${peripheral}. Tentando reconectar...`);
//       setModalVisible(true);

//       if (reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS) {
//         reconnectAttempts.current += 1;
//         try {
//           await BleManager.connect(peripheralId);
//           console.log(`Reconectado ao ${desiredDeviceName} na tentativa ${reconnectAttempts.current}`);
//           setModalVisible(false);
//           reconnectAttempts.current = 0; // Resetar tentativas após sucesso
//         } catch (error) {
//           console.error(`Erro ao tentar reconectar ao ${desiredDeviceName}:`, error);
//           setTimeout(() => handleDisconnectedPeripheral(event), 5000); // Tentar novamente após 5 segundos
//         }
//       } else {
//         console.error(`Falha ao reconectar ao ${desiredDeviceName} após ${MAX_RECONNECT_ATTEMPTS} tentativas.`);
//         setModalVisible(false);
//         reconnectAttempts.current = 0; // Resetar tentativas após falha
//       }
//     }
//   };

//   // Função para decodificar valores recebidos do dispositivo
//   const handleUpdateValueForCharacteristic = async ({ value }) => {
//     try {
//       const decodedValue = Buffer.from(value, 'base64').toString('utf-8');
//       setDataReceived((prevData) => [
//         ...prevData,
//         { id: prevData.length + 1, title: decodedValue }
//       ]);
//     } catch (error) {
//       console.error('Erro ao decodificar valor:', error);
//     }
//   };

//   // useEffect para inicializar BleManager e configurar ouvintes
//   useEffect(() => {
//     const initializeBleManager = async () => {
//       try {
//         await enableBluetooth(); // Ativa o Bluetooth

//         await BleManager.start({ showAlert: false });

//         setIsBleReady(true); // Define que o BLE está pronto

//         await startScan(); // Iniciar a varredura após a inicialização

//       } catch (error) {
//         console.error('Erro ao inicializar o BleManager:', error);
//       }
//     };

//     initializeBleManager();

//     const listeners = [
//       bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral),
//       bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', handleUpdateValueForCharacteristic),
//       bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', handleDisconnectedPeripheral),
//     ];

//     return () => {
//       listeners.forEach(listener => listener.remove());
//     };
//   }, []);

//   // Condicional para aguardar a inicialização completa do BLE
//   if (!isBleReady) {
//     return null; // Impede a renderização dos filhos até que o BLE esteja pronto
//   }

//   const contextValue = {
//     isScanning,
//     peripherals,
//     desiredDeviceName,
//     permission,
//     bluetoothOn,
//     peripheralId,
//     dataReceived,
//     characteristicUUID,
//     serviceUUID,
//     startScan,
//     isBleReady,
//   };

//   return (
//     <BleContext.Provider value={contextValue}>
//       {children}
//       <Modal visible={modalVisible} transparent={true} animationType="fade">
//         <View style={styles.centeredView}>
//           <View style={styles.modalView}>
//             <Text style={styles.modalText}>Reconectando...</Text>
//           </View>
//         </View>
//       </Modal>
//     </BleContext.Provider>
//   );
// };



// // Configuração do módulo BleManager
// const BleManagerModule = NativeModules.BleManager;
// const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);
// const BleContext = createContext();

// // Constantes de configuração
// const SECONDS_TO_SCAN_FOR = 5; // Aumentado para garantir a descoberta do dispositivo
// const SERVICE_UUIDS = [];
// const ALLOW_DUPLICATES = false;
// const MAX_RECONNECT_ATTEMPTS = 5;

// export const BleProvider = ({ children }) => {
//   const [permission, setPermission] = useState(false);
//   const [bluetoothOn, setBluetoothOn] = useState(false);
//   const [isScanning, setIsScanning] = useState(false);
//   const [peripherals, setPeripherals] = useState(new Map());
//   const [desiredDeviceName, setDesiredDeviceName] = useState('Takion-BT04-01');
//   const [peripheralId, setPeripheralId] = useState(null);
//   const [dataReceived, setDataReceived] = useState([]);
//   const [characteristicUUID, setCharacteristicUUID] = useState('');
//   const [serviceUUID, setServiceUUID] = useState('');
//   const [modalVisible, setModalVisible] = useState(false);
//   const [isBleReady, setIsBleReady] = useState(false);

//   const reconnectAttempts = useRef(0);
//   // Função para verificar e ativar o Bluetooth
//   const enableBluetooth = async () => {
//     try {
//       const state = await BleManager.checkState();
//       if (state === 'off' || state === 'poweredOff') {
//         Alert.alert('Bluetooth Desligado', 'Por favor, ligue o Bluetooth para continuar.');
//         await BleManager.enableBluetooth();
//       }
//       setBluetoothOn(true);
//     } catch (error) {
//       console.error('Erro ao verificar/ativar o Bluetooth:', error);
//     }
//   };

//   // Função para iniciar a varredura Bluetooth
//   const startScan = () => {
//     if (isScanning || !bluetoothOn) return;

//     setPeripherals(new Map());
//     setIsScanning(true);
//     console.debug('[startScan] Iniciando varredura...');


//     BleManager.scan(SERVICE_UUIDS, SECONDS_TO_SCAN_FOR, ALLOW_DUPLICATES, {
//       matchMode: BleScanMatchMode.Sticky,
//       scanMode: BleScanMode.LowLatency,
//       callbackType: BleScanCallbackType.AllMatches,
//     })
//       .catch((err) => console.error('[startScan] Erro na varredura:', err));
//   };

//   // Função chamada ao encontrar um periférico
//   const handleDiscoverPeripheral = (peripheral) => {
//     if (!peripheral.name) return;

//     if (peripheral.name === desiredDeviceName) {
//       setIsScanning(false); // Parar varredura
//       connectPeripheral(peripheral);
//     }
//   };

//   // Função para conectar ao periférico Bluetooth
//   const connectPeripheral = async (device) => {
//     try {
//       await BleManager.connect(device.id);
//       console.log(`[connectPeripheral] Conectado ao dispositivo ${device.name}`);

//       setPeripherals((map) => {
//         const p = map.get(device.id);
//         if (p) {
//           p.connected = true;
//           return new Map(map.set(p.id, p));
//         }
//         return map;
//       });

//       await BleManager.retrieveServices(device.id)
//         .then((peripheralData) => {
//           const characteristics = peripheralData.characteristics;
//           if (characteristics.length > 0) {
//             const lastCharacteristic = characteristics[characteristics.length - 1];
//             setCharacteristicUUID(lastCharacteristic.characteristic);
//             setServiceUUID(lastCharacteristic.service);
//           }
//         });

//       setPeripheralId(device.id);
//       reconnectAttempts.current = 0; // Reiniciar as tentativas de reconexão após sucesso
//     } catch (error) {
//       console.error(`[connectPeripheral] Erro ao conectar com ${device.name}:`, error);
//     }
//   };

//   // Função para tentar reconectar se a conexão for perdida
//   const handleDisconnectedPeripheral = async (event) => {
//     const { peripheral } = event;
//     if (peripheral === peripheralId) {
//       console.log(`Conexão perdida com ${peripheral}. Tentando reconectar...`);
//       setModalVisible(true);

//       if (reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS) {
//         reconnectAttempts.current += 1;
//         try {
//           await BleManager.connect(peripheralId);
//           console.log(`Reconectado ao ${desiredDeviceName} na tentativa ${reconnectAttempts.current}`);
//           setModalVisible(false);
//           reconnectAttempts.current = 0; // Resetar tentativas após sucesso
//         } catch (error) {
//           console.error(`Erro ao tentar reconectar ao ${desiredDeviceName}:`, error);
//           setTimeout(() => handleDisconnectedPeripheral(event), 5000); // Tentar novamente após 5 segundos
//         }
//       } else {
//         console.error(`Falha ao reconectar ao ${desiredDeviceName} após ${MAX_RECONNECT_ATTEMPTS} tentativas.`);
//         setModalVisible(false);
//         reconnectAttempts.current = 0; // Resetar tentativas após falha
//       }
//     }
//   };

//   // Função para decodificar valores recebidos do dispositivo
//   const handleUpdateValueForCharacteristic = async ({ value }) => {
//     try {
//       const decodedValue = Buffer.from(value, 'base64').toString('utf-8');
//       setDataReceived((prevData) => [
//         ...prevData,
//         { id: prevData.length + 1, title: decodedValue }
//       ]);
//     } catch (error) {
//       console.error('Erro ao decodificar valor:', error);
//     }
//   };

//   // useEffect para inicializar BleManager e configurar ouvintes
//   useEffect(() => {
//     enableBluetooth();
//     const initializeBleManager = async () => {
//       try {
//         await enableBluetooth(); // Ativa o Bluetooth

//         await BleManager.start({ showAlert: false });
//         console.debug('BleManager iniciado');

//         setIsBleReady(true); // Define que o BLE está pronto

//         startScan(); // Iniciar a varredura após a inicialização

//       } catch (error) {
//         console.error('Erro ao inicializar o BleManager:', error);
//       }
//     };

//     initializeBleManager();

//     const listeners = [
//       bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral),
//       bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', handleUpdateValueForCharacteristic),
//       bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', handleDisconnectedPeripheral),
//     ];

//     return () => {
//       listeners.forEach(listener => listener.remove());
//     };
//   }, []);

//   // Condicional para aguardar a inicialização completa do BLE
//   if (!isBleReady) {
//     return null; // Impede a renderização dos filhos até que o BLE esteja pronto
//   }

//   const contextValue = {
//     isScanning,
//     peripherals,
//     desiredDeviceName,
//     permission,
//     bluetoothOn,
//     peripheralId,
//     dataReceived,
//     characteristicUUID,
//     serviceUUID,
//     startScan,
//   };

//   return (
//     <BleContext.Provider value={contextValue}>
//       {children}
//       <Modal visible={modalVisible} transparent={true} animationType="fade">
//         <View style={styles.centeredView}>
//           <View style={styles.modalView}>
//             <Text style={styles.modalText}>Reconectando...</Text>
//           </View>
//         </View>
//       </Modal>
//     </BleContext.Provider>
//   );
// };

// export const useBleContext = () => {
//   const context = useContext(BleContext);
//   if (!context) {
//     throw new Error('useBleContext deve ser usado dentro de um BleProvider');
//   }
//   return context;
// };

// const styles = StyleSheet.create({
//   centeredView: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "rgba(0, 0, 0, 0.6)"
//   },
//   modalView: {
//     margin: 20,
//     backgroundColor: "white",
//     borderRadius: 20,
//     padding: 35,
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 2
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5
//   },
//   modalText: {
//     marginBottom: 15,
//     textAlign: "center"
//   }
// });