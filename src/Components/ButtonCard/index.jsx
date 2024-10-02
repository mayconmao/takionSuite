import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View } from 'react-native';

import { CustomTouchableOpacity } from '../CustomTouchableOpacity';
import THEME from '../../Theme'

export const ButtonCard = ({ onPress, name, iconName, icon }) => {
  let Icon = icon;
  return (
    <CustomTouchableOpacity
      style={[styles.button]}
      onPress={onPress}
    >
      <View style={styles.buttonContent}>
        <Icon name={iconName} size={50} color={THEME.COLORS.TEXTHOME} />
        <Text style={styles.buttonText}>{name}</Text>
      </View>
    </CustomTouchableOpacity>
  );
};

export const ButtonVolume = ({ onChange, name, iconName, icon }) => {
  const [isPressing, setIsPressing] = useState(false);
  let Icon = icon;

  useEffect(() => {
    let interval;
    if (isPressing && onChange) { // Verifica se onChange está definida
      interval = setInterval(() => {
        onChange(); // Chama onChange se definida
      }, 100); // Ajusta o intervalo conforme necessário
    }
    return () => clearInterval(interval);
  }, [isPressing, onChange]);

  return (
    <CustomTouchableOpacity
      style={[styles.button]}
      onPress={onChange}
      onLongPress={() => setIsPressing(true)}
      onPressOut={() => setIsPressing(false)}
    >
      <View style={styles.buttonContent}>
        <Icon name={iconName} size={50} color={THEME.COLORS.TEXTHOME} />
        <Text style={styles.buttonText}>{name}</Text>
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