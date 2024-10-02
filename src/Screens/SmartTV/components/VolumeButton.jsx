import React from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';

import { sendCommand } from './sendCommand';
import { CustomTouchableOpacity } from '../../../Components/CustomTouchableOpacity';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import THEME from '../../../Theme';

export const VolumeButton = ({ name, command, onPress }) => {

  return (
    <CustomTouchableOpacity onPress={() => onPress(command)} style={styles.controlVolume}>
      <FontAwesome5 name={name} size={35} color="white" />
    </CustomTouchableOpacity>
  );
};

const styles = EStyleSheet.create({
  controlVolume: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 75,
    height: 75,
    borderRadius: 200,
    // borderWidth: 1,
    backgroundColor: THEME.COLORS.BACKGROUNDWHITE,
    // borderColor: THEME.COLORS.BORDERCOLORWHITE,
  },
});

