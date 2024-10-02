import React from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import Icon from 'react-native-vector-icons/AntDesign';

import { CustomTouchableOpacity } from '../../../Components/CustomTouchableOpacity';
import THEME from '../../../Theme';

export const ArrowButton = ({ onPress, iconName, command }) => {

  return (
    <CustomTouchableOpacity onPress={() => onPress(command)} style={styles.arrowButton}>
      <Icon name={iconName} size={50} color={THEME.COLORS.TEXTHOME} />
    </CustomTouchableOpacity>
  );
};

const styles = EStyleSheet.create({
  arrowButton: {
    width: 85,  // Largura fixa
    height: 85,  // Altura fixa
    margin: 5,  // Espaçamento entre os botões
    borderRadius: 10,
    backgroundColor: THEME.COLORS.BACKGROUNDWHITE,  // Altere para preto
    borderWidth: 2,  // Adicione a largura da borda
    borderColor: THEME.COLORS.BORDERCOLORWHITE,  // Adicione a cor da borda
    alignItems: 'center',
    justifyContent: 'center'
  },
});
