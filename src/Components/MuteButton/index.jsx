import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import TrackPlayer from 'react-native-track-player';

import Ionicons from 'react-native-vector-icons/Ionicons';
import { CustomTouchableOpacity } from '../CustomTouchableOpacity';
import THEME from '../../Theme';

export const MuteButton = () => {
  // Estado interno para gerenciar se o áudio está mutado
  const [isMuted, setIsMuted] = useState(false);

  const handleToggle = async () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState); // Alterna o estado de mutado

    // Ajusta o volume para 0 para mutar, ou para 1 para volume normal
    await TrackPlayer.setVolume(newMutedState ? 0 : 1);

    console.log(isMuted ? "Áudio desmutado" : "Áudio mutado");
  };

  return (
    <CustomTouchableOpacity onPress={handleToggle} style={styles.powerControl}>
      <Ionicons name="volume-mute" size={40} color={isMuted ? THEME.COLORS.RED : THEME.COLORS.WHITE} />
    </CustomTouchableOpacity>
  );
};

const styles = StyleSheet.create({
  powerControl: {
    width: 90,
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: THEME.COLORS.BORDERCOLORWHITE,
    backgroundColor: THEME.COLORS.BACKGROUNDWHITE
  },
});

