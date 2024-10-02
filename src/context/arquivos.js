import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { PermissionsAndroid, Platform, Modal, Alert, Text, View } from 'react-native';
import { NativeModules, NativeEventEmitter, StyleSheet } from "react-native";
import BleManager, {
  BleDisconnectPeripheralEvent,
  BleManagerDidUpdateValueForCharacteristicEvent,
  BleScanCallbackType,
  BleScanMatchMode,
  BleScanMode,
  Peripheral,
} from 'react-native-ble-manager';
import { Buffer } from 'buffer';
import TrackPlayer from 'react-native-track-player';

// import { configureInterceptor, getTokens } from './AuthService';

// import {} from '../'

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

  const [select, setSelect] = useState(null);
  const [selectedControl, setSelectedControl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const [categories, setCategories] = useState(null);
  const [listCategories, setListCategories] = useState(null);
  const [selectedMusic, setSelectedMusic] = useState(null);

  //estados de reconexao
  const [attemptingReconnect, setAttemptingReconnect] = useState(false);
  // const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const reconnectAttempts = useRef(0);
  const peripheralIdReconect = useRef(null);
  // console.log("state", reconnectAttempts)

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

  // const handleAndroidPermissions = () => {
  //   if (Platform.OS === 'android' && Platform.Version >= 31) {
  //     PermissionsAndroid.requestMultiple([
  //       PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
  //       PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
  //     ]).then(result => {
  //       if (result) {
  //         setPermission(result)
  //         console.debug(
  //           '[handleAndroidPermissions] User accepts runtime permissions android 12+',
  //         );
  //       } else {
  //         console.error(
  //           '[handleAndroidPermissions] User refuses runtime permissions android 12+',
  //         );
  //       }
  //     });
  //   } else if (Platform.OS === 'android' && Platform.Version >= 23) {
  //     PermissionsAndroid.check(
  //       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  //     ).then(checkResult => {
  //       if (checkResult) {
  //         setPermission(checkResult)
  //         console.debug(
  //           '[handleAndroidPermissions] runtime permission Android <12 already OK',
  //         );
  //       } else {
  //         PermissionsAndroid.request(
  //           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  //         ).then(requestResult => {
  //           if (requestResult) {
  //             setPermission(requestResult)
  //             console.debug(
  //               '[handleAndroidPermissions] User accepts runtime permission android <12',
  //             );
  //           } else {
  //             console.error(
  //               '[handleAndroidPermissions] User refuses runtime permission android <12',
  //             );
  //           }
  //         });
  //       }
  //     });
  //   }
  // };


  const handleDisconnectedPeripheral = async (event) => {
    console.debug(
      `[handleDisconnectedPeripheral][${event.peripheral}] disconnected.`,
    );
    setIsConnecting(true); // Exibe o modal de "Conectando..."
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
    // //verifica a conexao
    if (!attemptingReconnect && reconnectAttempts.current < 3) { // Limita a 3 tentativas
      console.log("dentro do if", reconnectAttempts)
      setAttemptingReconnect(true);
      await reconnectPeripheral(event.peripheral);
      reconnectAttempts.current += 1; // Atualiza diretamente o valor de ref
      setAttemptingReconnect(false); // Reset após a tentativa
      if (reconnectAttempts.current >= 3) {
        showReconnectAlert(); // Mostra o alerta após 3 tentativas falhas
      }
    }

    showReconnectAlert();

    // setPeripherals(map => {
    //   let p = map.get(event.peripheral);
    //   if (p) {
    //     p.connected = false;
    //     setNoConnection(false)
    //     setStart(false)
    //     return new Map(map.set(event.peripheral, p));
    //   }
    //   return map;
    // });

  };

  //funcao de reconexao 
  const reconnectPeripheral = async (peripheralId) => {
    // console.log("test", reconnectAttempts)
    // if (reconnectAttempts >= 2) {
    //   console.log("dentro do if")
    //   setIsConnecting(false); // Exibe as opções de reconexão após 3 tentativas
    //   // Implemente a lógica para mostrar opções de reconexão aqui
    //   Alert.alert(
    //     "Falha na Reconexão",
    //     "Não foi possível reconectar após 3 tentativas. Deseja tentar novamente?",
    //     [
    //       {
    //         text: "Sim", onPress: () => {
    //           setIsConnecting(true); // Mostra o modal novamente
    //           setReconnectAttempts(0); // Reinicia as tentativas
    //           reconnectPeripheral(peripheralId);
    //         }
    //       },
    //       {
    //         text: "Não", onPress: () => {
    //           console.log("Usuário optou por não reconectar");
    //           setReconnectAttempts(0); // Reinicia as tentativas para futuras conexões
    //         }
    //       }
    //     ],
    //     { cancelable: false }
    //   );
    // } else {
    //   BleManager.connect(peripheralId)
    //     .then(() => {
    //       console.log("Reconexão bem-sucedida.");
    //       // Reinicia a contagem de tentativas e o estado de tentativa de reconexão
    //       setIsConnecting(false);
    //       setReconnectAttempts(0);
    //       setAttemptingReconnect(false);

    //       // Atualiza o estado de conexão do dispositivo
    //       setPeripherals((prevMap) => {
    //         const updatedMap = new Map(prevMap);
    //         const peripheral = updatedMap.get(peripheralId);
    //         if (peripheral) {
    //           peripheral.connected = true;
    //           updatedMap.set(peripheralId, peripheral);
    //         }
    //         return updatedMap;
    //       });
    //     })
    //     .catch((error) => {
    //       console.log("Erro na tentativa de reconexão", error);
    //       setReconnectAttempts((prevAttempts) => prevAttempts + 1);
    //       setAttemptingReconnect(false);


    //     });
    // }

    BleManager.connect(peripheralId)
      .then(() => {
        console.log("Reconexão bem-sucedida.");
        // Reinicia a contagem de tentativas e o estado de tentativa de reconexão
        setIsConnecting(false);
        // setReconnectAttempts(0);
        setAttemptingReconnect(false);

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
        console.log("Erro na tentativa de reconexão", error);
        // setReconnectAttempts((prevAttempts) => prevAttempts + 1);
        setAttemptingReconnect(false);
      });
  };

  const showReconnectAlert = () => {
    setIsConnecting(false);
    Alert.alert(
      "Falha na Reconexão",
      "Não foi possível reconectar após 3 tentativas. Deseja tentar novamente?",
      [
        {
          text: "Sim", onPress: () => {
            setIsConnecting(true); // Mostra o modal novamente
            // setReconnectAttempts(0); // Reinicia as tentativas
            setIsReconnecting(true); // Reinicia o processo de reconexão
            reconnectPeripheral(peripheralIdReconect.current);
          }
        },
        {
          text: "Não", onPress: () => {
            console.log("Usuário optou por não reconectar");
            // setReconnectAttempts(0); // Reinicia as tentativas para futuras conexões
            // setIsReconnecting(false); // Permite novas tentativas de reconexão
            setIsConnecting(true);
            // Aqui você pode adicionar lógica para navegar de volta à tela inicial ou outra ação
          }
        }
      ],
      { cancelable: false }
    );
  };

  const renderConnectingModal = () => (
    <Modal
      visible={isConnecting}
      transparent={true}
      animationType="fade"
      onRequestClose={() => setIsConnecting(false)}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Reconectando...</Text>
        </View>
      </View>
    </Modal>
  );


  const handleUpdateValueForCharacteristic = ({ value }) => {
    try {
      // Decodificar o valor de base64 para uma string UTF-8
      const decodedValue = Buffer.from(value, 'base64').toString('utf-8');

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

  const handleSelectedMusic = (musicId) => {
    setSelectedMusic(musicId);
    // Adicione aqui qualquer lógica adicional necessária
  };

  const togglePlayPause = async () => {
    // if (isPlaying) {
    //   await TrackPlayer.pause();
    //   setIsPlaying(false);
    //   setSelectedControl('pause'); // Atualize o estado de controle
    // } else {
    //   await TrackPlayer.play();
    //   setIsPlaying(true);
    //   setSelectedControl('play'); // Atualize o estado de controle
    // }
    setIsPlaying(!isPlaying);
    setSelectedControl(isPlaying ? 'pause' : 'play'); // Atualize isso conforme sua lógica
  };

  async function setup() {
    // await TrackPlayer.setupPlayer();
    console.log('TrackPlayer is set up');
    TrackPlayer.registerPlaybackService(() => require('../Screens/Radio/service'));
  }

  const handleCategories = (categoryId) => {
    setCategories(categoryId)
  };

  const handleListCategories = (categoryId) => {
    setListCategories(categoryId)
  };

  const handleFrequencySelect = (frequency) => {
    setSelect(frequency);
    // Adicione aqui qualquer lógica adicional necessária
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

    // setPermission(handleAndroidPermissions());
    handleAndroidPermissions();
    setup();
    // bootstrapAsync();
    return () => {
      console.debug('[app] main component unmounting. Removing listeners...');
      for (const listener of listeners) {
        listener.remove();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [desiredDeviceName]);

  // useEffect(() => {
  //   if (reconnectAttempts >= 3) {
  //     setIsConnecting(false); // Primeiro oculta o modal
  //     Alert.alert(
  //       "Falha na Reconexão",
  //       "Não foi possível reconectar após 3 tentativas. Deseja tentar novamente?",
  //       [
  //         {
  //           text: "Sim", onPress: () => {
  //             setIsConnecting(true); // Mostra o modal novamente
  //             setReconnectAttempts(0); // Reinicia as tentativas
  //             reconnectPeripheral(peripheralId);
  //           }
  //         },
  //         {
  //           text: "Não", onPress: () => {
  //             console.log("Usuário optou por não reconectar");
  //             setReconnectAttempts(0); // Reinicia as tentativas para futuras conexões
  //           }
  //         }
  //       ],
  //       { cancelable: false }
  //     );
  //   }
  // }, [reconnectAttempts, peripheralId]); // Observa mudanças no número de tentativas de reconexão

  // useEffect para observar mudanças no reconnectAttempts
  // useEffect(() => {
  //   if (reconnectAttempts < 3 && isReconnecting) {
  //     reconnectPeripheral(peripheralId);
  //   } else if (reconnectAttempts >= 3) {
  //     setIsConnecting(false); // Oculta o modal "Conectando..."
  //     setIsReconnecting(false); // Impede novas tentativas de reconexão
  //     showReconnectAlert(); // Exibe o alerta apenas uma vez após 3 tentativas
  //   }
  // }, [reconnectAttempts, isReconnecting, peripheralId]);


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
    categories,
    listCategories,
    selectedMusic,
    setSelect,
    setSelectedControl,
    handleFrequencySelect,
    togglePlayPause,
    setStart,
    startScan,
    togglePeripheralConnection,
    enableBluetooth,
    setPermission,
    handleConnectPeripheral,
    connectPeripheral,
    setPeripherals,
    setDesiredDeviceName,
    handleCategories,
    handleListCategories,
    handleSelectedMusic
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