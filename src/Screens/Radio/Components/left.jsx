import React, { useState, useCallback } from 'react';
import { View, FlatList, Text, Image } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

import { useMusicContext } from '../../../context/MusicContext';
import { CustomTouchableOpacity } from '../../../Components/CustomTouchableOpacity';
import THEME from '../../../Theme';

export const ContentLeft = () => {
  const { handleFrequencySelect } = useMusicContext();

  const [selectedRadio, setSelectedRadio] = useState(null);

  const CardRendering = (item) => {
    return (
      < CustomTouchableOpacity
        style={[styles.radioButton, selectedRadio === item && styles.selectedButton]}
        onPress={() => {
          setSelectedRadio(item);
          handleFrequencySelect(item);
        }}>
        <Image source={{ uri: item.img }} style={styles.radioImage} />
        <Text style={styles.radioButtonText}>{item.name}</Text>
      </ CustomTouchableOpacity >
    )
  };

  const renderItem = useCallback(({ item, index }) => (<CardRendering {...item} index={index} />), []);
  const keyExtractor = useCallback(item => String(item.id), []);

  return (
    <View style={styles.contentLeft}>
      <FlatList
        data={radioFrequencies}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 0, margin: 0 }}
      />
    </View>
  );
};

const radioFrequencies = [
  {
    id: 1,
    name: "Rádio 99,5",
    img: "https://www.radio995fm.com.br/wp-content/uploads/2020/02/logo-fav.png",
    play: "https://ssl.zoeweb.net/proxy/serradourada?mp=/stream"
  },
  {
    id: 2,
    name: "DIFUSORA - FM 95,5",
    img: "https://img.radios.com.br/radio/lg/radio23733_1672825894.jpeg",
    play: "https://difusoragoiania.virtuaserver.com.br:8000/radio.mp3"
  },
  {
    id: 3,
    name: "Executiva - FM 92,7",
    img: "https://lirp.cdn-website.com/4ef31d30/import/clib/…i/opt/radio-executiva-logo-light-500x253-184w.png",
    play: "https://live.ojc.com.br/c2f4/myStream.m3u8"
  },
  {
    id: 4,
    name: "MOOV - FM 101,7",
    img: "https://irp.cdn-website.com/21f330bf/dms3rep/multi/MOOV-fm-logo-neg-com-dial.svg",
    play: "https://live.ojc.com.br/e9cd_4/myStream.m3u8"
  },
  {
    id: 5,
    name: "JP FM - FM 100,9",
    img: "https://s.jpimg.com.br/wp-content/themes/jovempan/assets/build/images/logos-player/jpfm.jpg?v2",
    play: "https://stream-166.zeno.fm/c45wbq2us3buv?zs=MpVi9s2XQ5uWrPVwLI8A9w"
  },
  {
    id: 6,
    name: "Positiva - FM 99.1",
    img: "https://img.radios.com.br/radio/lg/radio14324_1641999364.png",
    play: "https://casthttps1.suaradionanet.net/13523/stream"
  },
  {
    id: 7,
    name: "Interativa - FM 94.9",
    img: "https://img.radios.com.br/radio/lg/radio13453_1700501278.png",
    play: "https://interativafm.net/a9465026-ee6e-4ea1-80db-8f98117b73ce"
  },
  {
    id: 8,
    name: "89FM Rádio Rock - FM 102.9",
    img: "https://img.radios.com.br/radio/lg/radio71627_1672312649.png",
    play: "https://ice.fabricahost.com.br/89aradiorockgo"
  },
  {
    id: 9,
    name: "Sucesso - FM 98.3",
    img: "https://img.radios.com.br/radio/lg/radio14717_1559323127.png",
    play: "http://cast61.sitehosting.com.br:8446/live?1707339019332"
  }
];

const styles = EStyleSheet.create({
  contentLeft: {
    flex: 1,
  },
  radioButton: {
    flexDirection: 'row', // Organiza a imagem e o texto horizontalmente
    alignItems: 'center', // Centraliza verticalmente os itens dentro do botão
    gap: 20,
    backgroundColor: THEME.COLORS.BACKGROUNDWHITE,
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  selectedButton: {
    borderColor: THEME.COLORS.BORDERSELECTED,
    borderWidth: 2,
  },
  radioImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  radioButtonText: {
    flexShrink: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: THEME.COLORS.TEXTHOME,
    textAlign: 'center'
  }
});