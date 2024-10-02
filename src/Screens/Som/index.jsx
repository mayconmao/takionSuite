import React from 'react';
import { View, Text } from 'react-native';

import EStyleSheet from 'react-native-extended-stylesheet';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { useMusicContext } from '../../context/MusicContext';
import { LayoutBase } from '../LayoutBase';
import { Header } from '../../Components/Header';
import { ButtonCard } from '../../Components/ButtonCard';
import { MuteButton } from '../../Components/MuteButton';
import { ButtonOff } from './ButtonOff';
import { Bluetooth } from './Bluetooth';
import { ButtonVolume } from './ButtonVolume';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';

import THEME from '../../Theme';

export function Som() {
  const navigation = useNavigation();
  const { volume, setVolume } = useMusicContext();

  const handleButtonPress = (screen) => {
    navigation.navigate(screen);
  };

  // Função para aumentar o volume
  const increaseVolume = () => {
    setVolume(prevVolume => prevVolume < 100 ? prevVolume + 1 : 100);
  };

  // Função para diminuir o volume
  const decreaseVolume = () => {
    setVolume(prevVolume => prevVolume > 0 ? prevVolume - 1 : 0);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LayoutBase customStyle={styles.container}>
        <View style={{ flex: 1 }}>
          <View style={{ margin: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Header name="Som" toBack="Home" color={THEME.COLORS.TEXTHOME} />
            <MuteButton />
          </View>
          <View style={styles.content}>
            <View style={styles.halfScreenLeft}>
              <View style={{ flexDirection: 'row', gap: 55 }}>
                <ButtonOff />
                <Bluetooth />
              </View>
              <View style={{ flexDirection: 'row', gap: 55 }}>
                <ButtonCard
                  onPress={() => handleButtonPress("PlayMusic")}
                  name="Música"
                  borderColor={THEME.COLORS.BORDERCOLORADIO}
                  icon={Fontisto}
                  iconName="applemusic"
                />
                <ButtonCard
                  onPress={() => handleButtonPress("Radio")}
                  name="Radio"
                  borderColor={THEME.COLORS.BORDERCOLORADIO}
                  icon={MaterialIcons}
                  iconName="radio"
                />
              </View>
            </View>
            <View style={styles.halfScreenRight}>
              <ButtonVolume onChange={increaseVolume} iconName="plus" />
              <View style={{ alignItems: 'center' }}>
                <Text style={{ color: '#fff', fontSize: 40 }}>{volume}</Text>
              </View>
              <ButtonVolume onChange={decreaseVolume} iconName="minus" />
            </View>
          </View>
        </View>
      </LayoutBase>
    </SafeAreaView >
  );
};


const styles = EStyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  halfScreenLeft: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: 55
  },
  halfScreenRight: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 50,
  }
});
