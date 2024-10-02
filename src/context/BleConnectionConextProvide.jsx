import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Modal, Alert, Text, View } from 'react-native';
import { NativeModules, NativeEventEmitter, StyleSheet } from "react-native";
import BleManager, { BleScanCallbackType, BleScanMatchMode, BleScanMode } from 'react-native-ble-manager';

export const BleContext = createContext();

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

export const BleProvider = ({ children }) => {

  const [permission, setPermission] = useState(false);
  const [bluetoothOn, setBluetoothOn] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [peripherals, setPeripherals] = useState(new Map());
  const [desiredDeviceName, setDesiredDeviceName] = useState('Takion-BT04-01');
  const [peripheralId, setPeripheralId] = useState(null);
  const [dataReceived, setDataReceived] = useState([]);
  const [characteristicUUID, setCharacteristicUUID] = useState('');
  const [serviceUUID, setServiceUUID] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [isBleReady, setIsBleReady] = useState(false);
  // Estado para controlar se a notificação está em andamento
  const [isNotificationInProgress, setIsNotificationInProgress] = useState(false);
  // Estado para controlar se a notificação está em processo de parada
  const [isStoppingNotification, setIsStoppingNotification] = useState(false);

  const reconnectAttempts = useRef(0);

  const SECONDS_TO_SCAN_FOR = 5;
  const SERVICE_UUIDS = [];
  const ALLOW_DUPLICATES = false;
  const MAX_RECONNECT_DELAY = 30000; // 30 segundos

  let reconnectTimeout; // Variável para armazenar o timeout

  // Função para verificar e ativar o Bluetooth
  const enableBluetooth = async () => {
    try {
      const state = await BleManager.checkState();
      if (state !== 'on' && state !== 'poweredOn') {
        Alert.alert('Bluetooth Desligado', 'Por favor, ligue o Bluetooth para continuar.');
        await BleManager.enableBluetooth();
      }
      setBluetoothOn(true);
    } catch (error) {
      console.error('Erro ao verificar/ativar o Bluetooth:', error);
    }
  };

  /**
   * Inicia a varredura de dispositivos Bluetooth, se o Bluetooth estiver ativado.
   * Limpa a lista de periféricos e atualiza o estado de varredura.
   * Garante que a varredura é interrompida corretamente em todos os casos.
   * 
   * @returns {Promise<void>} - Uma promessa que representa a conclusão da varredura.
   */
  const startScan = async () => {
    // Verifica se o Bluetooth está ativado antes de iniciar a varredura
    if (!bluetoothOn) {
      await enableBluetooth(); // Chama a função para ativar o Bluetooth
      console.warn('Bluetooth não está ativado. Tentando ativar o Bluetooth...');
      return; // Após tentar ativar, sai da função
    }

    setPeripherals(new Map());
    setIsScanning(true);
    console.log("Iniciando a varredura...");

    try {
      await BleManager.scan(SERVICE_UUIDS, SECONDS_TO_SCAN_FOR, ALLOW_DUPLICATES, {
        matchMode: BleScanMatchMode.Sticky,
        scanMode: BleScanMode.LowLatency,
        callbackType: BleScanCallbackType.AllMatches,
      });
      console.debug('[startScan] Varredura iniciada com sucesso.');

      // Espera pela duração da varredura
      setTimeout(async () => {
        await BleManager.stopScan();
        console.debug('[startScan] Varredura parada após o tempo limite.');
        setIsScanning(false);
      }, SECONDS_TO_SCAN_FOR * 1000);

    } catch (err) {
      console.error('[startScan] Erro na varredura:', err);
    }
  };


  /**
   * Manipula a descoberta de periféricos Bluetooth.
   * Atualiza a lista de periféricos conhecidos e tenta conectar-se ao periférico desejado.
   * 
   * @param {Object} peripheral - O objeto do periférico descoberto.
   * @param {string} peripheral.id - O ID do periférico.
   * @param {string} peripheral.name - O nome do periférico.
   */
  const handleDiscoverPeripheral = (peripheral) => {
    // console.log("handleDiscoverPeripheral", peripheral);

    // Adiciona log de debug se o periférico não tiver nome
    if (!peripheral.name) {
      // console.debug('Peripheral descoberto sem nome:', peripheral);
      return; // Sai da função se não houver nome
    }

    setPeripherals((map) => new Map(map.set(peripheral.id, peripheral)));

    if (peripheral.name === desiredDeviceName) {
      setIsScanning(false); // Parar varredura
      connectPeripheral(peripheral);
    }
  };

  /**
   * Conecta ao periférico Bluetooth e configura as características e serviços.
   * 
   * @param {Object} device - O dispositivo Bluetooth a ser conectado.
   * @param {string} device.id - O ID do dispositivo.
   */
  const connectPeripheral = async (device) => {
    try {
      await BleManager.connect(device.id);

      setPeripherals((map) => {
        const p = map.get(device.id);
        if (p) {
          p.connected = true;
          return new Map(map.set(p.id, p));
        }
        return map;
      });

      await configurePeripheralServices(device.id);
      setPeripheralId(device.id);
      reconnectAttempts.current = 0; // Reiniciar as tentativas de reconexão após sucesso
    } catch (error) {
      console.error(`[connectPeripheral] Erro ao conectar com ${device.name}:`, error);
    }
  };

  /**
   * Recupera os serviços e características de um periférico Bluetooth e atualiza os estados.
   * 
   * @param {string} deviceId - O ID do dispositivo para o qual os serviços serão recuperados.
   */
  const configurePeripheralServices = async (deviceId) => {
    try {
      const peripheralData = await BleManager.retrieveServices(deviceId);
      const characteristics = peripheralData.characteristics;

      if (characteristics.length > 0) {
        const lastCharacteristic = characteristics[characteristics.length - 1];
        setCharacteristicUUID(lastCharacteristic.characteristic);
        setServiceUUID(lastCharacteristic.service);
      } else {
        console.warn(`[configurePeripheralServices] Nenhuma característica encontrada para o dispositivo ${deviceId}.`);
      }
    } catch (error) {
      console.error(`[configurePeripheralServices] Erro ao recuperar serviços para ${deviceId}:`, error);
    }
  };

  /**
   * Inicia as notificações para o periférico Bluetooth se não estiver em andamento.
   * 
   * Esta função verifica se o peripheralId, serviceUUID e characteristicUUID estão definidos,
   * e inicia a notificação se não houver outra instância em andamento.
   */
  const startNotification = async () => {
    if (!peripheralId || !serviceUUID || !characteristicUUID) {
      console.warn("startNotification: Peripheral ID, Service UUID, or Characteristic UUID is missing.");
      return;
    }

    // Verifica se a notificação já está em andamento
    if (isNotificationInProgress) {
      console.log("Notificação já está em andamento.");
      return;
    }

    setIsNotificationInProgress(true); // Atualiza o estado para indicar que a notificação está em andamento

    try {
      await BleManager.startNotification(peripheralId, serviceUUID, characteristicUUID);
      console.log("Notificação iniciada para:", peripheralId);
    } catch (error) {
      console.error(`[startNotification] Erro ao iniciar notificação:`, error);
    } finally {
      setIsNotificationInProgress(false); // Restaura o estado após a tentativa de iniciar a notificação
    }
  };

  /**
   * Para as notificações para o periférico Bluetooth se não estiver em processo de parada.
   * 
   * Esta função verifica se o peripheralId, serviceUUID e characteristicUUID estão definidos,
   * e interrompe a notificação se não houver outra instância de parada em andamento.
   */
  const stopNotification = async () => {
    if (!peripheralId || !serviceUUID || !characteristicUUID) {
      console.warn("stopNotification: Peripheral ID, Service UUID, or Characteristic UUID is missing.");
      return;
    }

    // Verifica se já está em processo de parada
    if (isStoppingNotification) {
      console.log("Já está em processo de parada da notificação.");
      return;
    }

    setIsStoppingNotification(true); // Atualiza o estado para indicar que a parada está em andamento

    try {
      await BleManager.stopNotification(peripheralId, serviceUUID, characteristicUUID);
      console.log("Notificação parada para:", peripheralId);
    } catch (error) {
      console.error(`[stopNotification] Erro ao parar notificação:`, error);
    } finally {
      setIsStoppingNotification(false); // Restaura o estado após a tentativa de parar a notificação
    }
  };

  /**
   * Envia um comando para o periférico Bluetooth após verificar se as condições necessárias estão atendidas.
   * 
   * A função garante que o peripheralId, serviceUUID e characteristicUUID estão prontos antes de tentar 
   * iniciar a notificação e enviar o comando. Se algum parâmetro estiver ausente, a função 
   * configurePeripheralServices é chamada para tentar configurá-los. Em caso de erro, os estados do dispositivo 
   * são registrados para facilitar a depuração.
   * 
   * @param {Array} command - O comando a ser enviado para o periférico.
   */
  const sendCommand = async (command) => {
    // Verifica se os parâmetros necessários estão definidos
    if (!peripheralId || !serviceUUID || !characteristicUUID) {
      console.warn("sendCommand: Peripheral ID, Service UUID, or Characteristic UUID is missing. Configurando serviços do periférico.");
      await configurePeripheralServices(); // Chama a função para configurar serviços e características
      return; // Retorna após tentar configurar
    }

    try {
      // Inicia a notificação
      await BleManager.startNotification(peripheralId, serviceUUID, characteristicUUID);
      // console.log("Notificação iniciada para:", peripheralId);

      // Escreve o comando
      await BleManager.write(peripheralId, serviceUUID, characteristicUUID, command);
      // console.log("Comando enviado:", command);
    } catch (error) {
      console.error(`[sendCommand] Erro ao enviar comando:`, error);
      // Loga o estado do dispositivo para depuração
      console.log(`Estado do dispositivo: peripheralId=${peripheralId}, serviceUUID=${serviceUUID}, characteristicUUID=${characteristicUUID}`);
    }
  };

  /**
   * handleDisconnectedPeripheral
   * 
   * Descrição:
   *  Função que lida com a desconexão de um periférico Bluetooth e implementa um mecanismo de reconexão automática. 
   *  Quando o periférico se desconecta, o modal é exibido para informar ao usuário sobre a tentativa de reconexão. 
   *  A função tenta reconectar ao periférico a cada 30 segundos, de maneira contínua, até que a conexão seja restaurada.
   *  O modal é fechado assim que a reconexão for bem-sucedida.
   * 
   * Parâmetros:
   *  @param {Object} event - Objeto de evento contendo informações sobre o periférico desconectado.
   *    event.peripheral {string} - O ID do periférico desconectado.
   * 
   * Estado Utilizado:
   *  - modalVisible {boolean}: Controla a visibilidade do modal de reconexão.
   *  - reconnectAttempts.current {number}: Número de tentativas de reconexão realizadas.
   * 
   * Constantes:
   *  - MAX_RECONNECT_DELAY {number}: Intervalo de tempo (em milissegundos) entre as tentativas de reconexão. Definido como 30 segundos.
   * 
   * Fluxo:
   *  1. Verifica se o periférico desconectado é o periférico atual conectado (peripheralId).
   *  2. Exibe o modal de reconexão e tenta reconectar.
   *  3. Caso falhe, tenta novamente a cada 30 segundos até o periférico ser reconectado.
   *  4. Se a reconexão for bem-sucedida, o modal é fechado e o contador de tentativas é resetado.
   * 
   * Possíveis Melhorias:
   *  - Adicionar um feedback mais detalhado ao usuário durante as tentativas de reconexão.
   *  - Implementar uma notificação após um número excessivo de tentativas falhadas.
   */
  const handleDisconnectedPeripheral = async (event) => {
    const { peripheral } = event;

    // Verifica se o periférico desconectado é o periférico monitorado
    if (peripheral === peripheralId) {
      console.log(`Conexão perdida com ${peripheral}. Tentando reconectar...`);
      setModalVisible(true); // Exibe o modal durante a reconexão

      /**
       * Função interna para tentar a reconexão com o periférico
       */
      const attemptReconnect = async () => {
        try {
          // Tenta reconectar ao periférico
          await BleManager.connect(peripheralId);
          console.log(`Reconectado ao ${desiredDeviceName}`);

          // Fecha o modal e reseta o número de tentativas
          setModalVisible(false);
          reconnectAttempts.current = 0;
          clearTimeout(reconnectTimeout); // Limpa o timeout para evitar múltiplas execuções
        } catch (error) {
          // Loga o erro e agenda nova tentativa após 30 segundos
          console.error(`Erro ao tentar reconectar ao ${desiredDeviceName}:`, error);
          reconnectTimeout = setTimeout(attemptReconnect, MAX_RECONNECT_DELAY); // Tenta reconectar após 30 segundos
        }
      };

      // Inicia a primeira tentativa de reconexão
      attemptReconnect();
    }
  };


  /**
  * handleUpdateValueForCharacteristic
  * 
  * Descrição:
  *  Função responsável por lidar com a atualização de valor para uma característica de um periférico Bluetooth.
  *  Ela é chamada sempre que o periférico envia uma notificação com novos dados. A função decodifica o valor recebido
  *  e executa as ações necessárias com base nos dados obtidos.
  * 
  * Parâmetros:
  *  @param {string} peripheralId - O ID do periférico do qual a notificação foi recebida.
  *  @param {string} characteristic - O UUID da característica que está sendo atualizada.
  *  @param {ArrayBuffer} value - O valor atualizado da característica, representado como um ArrayBuffer.
  * 
  * Função:
  *  - Verifica se o valor recebido é válido e pode ser decodificado.
  *  - Converte o valor de ArrayBuffer para string utilizando TextDecoder, caso seja válido.
  *  - Executa as ações necessárias com base nos dados recebidos.
  * 
  * Melhorias:
  *  - Adicionada validação do valor recebido para evitar erros ao tentar decodificar valores inválidos.
  *  - O código agora inclui logs de erro e sucesso para facilitar o debug.
  */

  const handleUpdateValueForCharacteristic = (peripheralId, characteristic, value) => {
    try {
      // Verifica se o valor recebido não está vazio e é um ArrayBuffer válido
      if (value && value.byteLength > 0) {
        // Converte o ArrayBuffer para string
        const decodedValue = new TextDecoder().decode(value);
        console.log(`Valor recebido do periférico ${peripheralId}, característica ${characteristic}: ${decodedValue}`);

        // Aqui você pode adicionar lógica para tratar os dados decodificados
        // Exemplo: atualizar um estado ou processar os dados
      } else {
        // Loga caso o valor não seja decodificável
        console.warn(`Valor recebido para a característica ${characteristic} está vazio ou inválido.`);
      }
    } catch (error) {
      // Loga o erro em caso de falha na decodificação
      console.error(`Erro ao decodificar valor da característica ${characteristic} no periférico ${peripheralId}:`, error);
    }
  };

  const initializeBleManager = async () => {
    try {
      await enableBluetooth();
      await BleManager.start({ showAlert: false });
      setIsBleReady(true);
      await startScan();
    } catch (error) {
      console.error('Erro ao inicializar o BleManager:', error);
    }
  };

  // useEffect para inicializar BleManager e configurar ouvintes
  useEffect(() => {
    initializeBleManager();

    const listeners = [
      bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', handleDiscoverPeripheral),
      bleManagerEmitter.addListener('BleManagerDidUpdateValueForCharacteristic', handleUpdateValueForCharacteristic),
      bleManagerEmitter.addListener('BleManagerDisconnectPeripheral', handleDisconnectedPeripheral),
    ];

    return () => {
      listeners.forEach(listener => {
        listener.remove();
        console.log('Listener removido:', listener.eventType);
      });
    };
  }, []);

  // Condicional para aguardar a inicialização completa do BLE
  if (!isBleReady) {
    return null;
  }

  const contextValue = {
    isScanning,
    peripherals,
    desiredDeviceName,
    permission,
    bluetoothOn,
    peripheralId,
    dataReceived,
    characteristicUUID,
    serviceUUID,
    startScan,
    startNotification,
    stopNotification,
    sendCommand,
    setDesiredDeviceName,
  };

  return (
    <BleContext.Provider value={contextValue}>
      {children}
      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Reconectando...</Text>
          </View>
        </View>
      </Modal>
    </BleContext.Provider>
  );
};


export const useBleContext = () => {
  const context = useContext(BleContext);
  if (!context) {
    throw new Error('useBleContext deve ser usado dentro de um BleProvider');
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