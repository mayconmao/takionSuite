import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { CustomTouchableOpacity } from '../CustomTouchableOpacity';

export const ErrorComponent = ({ screen }) => {
  const navigation = useNavigation();

  function handleGoBack() {
    navigation.navigate(screen);
  }

  return (
    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: '#000' }
    }>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Image
          source={require('../../assets/error.png')}
          resizeMode="contain"
        />
      </View>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#fff', fontSize: 50 }}>Perdoe-nos!!</Text>
        <Text style={{ color: '#fff', fontSize: 20 }}>Parece que não encontramos o que pediu</Text>
        <Text style={{ color: '#fff', fontSize: 20 }}>Aperte o Botõe abaixo para ir à página inicial</Text>
        <CustomTouchableOpacity onPress={handleGoBack} style={styles.control}>
          <Text style={{ color: '#fff', fontSize: 20 }}>Voltar</Text>
        </CustomTouchableOpacity>
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  control: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    padding: 20,
    borderRadius: 10,
    backgroundColor: "blue",
    marginTop: 20
  }
});