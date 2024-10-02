import React, { useState } from 'react';
import { View } from 'react-native';
import BleManager from 'react-native-ble-manager';
import { Buffer } from 'buffer';
import EStyleSheet from 'react-native-extended-stylesheet';

import { useBleContext } from '../../context/BleConnectionConextProvide';
import { LayoutBase } from '../LayoutBase';
// import { HeaderTop } from './Components/header';
import { Header } from '../../Components/Header';
import { ContentRight } from './Components/right';
import { ListMusic } from '../../Components/ListMusic';
import THEME from '../../Theme';

export function Radio() {
  const [selectedFrequency, setSelectedFrequency] = useState(null);

  const { peripheralId, characteristicUUID, serviceUUID } = useBleContext();

  const sendCommand = async (date) => {

    try {
      const buffer = Buffer.from(date);
      // console.log("service", peripheralId, serviceUUID, characteristicUUID,)

      // await BleManager.getMaximumWriteValueLengthForWithoutResponse(peripheralId).then((maxValue) => {
      //   console.log("Maximum length for WriteWithResponse: " + maxValue);
      // });

      await BleManager.write(
        peripheralId,
        serviceUUID,
        characteristicUUID,
        buffer.toJSON().data,
      );

      // console.log('Comando enviado com sucesso:', date);
    } catch (error) {
      console.error('Erro ao enviar comando:', error);
    }
  };

  const handleFrequencySelect = (frequency) => {
    setSelectedFrequency(frequency);
    // Adicione aqui qualquer lógica adicional que você precisa realizar quando a frequência é selecionada
  };


  return (
    <View style={styles.container}>
      <LayoutBase customStyle={styles.container}>
        <View style={{ marginTop: 10, paddingHorizontal: 15 }}>
          {/* <HeaderTop /> */}
          <Header name="Rádio" toBack="Som" color={THEME.COLORS.TEXTHOME} />
        </View>
        <View style={styles.contentContainer}>
          <ListMusic data={radioFrequencies} />
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
    margin: 10,
    gap: 15
  },
});

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
