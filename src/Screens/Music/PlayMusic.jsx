import React, { useEffect, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import EStyleSheet from 'react-native-extended-stylesheet';
import TrackPlayer, { useTrackPlayerEvents, Event } from 'react-native-track-player';

import { useMusicContext } from '../../context/MusicContext';
import { VolumeControl } from '../../Components/VolumeControl';
import { Control } from '../../Components/ButtonControl';
import THEME from '../../Theme';

export const PlayMusic = () => {
  const navigation = useNavigation();
  const {
    resetList,
    resetCategories,
    selectedControl,
    setSelectedControl,
    currentTrackInfo,
    volume,
    setVolume,
    activeService,
    setActiveService,
    queue,
    addTracks,
    handleFrequencySelect, } = useMusicContext();

  const handlePress = useCallback((controlName) => {
    const togglePlayback = async () => {
      if (controlName === 'play') {
        await TrackPlayer.play();
        setSelectedControl(controlName);
      } else if (controlName === 'pause') {
        await TrackPlayer.pause();
        setSelectedControl(controlName);
      } else if (controlName === 'stop') {
        await TrackPlayer.stop(); // Para a música
        await TrackPlayer.reset(); // Zera todo o serviço do TrackPlayer
        setSelectedControl(null);
        resetList([]);
        resetCategories(null);
        handleGoBack()
      }
    };

    togglePlayback();
  }, [setSelectedControl, handleFrequencySelect]);

  useEffect(() => {
    const prepareMusicService = async () => {
      if (activeService !== 'music') {
        await TrackPlayer.reset();
        addTracks(queue);
        setActiveService('music'); // Atualiza o serviço ativo no contexto para música
      }
    };

    prepareMusicService();

    if (selectedControl === null || selectedControl === 'play') {
      TrackPlayer.play();
      setSelectedControl('play')
    } else if (selectedControl === 'pause') {
      TrackPlayer.pause();
    }

  }, [queue]);

  useTrackPlayerEvents([Event.PlaybackError], async (error) => {
    console.debug('Playback Error: ', error);
    handlePlaybackError();
  });

  const handlePlaybackError = async () => {
    try {
      await TrackPlayer.skipToNext();
    } catch (e) {
      console.warn('Erro ao tentar pular para a próxima faixa: ', e);
      await TrackPlayer.stop();
      Alert.alert("Erro de Reprodução", "Não foi possível pular para a próxima faixa. A reprodução será interrompida.");
    }
  };

  function handleGoBack() {
    navigation.navigate('Library');
  }

  // Função para aumentar o volume
  const increaseVolume = () => {
    setVolume(prevVolume => prevVolume < 100 ? prevVolume + 1 : 100);
  };

  // Função para diminuir o volume
  const decreaseVolume = () => {
    setVolume(prevVolume => prevVolume > 0 ? prevVolume - 1 : 0);
  };

  if (!currentTrackInfo) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', marginRight: 10 }}>
        <View style={styles.radio}>
          <Text style={styles.radioText}>Escolha uma Música</Text>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.songDetail}>
      <View style={styles.musicDetails}>
        <View style={styles.musicImage}>
          {currentTrackInfo?.album?.path ?
            <Image
              source={{ uri: `file://${currentTrackInfo.album.path}` }}
              style={styles.coverImage}
            /> :
            <Image
              source={require('../../assets/plus.png')}
              style={styles.coverImage}
            />
          }
          <View style={styles.wrapText}>
            <Text
              style={styles.nameText}
              numberOfLines={1}
              ellipsizeMode='tail'
            >{currentTrackInfo?.title || ''}</Text>
            <Text style={styles.placeholderText}>{currentTrackInfo?.artist || ''}</Text>
          </View>
        </View>
        <View style={styles.controls}>
          <Control
            name="play"
            onPress={() => handlePress('play')}
            isSelected={selectedControl === 'play' || selectedControl === null}
            theme={THEME}
          />
          <Control
            name="pause"
            onPress={() => handlePress('pause')}
            isSelected={selectedControl === 'pause'}
            theme={THEME}
          />
          <Control
            name="stop"
            onPress={() => handlePress('stop')}
            isSelected={selectedControl === 'stop'}
            theme={THEME}
          />
        </View>
        <View style={styles.viewControl}>
          <VolumeControl name="minus" width={90} height={90} onChange={decreaseVolume} />
          <Text style={styles.volumeText}>{volume}</Text>
          <VolumeControl name="plus" width={90} height={90} onChange={increaseVolume} />
        </View>
      </View>
    </View >
  )
}

const styles = EStyleSheet.create({
  songDetail: {
    flex: 1,
    marginRight: 15,
    width: 380,
  },
  musicDetails: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: 10,
    overflow: 'hidden',
  },
  musicImage: {
    width: '100%',
    alignItems: 'center',
    gap: 10,
    borderRadius: 10,
  },
  coverImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    resizeMode: 'cover'
  },
  wrapText: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  nameText: {
    fontSize: 20,
    color: '#fff',
    flexShrink: 1,
  },
  placeholderText: {
    fontSize: 15,
    color: '#fff',
    flexShrink: 1,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    gap: 50,
    marginBottom: '3%'
  },
  radio: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: THEME.COLORS.BACKGROUNDWHITE,
    borderWidth: 1,
    borderColor: THEME.COLORS.BORDERCOLORWHITE,
    borderRadius: 12,
  },
  radioText: {
    flexShrink: 1,
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
  },
  viewControl: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10,
  },
  volumeText: {
    color: 'white',
    fontSize: 35,
    textAlign: 'center',
  },
});