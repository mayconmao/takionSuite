import React from 'react';
import { View, Text } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

import { useBleContext } from '../../../context/BleConnectionConextProvide';
import { ArrowButton } from './ArrowButton';
import { GenericButton } from './GenericButton';
import { baseString, commands } from './Commands';

import THEME from '../../../Theme';
import { OkButton } from './OkBuotton';

import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';


export const ContentRight = () => {
  const { sendCommand } = useBleContext();
  const handlePress = (command) => {
    sendCommand(`${baseString}${command}`);
  };

  return (
    <View style={styles.contentRight}>
      <View style={styles.arrowButtonsContainer}>
        <View style={styles.rowUp}>
          <GenericButton command={commands.Home} onPress={handlePress}>
            <Entypo name="home" size={40} color={THEME.COLORS.TEXTHOME} />
          </GenericButton>
          <ArrowButton direction="up" iconName="up" command={commands.SetaCima} onPress={handlePress} />
          <GenericButton command={commands.Mute} onPress={handlePress}>
            <Ionicons name="volume-mute" size={50} color={THEME.COLORS.TEXTHOME} />
          </GenericButton>
        </View>
        <View style={styles.row}>
          <ArrowButton direction="left" iconName="left" command={commands.SetaEsquerda} onPress={handlePress} />
          <OkButton command={commands.OK} onPress={handlePress}>
            <Text style={styles.okButtonText}>OK</Text>
          </OkButton>
          <ArrowButton direction="right" iconName="right" command={commands.SetaDireita} onPress={handlePress} />
        </View>
        <View style={styles.rowUp}>
          <GenericButton command={commands.Voltar} onPress={handlePress}>
            <Entypo name="back" size={40} color={THEME.COLORS.TEXTHOME} />
            <Text style={styles.controlText}>Voltar</Text>
          </GenericButton>
          <ArrowButton direction="down" iconName="down" command={commands.SetaBaixo} onPress={handlePress} />
          <GenericButton command={commands.Sair} onPress={handlePress}>
            <FontAwesome5 name="door-open" size={35} color={THEME.COLORS.TEXTHOME} />
            <Text style={styles.controlText}>Sair</Text>
          </GenericButton>
        </View>
      </View>
    </View>
  )
};


const styles = EStyleSheet.create({
  contentRight: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'orange', // Cor do conteúdo à direita
    padding: 10,
  },
  arrowButtonsContainer: {
    flexDirection: 'colum',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  rowUp: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    gap: 25
  },
  okButtonText: {
    color: 'white',
    fontSize: 35,
    textAlign: 'center',
  },
  controlText: {
    color: 'white',
    fontSize: 15,
  },
});
