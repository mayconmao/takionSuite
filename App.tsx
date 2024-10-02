import React, { useEffect } from 'react';
import { Dimensions, StatusBar } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import TrackPlayer from 'react-native-track-player';
import EStyleSheet from 'react-native-extended-stylesheet';

import { Providers } from './src/Router';
import { setupPlayer } from './src/Service/serviceTrackPlayer';

// define REM depending on screen width 
const { width } = Dimensions.get('window');
const rem = width > 340 ? 18 : 17;

// calc styles
EStyleSheet.build({
  $rem: rem,
});

TrackPlayer.registerPlaybackService(() => require('./src/Service/service'));

export default function App() {

  useEffect(() => {
    setupPlayer();
  }, []);

  return (

    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar hidden={true} />
      <Providers />
    </GestureHandlerRootView>
  );
}