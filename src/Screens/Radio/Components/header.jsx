import React, { useState } from 'react';
import { View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

import Octicons from 'react-native-vector-icons/Octicons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Fontisto from 'react-native-vector-icons/Fontisto';

import { Header } from '../../../Components/Header';
import { CustomTouchableOpacity } from '../../../Components/CustomTouchableOpacity';
import THEME from '../../../Theme';

export const HeaderTop = ({ sendCommand }) => {
  const [powerControlIsOn, setPowerControlIsOn] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const PowerControl = () => {
    const handleToggle = () => {
      const command = powerControlIsOn ? "SOMD" : "SOML";

      setPowerControlIsOn(!powerControlIsOn);
      // sendCommand(command)
    };

    return (
      <CustomTouchableOpacity onPress={handleToggle} style={styles.powerControl}>
        <Fontisto name='power' size={40} color={THEME.COLORS.WHITE} />
      </CustomTouchableOpacity>
    );
  };

  const MuteButton = ({ isMuted, setActiveMuteButton }) => {

    const handleToggle = () => {
      setActiveMuteButton((prev) => !prev);
      console.log("botao selecionado")
    };

    return (
      <CustomTouchableOpacity onPress={handleToggle} style={styles.powerControl}>
        {isMuted ? (
          <Octicons name="mute" size={40} color={THEME.COLORS.COMANDBUTTOFF} />
        ) : (
          <Octicons name="unmute" size={40} color="white" />
        )}
      </CustomTouchableOpacity>
    );
  };

  return (
    <View style={styles.containerHeader}>
      <View>
        <Header name="Rádio" toBack="Som" color={THEME.COLORS.TEXTHOME} />
      </View>
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
    backgroundColor: THEME.COLORS.BACKGROUNDWHITE
  },
});
