import React, { useCallback, useEffect, useState } from 'react';
import { View, FlatList, Text, useWindowDimensions } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useSendCommand, useStartNotification, useStopNotifications } from '../../Utils/bluetoothUtils';

import { useBleContext } from '../../context/BleConnectionConextProvide';
import { Header } from '../../Components/Header';
import { CustomTouchableOpacity } from '../../Components/CustomTouchableOpacity';
import { LayoutBase } from '../LayoutBase';
import On from '../../assets/acessa.svg';
import Off from '../../assets/apagada.svg';
import THEME from '../../Theme';

// Função para gerar o comando de luz dinamicamente
const gerarComandoLuz = (id, estado, num) => {
  const base = "03005";
  const codigoBase = estado === 'ligada' ? "002" : "001"; // Código de comando para ligar ou desligar
  const numeroSequencial = estado === 'ligada'
    ? String(9 + id).padStart(3, '0')   // Inicia em 010 para "ligada"
    : String(8 + id).padStart(3, '0');  // Inicia em 009 para "desligada"

  return `${base}${num}${codigoBase}000000${numeroSequencial}`;
};

export function Lighting() {
  const [isConnected, setIsConnected] = useState(false);
  const { sendCommand } = useBleContext();

  const { width } = useWindowDimensions();
  const MARGIN = 10; // Margem ao redor de cada botão
  const MAX_BUTTON_WIDTH = 160; // Largura máxima para cada botão
  const buttonWidth = Math.min((width - MARGIN * 5) / 4, MAX_BUTTON_WIDTH);
  const buttonHeight = buttonWidth; // Mantenha o botão quadrado, ajustando a altura para ser igual à largura calculada.



  function CardRendering({ title, id, num }) {

    const [isOpen, setIsOpen] = useState(false);

    const toggleLight = async () => {
      const newIsOpen = !isOpen; // Alterna o estado da luz
      const command = gerarComandoLuz(id, newIsOpen ? 'ligada' : 'desligada', num); // Gera o comando correspondente

      try {
        setIsOpen(newIsOpen); // Atualiza o estado antes de enviar o comando
        await sendCommand(command, "LUZINFO"); // Tenta enviar o comando
        // console.log(command)
      } catch (error) {
        console.error('Erro ao enviar comando:', error); // Loga o erro no console

        // Reverte o estado se houver um erro
        setIsOpen(!newIsOpen);
      }
    };

    return (
      <CustomTouchableOpacity
        onPress={toggleLight}
        style={[styles.button, {
          width: buttonWidth,
          height: buttonHeight,
          backgroundColor: isOpen ? THEME.COLORS.LIGHTINGONBUTTON : THEME.COLORS.BACKGROUNDWHITE,
          // transform: [{ scale: isOpen ? 0.96 : 1 }],
        }]}>
        <Text style={{ fontSize: 15, color: THEME.COLORS.TEXTHOME, fontWeight: 'bold' }}>
          {title}
        </Text>
        {isOpen ? (
          <On fill={THEME.COLORS.COLORLIGHTINGON} width={80} height={80} />
        ) : (
          <Off fill={THEME.COLORS.COLORLIGHTINGOFF} width={80} height={80} />
        )}

      </CustomTouchableOpacity>
    );
  }

  const renderItem = useCallback(({ item }) => <CardRendering {...item} />, []);
  const keyExtractor = useCallback(item => String(item.id), []);

  return (
    <SafeAreaView style={styles.container}>
      <LayoutBase customStyle={styles.container}>
        <View style={{ marginVertical: 15, paddingHorizontal: 15 }}>
          <Header name="Iluminação" toBack="Home" color={THEME.COLORS.TEXTHOME} />
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.contentContainer}>
            <FlatList
              data={data}
              renderItem={renderItem}
              keyExtractor={keyExtractor}
              showsVerticalScrollIndicator={false}
              numColumns={4}
            />
          </View>
        </View>
      </LayoutBase>
    </SafeAreaView >
  );
}


export const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.COLORS.BACKGROUND,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: '1rem',
  },
  button: {
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    borderColor: THEME.COLORS.BORDERCOLORWHITE,
    gap: 15
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
});

export const data = [
  {
    id: 1,
    title: 'Liga Luz 1',
    num: '000'
  },
  {
    id: 2,
    title: 'Liga Luz 2',
    num: '001'
  },
  {
    id: 3,
    title: 'Liga Luz 3',
    num: '002'
  },
  {
    id: 4,
    title: 'Liga Luz 4',
    num: '003'
  },
  {
    id: 5,
    title: 'Liga Luz 5',
    num: '004'
  },
];