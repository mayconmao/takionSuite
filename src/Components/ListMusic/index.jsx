import React, { useState, useCallback } from 'react';
import { View, FlatList, Text, TouchableOpacity, Image } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

import { useMusicContext } from '../../context/MusicContext';
import { CustomTouchableOpacity } from '../CustomTouchableOpacity';
import THEME from '../../Theme';

export const ListMusic = ({ data }) => {
  const { handleFrequencySelect } = useMusicContext();

  const [selectedRadio, setSelectedRadio] = useState(null);

  const CardRendering = (item) => {
    return (
      < CustomTouchableOpacity
        style={[styles.radioButton, selectedRadio === item && styles.selectedButton]}
        onPress={() => {
          setSelectedRadio(item);
          handleFrequencySelect(item);
        }}>
        <Image source={{ uri: item.img }} style={styles.radioImage} />
        <Text style={styles.radioButtonText}>{item.name}</Text>
      </ CustomTouchableOpacity >
    )
  };

  const renderItem = useCallback(({ item, index }) => (<CardRendering {...item} index={index} />), []);
  const keyExtractor = useCallback(item => String(item.id), []);

  return (
    <View style={styles.contentLeft}>
      <FlatList
        data={data}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 0, margin: 0 }}
      />
    </View>
  );
};

const styles = EStyleSheet.create({
  contentLeft: {
    flex: 1,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    backgroundColor: THEME.COLORS.BACKGROUNDWHITE,
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  selectedButton: {
    borderColor: THEME.COLORS.BORDERSELECTED,
    borderWidth: 2,
  },
  radioImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  radioButtonText: {
    flexShrink: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: THEME.COLORS.TEXTHOME,
    textAlign: 'center'
  }
});