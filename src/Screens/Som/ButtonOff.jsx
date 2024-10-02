import React, { useState } from 'react';
import { Text, StyleSheet, View } from 'react-native';

import { CustomTouchableOpacity } from '../../Components/CustomTouchableOpacity';
import THEME from '../../Theme';
import Fontisto from 'react-native-vector-icons/Fontisto';

export const ButtonOff = () => {
  // Estado interno para gerenciar se o áudio está mutado
  const [isMuted, setIsMuted] = useState(false);

  const handleToggle = () => {
    setIsMuted(!isMuted); // Alterna o estado de mutado
    // Aqui, você pode também adicionar a lógica para efetivamente mutar/desmutar o áudio
    console.log(isMuted ? "Áudio ligado" : "Áudio desligado");
  };

  return (
    <CustomTouchableOpacity
      style={[styles.button]}
      onPress={handleToggle}
    >
      <View style={styles.buttonContent}>
        <Fontisto name="power" size={50} color={isMuted ? THEME.COLORS.RED : THEME.COLORS.WHITE} />
        <Text style={styles.buttonText}>Desligar</Text>
      </View>
    </CustomTouchableOpacity>
  );
};


const styles = StyleSheet.create({
  button: {
    width: 160,
    height: 160,
    justifyContent: 'center',
    margin: 10,
    backgroundColor: THEME.COLORS.BACKGROUNDWHITE,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: THEME.COLORS.BORDERCOLORWHITE,
  },
  buttonContent: {
    alignItems: 'center',
    gap: 10
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});

