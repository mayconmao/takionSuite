import React from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';

import { CustomTouchableOpacity } from '../CustomTouchableOpacity';
import THEME from '../../Theme';

export const GenericButton = ({ command, children, onPress }) => {

  return (
    <CustomTouchableOpacity onPress={() => onPress(command)} style={styles.arrowButton}>
      {children}
    </CustomTouchableOpacity>
  );
};

const styles = EStyleSheet.create({
  arrowButton: {
    width: 85,  // Largura fixa
    height: 85,  // Altura fixa
    margin: 5,  // Espaçamento entre os botões
    borderRadius: 10,
    backgroundColor: THEME.COLORS.BACKGROUNDWHITE,
    borderWidth: 2,  // Largura da borda
    borderColor: THEME.COLORS.BORDERCOLORWHITE,
    alignItems: 'center',
    justifyContent: 'center'
  },
});
