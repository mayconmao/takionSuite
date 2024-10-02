import React, { useState } from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';

import { CustomTouchableOpacity } from '../../../Components/CustomTouchableOpacity';
import { sendCommand } from './sendCommand';
import THEME from '../../../Theme';

export const StreamingButton = ({ isActive, onPress, children }) => {
  const buttonStyle = {
    ...styles.buttonStreaming,
    ...(isActive && { borderColor: THEME.COLORS.BORDERSELECTED, borderWidth: 1 }),
  };

  return (
    <CustomTouchableOpacity onPress={onPress} style={buttonStyle}>
      {children}
    </CustomTouchableOpacity>
  );
};

const styles = EStyleSheet.create({
  buttonStreaming: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 90,
    height: 90,
    borderRadius: 10,
    padding: 10,
    backgroundColor: THEME.COLORS.BACKGROUNDWHITE,
  }
});