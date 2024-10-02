import BleManager from 'react-native-ble-manager';
import { Buffer } from 'buffer';
import { useBleContext } from '../context/BleConnectionConextProvide';


// Função para enviar comandos
export const useSendCommand = () => {
  const { peripheralId, serviceUUID, characteristicUUID } = useBleContext();

  const sendCommand = async (command) => {
    try {
      const buffer = Buffer.from(command);

      await BleManager.write(
        peripheralId,
        serviceUUID,
        characteristicUUID,
        buffer.toJSON().data
      );

      console.debug('Comando enviado com sucesso:', command);
    } catch (error) {
      console.error('Erro ao enviar comando:', error);
    }
  };

  return sendCommand;
};

// Função para iniciar a assinatura de uma característica
export const useStartNotification = () => {
  const { peripheralId, serviceUUID, characteristicUUID } = useBleContext();
  const sendCommand = useSendCommand(); // Utilize a função de enviar comando

  const startNotification = async (command) => {
    try {
      await BleManager.startNotification(peripheralId, serviceUUID, characteristicUUID);
      if (command) {
        await sendCommand(command); // Envia o comando passado por parâmetro
      }
      console.debug(`Assinatura iniciada para a característica ${characteristicUUID}`);
    } catch (error) {
      console.error(`Falha ao iniciar a assinatura para a característica ${characteristicUUID}:`, error);
    }
  };

  return startNotification;
};

// Função para interromper notificações
export const useStopNotifications = () => {
  const { peripheralId, serviceUUID, characteristicUUID } = useBleContext();

  const stopNotifications = async () => {
    try {
      await BleManager.stopNotification(peripheralId, serviceUUID, characteristicUUID);
      console.debug(`Notificações interrompidas para a característica ${characteristicUUID}`);
    } catch (error) {
      console.error('Falha ao interromper notificações:', error);
    }
  };

  return stopNotifications;
};


// import { BleManager } from 'react-native-ble-plx';
// import { Buffer } from 'buffer';
// import { deviceName, serviceUUID, characteristicUUID } from '../config';

// const manager = new BleManager();

// const calculateChecksum = (tec) => {
//   let sum = tec.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
//   return (sum % 256).toString().padStart(3, '0');
// };

// const concatenateString = (baseString, tec) => {
//   const cks = calculateChecksum(tec);
//   return `${baseString} ${tec} ${cks}`;
// };

// const connectToDevice = async () => {
//   const devices = await manager.devices([]);
//   const esp32Device = devices.find((device) => device.name === deviceName);

//   if (!esp32Device) {
//     throw new Error(`Device ${deviceName} not found`);
//   }

//   await esp32Device.connect();
//   await esp32Device.discoverAllServicesAndCharacteristics();
//   return esp32Device;
// };

// const sendStringViaBluetooth = async (device, string) => {
//   const base64String = Buffer.from(string).toString('base64');
//   await device.writeCharacteristicWithResponseForService(
//     serviceUUID,
//     characteristicUUID,
//     base64String
//   );
// };

// const sendCommand = async (baseString, tec) => {
//   try {
//     // const device = await connectToDevice();
//     const stringToSend = concatenateString(baseString, tec);
//     // await sendStringViaBluetooth(device, stringToSend);
//     console.log('String enviada:', stringToSend);
//   } catch (error) {
//     console.error('Erro ao enviar string via Bluetooth:', error);
//   }
// };

// export { sendCommand };