import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, Alert } from 'react-native';
import TrackPlayer, { usePlaybackState, useTrackPlayerEvents, Event } from 'react-native-track-player';
import EStyleSheet from 'react-native-extended-stylesheet';

import { useMusicContext } from '../../../context/MusicContext';
import { VolumeControl } from '../../../Components/VolumeControl';
import { Control } from '../../../Components/ButtonControl';

import THEME from '../../../Theme';

export const ContentRight = () => {
  const {
    selectedFrequence,
    selectedControl,
    setSelectedControl,
    handleFrequencySelect,
    volume,
    setVolume,
    activeService,
    setActiveService } = useMusicContext();

  const playbackState = usePlaybackState();
  const [currentTrack, setCurrentTrack] = useState(null);
  const isLoading = playbackState === TrackPlayer.STATE_BUFFERING || playbackState === TrackPlayer.STATE_CONNECTING;

  useTrackPlayerEvents([Event.PlaybackError], async (error) => {
    console.debug('Playback Error: ', error);
    showAlert()
  });

  const showAlert = () => {
    Alert.alert(
      'Descupe-nos!!', // Título do alerta
      'Rádio indisponível no momento', // Mensagem que você quer mostrar
      [
        {
          text: 'OK',
          onPress: () => {
            handleFrequencySelect(null);
          },
        },
      ],
      { cancelable: false } // Impede que o alerta seja fechado tocando fora dele
    );
  };


  const handlePress = useCallback((controlName) => {
    const togglePlayback = async () => {
      if (controlName === 'play') {
        await TrackPlayer.play();
        setSelectedControl(controlName);
      } else if (controlName === 'pause') {
        await TrackPlayer.pause();
        setSelectedControl(controlName);
      } else if (controlName === 'stop') {
        await TrackPlayer.stop();
        await TrackPlayer.reset();
        handleFrequencySelect(null);
        setSelectedControl(null);
      }
    };

    togglePlayback();
  }, [setSelectedControl, handleFrequencySelect]);

  useEffect(() => {

    const loadTrack = async () => {

      if (activeService !== 'radio') {
        await TrackPlayer.reset(); // Resetar apenas se estiver mudando para um tipo de serviço diferente
        setActiveService('radio');
      }

      // Obtenha a faixa atualmente em reprodução
      const currentQueue = await TrackPlayer.getQueue();
      const isTrackLoaded = currentQueue.some(track => track.id === selectedFrequence.id.toString());

      // Se a faixa selecionada não estiver carregada ou se não houver faixas, carregue a nova faixa
      if (!isTrackLoaded || currentQueue.length === 0) {
        await TrackPlayer.reset();
        await TrackPlayer.add({
          id: selectedFrequence.id.toString(),
          url: selectedFrequence.play,
          title: selectedFrequence.name,
          artist: 'Radio',
        });
        setCurrentTrack(selectedFrequence.id);
      }

      // Verifica o estado para tocar ou pausar a música
      // if (selectedControl === 'play') {
      //   TrackPlayer.play();
      // } else if (selectedControl === 'pause') {
      //   TrackPlayer.pause();
      // }

      if (selectedControl === null || selectedControl === 'play') {
        TrackPlayer.play();
        setSelectedControl('play')
      } else if (selectedControl === 'pause') {
        TrackPlayer.pause();
      }

    };

    if (selectedFrequence && currentTrack !== selectedFrequence.id) {
      loadTrack();
    }

  }, [selectedFrequence, selectedControl]);

  // Função para aumentar o volume
  const increaseVolume = () => {
    setVolume(prevVolume => prevVolume < 100 ? prevVolume + 1 : 100);
  };

  // Função para diminuir o volume
  const decreaseVolume = () => {
    setVolume(prevVolume => prevVolume > 0 ? prevVolume - 1 : 0);
  };

  if (!selectedFrequence) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <View style={styles.radio}>
          <Text style={styles.radioText}>Escolha uma Radio</Text>
        </View>
      </View>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      {isLoading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
      <View style={styles.radio}>
        <Image source={{ uri: selectedFrequence.img }} style={styles.radioImageRight} />
        <Text style={styles.radioText}>{selectedFrequence.name}</Text>
      </View>
      <View style={styles.viewControl}>
        <Control
          name="play"
          onPress={() => handlePress('play')}
          isSelected={selectedControl === 'play'}
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
  );
};

const styles = EStyleSheet.create({
  radio: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 30,
    padding: 25,
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: THEME.COLORS.BACKGROUNDWHITE,
    borderRadius: 12,
    marginTop: 5
  },
  radioText: {
    flexShrink: 1,
    color: 'white',
    fontSize: 35,
    fontWeight: 'bold',
  },
  radioImageRight: {
    width: 90,
    height: 90,
    borderRadius: 25,
  },
  viewControl: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 25,
  },
  volumeText: {
    color: 'white',
    fontSize: 35,
    textAlign: 'center',
  },
});