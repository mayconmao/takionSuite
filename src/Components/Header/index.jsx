import React from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import EStyleSheet from 'react-native-extended-stylesheet';

import { CustomTouchableOpacity } from '../CustomTouchableOpacity';
import Icon from 'react-native-vector-icons/MaterialIcons';

export function Header({ name, toBack, color }) {
  const navigation = useNavigation();

  function handleGoBack() {
    navigation.navigate(toBack);
  }
  return (
    <View style={styles.container}>
      <CustomTouchableOpacity onPress={handleGoBack}>
        <Icon name="arrow-back-ios" color={color} size={50} />
      </CustomTouchableOpacity>
      <Text style={{ fontSize: 50, color: color }}>
        {name}
      </Text>
    </View>
  );
}

export const styles = EStyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  }
});
