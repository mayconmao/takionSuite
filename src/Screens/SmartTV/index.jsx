import React, { useState, useEffect } from 'react';
import { View } from 'react-native';

import { LayoutBase } from '../LayoutBase';
import EStyleSheet from 'react-native-extended-stylesheet';

import { ContentLeft } from './components/ContentLeft';
import { ContentRight } from './components/ContentRight';
import { ContentTop } from './components/ContentTop';

export function SmartTV() {
  return (
    <View style={styles.container}>
      <LayoutBase customStyle={styles.container}>
        <ContentTop />
        <View style={styles.contentContainer}>
          <ContentLeft />
          <ContentRight />
        </View>
      </LayoutBase>
    </View>
  );
};

const styles = EStyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingTop: 10,
  },
});