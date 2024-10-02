// Control.js
import React from 'react';
import { StyleSheet } from 'react-native';

import { CustomTouchableOpacity } from '../CustomTouchableOpacity';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import THEME from '../../Theme';

export const Control = ({ name, onPress, isSelected, theme }) => {
  return (
    <CustomTouchableOpacity onPress={onPress} style={styles.control}>
      <FontAwesome5
        name={name}
        size={40}
        color={isSelected ? THEME.COLORS.BORDERSELECTED : THEME.COLORS.ICONCOLOR}
      />
    </CustomTouchableOpacity>
  );
};

const styles = StyleSheet.create({
  control: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 90,
    height: 90,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: THEME.COLORS.BACKGROUNDWHITE,
    borderColor: THEME.COLORS.BORDERCOLORWHITE,
  },
});


