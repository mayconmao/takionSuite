import React, { useState, useEffect } from 'react';
import { Text, StyleSheet, View } from 'react-native';

import { CustomTouchableOpacity } from '../../Components/CustomTouchableOpacity';
import THEME from '../../Theme'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

export const ButtonVolume = ({ onChange, iconName }) => {

  const [isPressing, setIsPressing] = useState(false);

  useEffect(() => {
    let interval;
    if (isPressing && onChange) {
      interval = setInterval(() => {
        onChange()
      }, 100);
    }

    return () => clearInterval(interval);
  }, [isPressing, onChange]);

  return (
    <>
      <CustomTouchableOpacity
        style={[styles.button]}
        onPress={onChange}
        onLongPress={() => setIsPressing(true)}
        onPressOut={() => setIsPressing(false)}
      >
        <View style={styles.buttonContent}>
          <FontAwesome5 name={iconName} size={50} color={THEME.COLORS.TEXTHOME} />
          <Text style={styles.buttonText}>Volume</Text>
        </View>
      </CustomTouchableOpacity>
    </>
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