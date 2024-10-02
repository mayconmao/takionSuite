import React, { useState } from 'react';
import { StyleSheet, View, Text, StatusBar, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/AntDesign';

import { useBleContext } from '../../context/BleConnectionConextProvide';
import { CustomTouchableOpacity } from '../../Components/CustomTouchableOpacity';
import { LayoutBase } from '../LayoutBase';
import THEME from '../../Theme';

export function ConnectionScreen() {
  const navigation = useNavigation();
  const { bluetoothOn, peripherals, startScan, desiredDeviceName, togglePeripheralConnection, enableBluetooth } = useBleContext();
  const [isScanning, setIsScanning] = useState(false);

  const handlerConnection = (item) => {
    // togglePeripheralConnection(item);
    navigation.navigate('Home');
  }

  const handlerStartScan = async () => {
    if (!bluetoothOn) {
      setIsScanning(true);
      await enableBluetooth();
    }
    startScan();
    setIsScanning(false);
  }

  // Encontra o dispositivo desejado na lista de periféricos
  const desiredPeripheral = Array.from(peripherals.values()).find(peripheral => peripheral.name === desiredDeviceName);

  return (
    <>
      <StatusBar />
      <View style={styles.body}>
        <LayoutBase
          customStyle={styles.imageBackground}
        >
          <View style={styles.container}>

            {desiredPeripheral ? (
              <>
                <View style={styles.textContainerGreen}>
                  <Text style={styles.permissionText}>Entre e desfrute da melhor experiência</Text>
                </View>

                <CustomTouchableOpacity
                  style={styles.scanButton}
                  onPress={() => handlerConnection(desiredPeripheral)}
                >
                  <Text style={styles.h2}>Entre</Text>
                  <Icon name="doubleright" size={30} color="#069400" />
                </CustomTouchableOpacity>
              </>
            ) : (
              <>
                <View style={styles.textContainer}>
                  <Text style={styles.stepText}>Próximo Passo</Text>
                  <Text style={styles.permissionText}>Vamos nos conectar para termos uma experiência fantástica</Text>
                </View>

                <CustomTouchableOpacity style={styles.scanButton} onPress={handlerStartScan}>
                  <Text style={styles.scanButtonText}>
                    {isScanning ? 'Conectando...' : 'Conectar'}
                  </Text>
                  <Icon name="doubleright" size={30} color="#f04a3a" />
                </CustomTouchableOpacity>
              </>
            )}
          </View>
        </LayoutBase>
      </View>
    </>
  );
};


const styles = StyleSheet.create({
  body: {
    flex: 1,
  },
  imageBackground: {
    flex: 1,
    justifyContent: "center",
  },
  container: {},
  textContainer: {
    alignItems: 'center',
    marginBottom: '25%',
    marginHorizontal: 10,
    borderRadius: 20,
    textAlign: 'center',
  },
  textContainerGreen: {
    alignItems: 'center',
    marginBottom: '25%',
    marginHorizontal: 10,
    borderRadius: 20,
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 36,
    marginBottom: 10,
    color: THEME.COLORS.TEXT
  },
  stepText: {
    fontSize: 36,
    marginBottom: 10,
    color: THEME.COLORS.TEXT
  },
  permissionText: {
    fontSize: 26,
    marginBottom: 10,
    color: THEME.COLORS.TEXT,
    textAlign: 'center'
  },
  logo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'tomato'
  },
  peripheralName: {
    fontSize: 16,
    textAlign: 'center',
    padding: 10,
  },
  rssi: {
    fontSize: 12,
    textAlign: 'center',
    padding: 2,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 16,
    borderWidth: 2,
    borderColor: THEME.COLORS.BORDERCOLORWHITE,
    backgroundColor: THEME.COLORS.BACKGROUNDWHITE,
    margin: 10,
    borderRadius: 25,
  },
  scanButtonText: {
    fontSize: 25,
    letterSpacing: 0.25,
    color: THEME.COLORS.TEXT,
  },
  row: {
    marginLeft: 10,
    marginRight: 10,
    borderRadius: 20,
    padding: 20
  },
  h2: {
    fontSize: 20,
    textAlign: 'center',
    color: THEME.COLORS.TEXT,
  },
});
