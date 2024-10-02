import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableWithoutFeedback } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useNavigation } from '@react-navigation/native';
import THEME from '../../Theme';

export function SideBar({ name, title }) {
  const [tapCount, setTapCount] = useState(0);
  const navigation = useNavigation();

  const handleTripleTap = () => {
    const newTapCount = tapCount + 1;
    setTapCount(newTapCount);

    if (newTapCount === 3) {
      // Reseta o contador
      setTapCount(0);

      // Executa a ação de navegação
      // Substitua 'YourTargetScreen' pelo destino desejado
      navigation.navigate('Settings');

      // Caso não esteja usando React Navigation, substitua por sua lógica de navegação
      // console.log('Navegando para a página desejada...');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={handleTripleTap}>
        <View style={styles.contentName}>
          <Text style={styles.textName}>{name}</Text>
          <Text style={styles.textWelcome}>{title}</Text>
        </View>
      </TouchableWithoutFeedback>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Image
          source={require('../../assets/porta.jpg')}
          style={styles.imageStyle}
        />
      </View>
    </View>
  );
};

export const styles = EStyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: THEME.COLORS.BACKGROUND,
    padding: '1.25rem',
    marginLeft: '0.3125rem',
    marginRight: '0.3125rem',
    marginTop: '0.3125rem',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: THEME.COLORS.BORDERCOLORADIO
  },
  contentName: {
    alignItems: 'center'
  },
  textName: {
    fontSize: '1.5rem',
    color: THEME.COLORS.TEXTHOME,
    fontWeight: "bold"
  },
  textWelcome: {
    fontSize: '1rem',
    color: THEME.COLORS.TEXTHOME,
    fontWeight: "500"
  },
  imageStyle: {
    width: '9rem',
    height: '9rem',
    borderRadius: '5rem'
  },
});