import React, { useCallback } from 'react';
import { View, Text, StyleSheet, Image, FlatList } from 'react-native';
import TrackPlayer from 'react-native-track-player';

import { useMusicContext } from '../../context/MusicContext';
import { CustomTouchableOpacity } from '../../Components/CustomTouchableOpacity';
import THEME from '../../Theme';

export const List = () => {
  const { queue, setCurrentTrack } = useMusicContext();

  const CardRendering = ({ album, title, artist, index }) => {

    const onPressMusicItem = async () => {

      await TrackPlayer.skip(index);
      setCurrentTrack(index);
    };

    return (
      <CustomTouchableOpacity style={styles.item} onPress={onPressMusicItem}>
        <Image
          source={{ uri: `file://${album.path}` }}
          style={styles.itemImage}
        />
        <View style={styles.wrapText}>
          <Text
            style={styles.itemText}
            numberOfLines={1} // Define o número máximo de linhas que o texto deve ocupar
            ellipsizeMode='tail' // Adiciona as reticências no final do texto se ele for maior que o espaço disponível
          >{title}</Text>
          <Text style={styles.textArtist}>{artist}</Text>
        </View>
      </CustomTouchableOpacity>
    )
  };

  const renderItem = useCallback(({ item, index }) => (<CardRendering key={item.id} {...item} index={index} />), []);
  const keyExtractor = useCallback(item => String(item.id), []);

  if (queue.length === 0) {
    return <ErrorComponent />
  }

  return (
    <View style={styles.songList}>
      <FlatList
        data={queue}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 0, margin: 0 }}
      />
    </View>
  )
}

export const ErrorComponent = () => {

  return (
    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: 'transparent' }
    }>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#fff', fontSize: 25 }}>Não há Músicas</Text>
        <Text style={{ color: '#fff', fontSize: 15 }}>Selecione um estilo</Text>
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  songList: {
    flex: 1,
  },

  item: {
    flex: 1,
    padding: 7,
    marginBottom: 5,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
    gap: 30,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: THEME.COLORS.BORDERCOLORWHITE,
    backgroundColor: THEME.COLORS.BACKGROUNDWHITE,
  },
  itemImage: {
    width: 64,
    height: 64,
    borderRadius: 30,
  },
  wrapText: {
    flexShrink: 1,
  },
  itemText: {
    fontSize: 25,
    color: '#fff',
  },
  textArtist: {
    fontSize: 15,
    color: '#fff',
  }
});