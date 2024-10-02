import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSocketContext } from '../../context/SocketClient';
import { useDeviceName } from '../../context/DeviceNameContext';

import BleManager from 'react-native-ble-manager';
import { Buffer } from 'buffer';

export const Settings = () => {
  const navigation = useNavigation();
  const [deviceName, setDeviceName] = useState('');
  const { setDeviceNameAndConnect, status } = useSocketContext();
  // const { setDeviceNameAndSave } = useDeviceName();

  // const handleSave = async () => {
  //   if (deviceName.trim() === '') {
  //     Alert.alert('Erro', 'O nome do dispositivo não pode estar vazio.');
  //     return;
  //   }
  //   await setDeviceNameAndConnect(deviceName);
  //   await setDeviceNameAndSave(deviceName);
  //   await sendBluetoothData("Suite: 1016");
  //   navigation.navigate('Home');
  //   Alert.alert('Nome do Dispositivo', `O nome do dispositivo foi salvo como: ${deviceName}`);
  // };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configuração</Text>
      <Text style={styles.label}>Nome do Dispositivo</Text>
      <TextInput
        style={styles.input}
        placeholder="Insira o nome do dispositivo"
        value={deviceName.trim()}
        onChangeText={setDeviceName}
      />
      <Button title="Salvar" onPress={() => { }} />
    </View>
  );
};

const sendBluetoothData = async (name) => {
  const STX = 2;  // ASCII Start of Text (002)
  const ETX = 3;  // ASCII End of Text (003)
  const NULL_CHAR = 0;

  const packets = [];
  let packetIndex = 0;

  // Step 1: Create the first packet with STX and first 3 characters
  let firstPacketData = [STX, ...name.slice(0, 3)];
  packets.push(createPacket(firstPacketData));

  // Step 2: Create subsequent packets with the remaining characters
  for (let i = 3; i < name.length; i += 4) {
    packets.push(createPacket(name.slice(i, i + 4)));
  }

  // Step 3: Create the final packet with ETX
  const remainingChars = name.length % 4;
  if (remainingChars === 0) {
    packets.push(createPacket([ETX, NULL_CHAR, NULL_CHAR, NULL_CHAR]));
  } else {
    const finalData = [...name.slice(name.length - remainingChars), ETX, NULL_CHAR, NULL_CHAR].slice(0, 4);
    packets.push(createPacket(finalData));
  }

  // Step 4: Log each packet with a 100ms delay between them
  for (let packet of packets) {
    console.log(packet);
    await new Promise(resolve => setTimeout(resolve, 100));  // Simulate 100ms delay
  }
};

const createPacket = (data) => {
  const packet = ['01', '013'];  // Base fixa do pacote
  let checksum = 0;

  // Adicionar CH1-CH4 (data) ao pacote
  for (let i = 0; i < 4; i++) {
    let charCode;
    if (typeof data[i] === 'number') {
      charCode = data[i];  // Se já for um número, use diretamente
    } else if (typeof data[i] === 'string' && data[i].length > 0) {
      charCode = data[i].charCodeAt(0);  // Converte caractere para código ASCII
    } else {
      charCode = 0;  // Se for indefinido, usa 0 (NULL)
    }

    // Formatar charCode para ser sempre 3 algarismos
    const formattedCharCode = String(charCode).padStart(3, '0');
    packet.push(formattedCharCode);

    // Atualiza o checksum somando o valor atual
    checksum += charCode;
  }

  // Ajustar o checksum para que seja um valor entre 0 e 255
  while (checksum > 255) {
    checksum -= 256;
  }

  // Adicionar o checksum, também formatado com 3 algarismos
  packet.push(String(checksum).padStart(3, '0'));

  // Retornar o pacote como uma string com os valores separados por espaços
  return packet.join(' ');
};

// LOG  01 013 002 083 117 105 051
// LOG  01 013 116 101 058 032 051
// LOG  01 013 049 048 049 054 200
// LOG  01 013 048 049 054 003 154

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },
});
