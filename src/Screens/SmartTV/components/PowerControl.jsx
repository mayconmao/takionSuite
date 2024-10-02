import React from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';

import { sendCommand } from './sendCommand';
import { CustomTouchableOpacity } from '../../../Components/CustomTouchableOpacity';
import Fontisto from 'react-native-vector-icons/Fontisto';
import THEME from '../../../Theme';

export const PowerControl = ({ command }) => {
  const handlePress = () => {
    sendCommand(command);
  };

  return (
    <CustomTouchableOpacity onPress={handlePress} style={styles.powerControl}>
      <Fontisto name='power' size={40} color={THEME.COLORS.WHITE} />
    </CustomTouchableOpacity>
  );
};

const styles = EStyleSheet.create({
  powerControl: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: THEME.COLORS.BORDERCOLORWHITE,
    backgroundColor: THEME.COLORS.BACKGROUNDWHITE,
  }
});