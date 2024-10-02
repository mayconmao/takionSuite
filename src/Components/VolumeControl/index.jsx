import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';

import { CustomTouchableOpacity } from '../CustomTouchableOpacity';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import THEME from '../../Theme';

export const VolumeControl = ({ name, onChange, width, height }) => {
  const [isPressing, setIsPressing] = useState(false);

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
      onPress={onChange} // Verifica e chama onChange ao pressionar
      onLongPress={() => setIsPressing(true)}
      onPressOut={() => setIsPressing(false)}
      style={[
        styles.button,
        {
          width: width, height: height,
        },
      ]}>
      <FontAwesome5 name={name} size={40} color="white" />
    </CustomTouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: THEME.COLORS.BACKGROUNDWHITE,
    borderColor: THEME.COLORS.BORDERCOLORWHITE,
  },
});

