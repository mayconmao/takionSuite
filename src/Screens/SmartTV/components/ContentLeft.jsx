import React from 'react';
import { View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

import { useBleContext } from '../../../context/BleConnectionConextProvide';
import { VolumeButton } from './VolumeButton';
import { ControlButton } from './ControlButton';
import { commands, baseString } from './Commands';

import THEME from '../../../Theme';

export const ContentLeft = () => {
  const { sendCommand } = useBleContext();

  const handlePress = (command) => {
    sendCommand(`${baseString}${command}`);
  };

  return (
    <View style={styles.contentLeft}>
      <View style={{ flexDirection: 'row', marginTop: '5%', justifyContent: 'space-between', width: '80%', height: '60%' }} >
        <View style={styles.viewVolume}>
          <VolumeButton name="plus" command={commands.VolumeMais} onPress={handlePress} />
          <View style={styles.divider} />
          <VolumeButton name="minus" command={commands.VolumeMenos} onPress={handlePress} />
        </View>

        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '80%' }}>
          <ControlButton name="power-off" size={30} command={commands.LigaDesliga} onPress={handlePress} />
        </View>

        <View style={styles.viewVolume}>
          <VolumeButton name="chevron-up" command={commands.CanalMais} onPress={handlePress} />
          <View style={styles.divider} />
          <VolumeButton name="chevron-down" command={commands.CanalMenos} onPress={handlePress} />
        </View>
      </View>
      <View style={styles.viewControl}>
        <ControlButton name="backward" size={30} command={commands.Rew} onPress={handlePress} />
        <ControlButton name="play" size={30} command={commands.Play} onPress={handlePress} />
        <ControlButton name="pause" size={30} command={commands.Pausa} onPress={handlePress} />
        <ControlButton name="forward" size={30} command={commands.Fwd} onPress={handlePress} />
      </View>
    </View>
  );
};

const styles = EStyleSheet.create({
  contentLeft: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewVolume: {
    backgroundColor: THEME.COLORS.BACKGROUND,
    // backgroundColor: 'tomato',
    padding: 5,
    borderRadius: 50,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  divider: {
    height: 4, // Altura da linha de divisão
    width: '90%', // Largura da linha de divisão
    borderRadius: 20,
    backgroundColor: THEME.COLORS.BACKGROUNDWHITE,
  },
  viewControl: {
    // flex: 1,
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10,
    marginVertical: '5%',
  },
});
