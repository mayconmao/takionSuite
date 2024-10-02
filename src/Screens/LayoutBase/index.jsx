import React from 'react';
import { ImageBackground, StyleSheet } from 'react-native';

// const backgroundImage = { uri: 'URL_DA_SUA_IMAGEM_AQUI' };
import backgroundImage from '../../assets/flor.png';

export const LayoutBase = ({ children, customStyle }) => (
  <ImageBackground source={backgroundImage} style={[{ backgroundColor: '#000' }, customStyle]}>
    {children}
  </ImageBackground>
);

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    height: '100%',
  },
});
