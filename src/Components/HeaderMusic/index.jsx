import React, { useState, useCallback, useEffect } from 'react';
import { View, FlatList, ImageBackground, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import EStyleSheet from 'react-native-extended-stylesheet';

import { Header } from '../../Components/Header';
import { CustomTouchableOpacity } from '../CustomTouchableOpacity';
import Octicons from 'react-native-vector-icons/Octicons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import THEME from '../../Theme';

export const HeaderTop = ({ name, screen }) => {
  const navigation = useNavigation();

  const [powerControlIsOn, setPowerControlIsOn] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  function handleGoBack() {
    navigation.navigate('Home');
  }

  const sendCommand = async (date) => {

    // try {
    //   const buffer = Buffer.from(date);
    //   // console.log("service", peripheralId, serviceUUID, characteristicUUID,)

    //   // await BleManager.getMaximumWriteValueLengthForWithoutResponse(peripheralId).then((maxValue) => {
    //   //   console.log("Maximum length for WriteWithResponse: " + maxValue);
    //   // });

    //   await BleManager.write(
    //     peripheralId,
    //     serviceUUID,
    //     characteristicUUID,
    //     buffer.toJSON().data,
    //   );

    //   // console.log('Comando enviado com sucesso:', date);
    // } catch (error) {
    //   console.error('Erro ao enviar comando:', error);
    // }
  };

  const handleFrequencySelect = (frequency) => {
    setSelectedFrequency(frequency);
    // Adicione aqui qualquer lógica adicional que você precisa realizar quando a frequência é selecionada
  };

  const PowerControl = () => {
    const handleToggle = () => {
      const command = powerControlIsOn ? "SOMD" : "SOML";

      setPowerControlIsOn(!powerControlIsOn);
      sendCommand(command)
    };

    const powerControlStyle = {
      ...styles.powerControl,
      ...(powerControlIsOn && { borderColor: THEME.COLORS.BORDERCOLORLIGHTING, borderWidth: 4 }),
    };

    return (
      <CustomTouchableOpacity onPress={handleToggle} style={styles.powerControl}>
        <Fontisto name='power' size={40} color={powerControlIsOn ? THEME.COLORS.COMANDBUTTON : "white"} />
      </CustomTouchableOpacity>
    );
  };

  const MuteButton = ({ isMuted, setActiveMuteButton }) => {

    const handleToggle = () => {
      setActiveMuteButton((prev) => !prev);
      console.log("botao selecionado")
    };

    const buttonStyle = {
      ...styles.powerControl,
      ...(isMuted && { borderColor: `${THEME.COLORS.BORDERSELECTED}`, borderWidth: 4 }),
    };

    return (
      <CustomTouchableOpacity onPress={handleToggle} style={styles.powerControl}>
        {isMuted ? (
          <Octicons name="mute" size={40} color={THEME.COLORS.COMANDBUTTOFF} />
        ) : (
          <Octicons name="unmute" size={40} color={THEME.COLORS.ICONCOLOR} />
        )}
      </CustomTouchableOpacity>
    );
  };

  return (
    <View style={styles.containerHeader}>
      <View>
        <Header name={name} toBack={screen} color={THEME.COLORS.TEXTHOME} />
      </View>
      {/* <View style={styles.containerPower}>
        <PowerControl />
        <View style={styles.containerStreaming}>
          <MuteButton isMuted={isMuted} setActiveMuteButton={setIsMuted} />
          <TouchableOpacity style={styles.powerControl} onPress={handleGoBack}>
            <Octicons name="home" size={40} color={THEME.COLORS.ICONCOLOR} />
          </TouchableOpacity>
        </View>
      </View> */}
    </View>
  );
};

const styles = EStyleSheet.create({
  containerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // backgroundColor: 'tomato'
  },
  containerPower: {
    flexDirection: 'row',
    padding: 10,
    borderRadius: 10,
    backgroundColor: THEME.COLORS.BACKGROUND,
    // borderWidth: 2,
    // borderColor: THEME.COLORS.BORDERCOLORADIO,
    gap: 30
  },
  containerStreaming: {
    flexDirection: 'row',
    gap: 6,
  },
  powerControl: {
    width: 90,
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    padding: 10,
    // borderWidth: 2,
    // borderColor: THEME.COLORS.BORDERCOLORADIO,
    backgroundColor: THEME.COLORS.BACKGROUNDWHITE
  },
});
