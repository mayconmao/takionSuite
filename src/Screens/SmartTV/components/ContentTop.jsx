import React, { useState } from 'react';
import { View, Image, Text } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import { commands, baseString } from './Commands';
import { GenericButton } from './GenericButton';

import THEME from '../../../Theme';
import { Header } from '../../../Components/Header';
import { StreamingButton } from './StreamingButton';
import { useBleContext } from '../../../context/BleConnectionConextProvide';


export const ContentTop = () => {
  // const [activeButton, setActiveButton] = useState(null); // Estado para saber qual botão está ativo
  const { sendCommand } = useBleContext();
  // Função para lidar com o clique no botão
  // const handlePress = (buttonId, command) => {
  //   setActiveButton(buttonId);  // Atualiza o botão ativo
  //   sendCommand(command, start);  // Envia o comando

  // };

  const handlePress = (command) => {
    const cmd = `${baseString}${command}`
    sendCommand(cmd);
  };



  return (
    <View style={styles.containerHeader}>
      <View style={styles.back}>
        <Header name="TV" toBack="Home" color={THEME.COLORS.TEXTHOME} />
      </View>

      <View style={styles.containerPower}>
        <GenericButton command={commands.Entrada} onPress={handlePress}>
          <Material name="audio-input-rca" size={40} color={THEME.COLORS.TEXTHOME} />
          <Text style={styles.controlText}>Entradas</Text>
        </GenericButton>

        <View style={styles.containerStreaming}>
          <GenericButton
            command={commands.TV} onPress={handlePress}
          >
            <Image source={require("../../../assets/TV.png")} style={styles.image} />
          </GenericButton>

          <GenericButton
            command={commands.Streaming} onPress={handlePress}
          >
            <Image source={require("../../../assets/netflix.png")} style={styles.image} />
          </GenericButton>

          <GenericButton
            command={commands.Streaming} onPress={handlePress}
          >
            <Image source={require("../../../assets/prime.png")} style={styles.image} />
          </GenericButton>

          <GenericButton
            command={commands.Streaming} onPress={handlePress}
          >
            <Image source={require("../../../assets/globoplay.png")} style={styles.image} />
          </GenericButton>

          <GenericButton
            command={commands.Streaming} onPress={handlePress}
          >
            <Image source={require("../../../assets/hbo.png")} style={styles.image} />
          </GenericButton>
        </View>
      </View>
    </View>
  );
};

const styles = EStyleSheet.create({
  containerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingHorizontal: '2%',
  },
  back: {
    // backgroundColor: 'tomato'
  },
  containerPower: {
    // width: '40%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    gap: 50,
    borderRadius: 10,
    backgroundColor: THEME.COLORS.BACKGROUND,
  },
  containerStreaming: {
    flexDirection: 'row',
    gap: 6
  },
  powerControl: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: THEME.COLORS.BORDERCOLORWHITE,
    backgroundColor: THEME.COLORS.BACKGROUNDWHITE,
  },
  buttonStreaming: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 90,
    height: 90,
    borderRadius: 10,
    padding: 10,
    // borderWidth: 1,
    // borderColor: '#fcfcfc',
    backgroundColor: THEME.COLORS.BACKGROUNDWHITE,
  },
  muteControl: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    // borderColor: '#fcfcfc',
    // backgroundColor: THEME.COLORS.BACKGROUNDWHITE,
  },
  statusText: {
    color: 'white',
    marginTop: 3,
  },
  image: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  controlText: {
    color: 'white',
    fontSize: 15,
    // textAlign: 'center',
  },
});


{/* <View style={styles.containerStreaming}>
<StreamingButton
  isActive={activeButton === 'tv'}
  onPress={() => handlePress('tv', commands.TV)}
>
  <Image source={require("../../../assets/TV.png")} style={styles.image} />
</StreamingButton>

<StreamingButton
  isActive={activeButton === 'netflix'}
  onPress={() => handlePress('netflix', commands.TV)}
>
  <Image source={require("../../../assets/netflix.png")} style={styles.image} />
</StreamingButton>

<StreamingButton
  isActive={activeButton === 'prime'}
  onPress={() => handlePress('prime', commands.TV)}
>
  <Image source={require("../../../assets/prime.png")} style={styles.image} />
</StreamingButton>

<StreamingButton
  isActive={activeButton === 'globo'}
  onPress={() => handlePress('globo', commands.TV)}
>
  <Image source={require("../../../assets/globoplay.png")} style={styles.image} />
</StreamingButton>

<StreamingButton
  isActive={activeButton === 'hbo'}
  onPress={() => handlePress('hbo', commands.TV)}
>
  <Image source={require("../../../assets/hbo.png")} style={styles.image} />
</StreamingButton>
</View> */}