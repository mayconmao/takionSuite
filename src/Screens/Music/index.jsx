import React from 'react';
import { View, StyleSheet } from 'react-native';

import { MyTopTabs } from '../../Router/navigation';

import { LayoutBase } from '../LayoutBase';
import { HeaderTop } from '../../Components/HeaderMusic';
import { PlayMusic } from './PlayMusic';

export const PlayMusics = () => {

  return (
    <View style={styles.container}>
      <LayoutBase customStyle={styles.container}>
        <View style={styles.wrap}>
          <View>
            <HeaderTop name="Música" screen="Som" />
            <PlayMusic />
          </View>
          <MyTopTabs />
        </View >
      </LayoutBase >
    </View >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000'
  },
  wrap: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 10,
    marginHorizontal: 15,
  },
});