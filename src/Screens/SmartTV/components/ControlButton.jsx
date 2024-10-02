import React from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import { CustomTouchableOpacity } from '../../../Components/CustomTouchableOpacity';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import THEME from '../../../Theme';

export const ControlButton = ({ name, size, command, onPress }) => {

  return (
    <CustomTouchableOpacity onPress={() => onPress(command)} style={styles.controlPlay}>
      <FontAwesome5 name={name} size={size} color={THEME.COLORS.WHITE} />
    </CustomTouchableOpacity>
  );
};

const styles = EStyleSheet.create({
  controlPlay: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 70,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: THEME.COLORS.BACKGROUNDWHITE,
    borderColor: THEME.COLORS.BORDERCOLORWHITE,
  },
});

