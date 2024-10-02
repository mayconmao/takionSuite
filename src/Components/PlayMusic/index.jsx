import React, { useState } from 'react';
import { View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

import { CustomTouchableOpacity } from '../CustomTouchableOpacity';
import { Header } from '../Header';
import Octicons from 'react-native-vector-icons/Octicons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import THEME from '../../Theme';

export const HeaderTop = ({ name }) => {
  const [powerControlIsOn, setPowerControlIsOn] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const PowerControl = () => {
    const handleToggle = () => {
      // const command = powerControlIsOn ? "SOMD" : "SOML";

      setPowerControlIsOn(!powerControlIsOn);
      // sendCommand(command)
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
          <Octicons name="unmute" size={40} color="white" />
        )}
      </CustomTouchableOpacity>
    );
  };

  return (
    <View style={styles.containerHeader}>
      <View>
        <Header name={name} toBack="Home" color={THEME.COLORS.TEXTHOME} />
      </View>
      <View style={styles.containerPower}>
        <PowerControl />
        <View style={styles.containerStreaming}>
          <MuteButton isMuted={isMuted} setActiveMuteButton={setIsMuted} />
        </View>
      </View>
    </View>
  );
};

const styles = EStyleSheet.create({
  containerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  containerPower: {
    flexDirection: 'row',
    padding: 10,
    borderRadius: 10,
    backgroundColor: THEME.COLORS.BACKGROUND,
    borderWidth: 2,
    borderColor: THEME.COLORS.BORDERCOLORADIO,
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
