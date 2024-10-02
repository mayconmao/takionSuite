import React from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';

import { CustomTouchableOpacity } from '../../../Components/CustomTouchableOpacity';
import THEME from '../../../Theme';

export const OkButton = ({ command, children, onPress }) => {
  return (
    <CustomTouchableOpacity onPress={() => onPress(command)} style={styles.okButton}>
      {children}
    </CustomTouchableOpacity>
  );
};

const styles = EStyleSheet.create({
  okButton: {
    borderRadius: 55,
    width: 110,  // Largura fixa
    height: 110,  // Altura fixa
    margin: 20,  // Espaçamento entre os botões
    backgroundColor: THEME.COLORS.BACKGROUNDWHITE,  // Altere para preto
    borderWidth: 2,  // Adicione a largura da borda
    borderColor: THEME.COLORS.BORDERCOLORWHITE,  // Adicione a cor da borda
    alignItems: 'center',
    justifyContent: 'center'
  },
});
