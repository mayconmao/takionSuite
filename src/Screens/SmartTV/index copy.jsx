import React, { useState } from 'react';
import { View, Image, Text } from 'react-native';

import { LayoutBase } from '../LayoutBase';
import { Header } from '../../Components/Header';
import { CustomTouchableOpacity } from '../../Components/CustomTouchableOpacity';
import THEME from '../../Theme';

import EStyleSheet from 'react-native-extended-stylesheet';
import Icon from 'react-native-vector-icons/AntDesign';
import Fontisto from 'react-native-vector-icons/Fontisto';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import { ContentLeft } from './components/ContentLeft';
import { ContentRight } from './components/ContentRight';
import { ContentTop } from './components/ContentTop';

const baseString = "01004";
const commands = {
  LigaDesliga: "001000000000006",
  TV: "002000000000007",
  Home: "003000000000008",
  SetaCima: "010000000000015",
  Mute: "009000000000014",
  SetaEsquerda: "012000000000017",
  SetaDireita: "013000000000018",
  OK: "014000000000019",
  Voltar: "015000000000020",
  SetaBaixo: "011000000000016",
  Sair: "016000000000021",
  VolumeMais: "004000000000009",
  VolumeMenos: "005000000000010",
  CanalMais: "006000000000011",
  CanalMenos: "007000000000012",
  Entrada: "008000000000013",
  Rew: "017000000000022",
  Fwd: "018000000000023",
  Pausa: "019000000000024",
  Play: "020000000000025"
};

const HeaderTop = () => {
  const [activeStreamingButton, setActiveStreamingButton] = useState(null);

  const ButtonStreaming = ({ imagePath, buttonId }) => {
    const isOn = activeStreamingButton === buttonId;
    // handle streaming toggle button
    const handleToggle = () => {
      setActiveStreamingButton(isOn ? null : buttonId);
      const actions = {
        tv: () => commands.TV,
        Entrada: () => commands.Entrada,
      };

      const tec = actions[buttonId] ? actions[buttonId]() : null;

      if (tec) {
        try {
          // await sendCommand(baseString, tec); //chama afuncao para enviar o comando
          console.log("teste", `${baseString}${tec}`)
        } catch (error) {
          console.error('Erro ao enviar comando via Bluetooth:', error);
        }
      }
    };

    const powerControlStyle = {
      ...styles.buttonStreaming,
      ...(isOn && { borderColor: `${THEME.COLORS.BORDERSELECTED}`, borderWidth: 1 }),
    };

    return (
      <CustomTouchableOpacity onPress={handleToggle} style={powerControlStyle}>
        <Image source={imagePath} style={styles.image} />
      </CustomTouchableOpacity>
    );
  };

  return (
    <View style={styles.containerHeader}>
      <View style={styles.back}>
        <Header name="TV" toBack="Home" color={THEME.COLORS.TEXTHOME} />
      </View>

      <View style={styles.containerPower}>
        <CustomTouchableOpacity onPress={() => console.log("teste", `${baseString}${commands.Entrada}`)} style={styles.buttonStreaming}>
          <Material name="audio-input-rca" size={40} color={THEME.COLORS.TEXTHOME} />
          <Text style={styles.controlText}>Entradas</Text>
        </CustomTouchableOpacity>
        <View style={styles.containerStreaming}>
          <ButtonStreaming imagePath={require("../../assets/TV.png")} buttonId="tv" />
          <ButtonStreaming imagePath={require("../../assets/netflix.png")} buttonId="netflix" />
          <ButtonStreaming imagePath={require("../../assets/prime.png")} buttonId="prime" />
          <ButtonStreaming imagePath={require("../../assets/globoplay.png")} buttonId="globo" />
          <ButtonStreaming imagePath={require("../../assets/hbo.png")} buttonId="hbo" />
        </View>
      </View>
    </View>
  );
};

// const ContentLeft = () => {
//   const [selectedControl, setSelectedControl] = useState(null);
//   const [powerControlIsOn, setPowerControlIsOn] = useState(false);

//   const PowerControl = () => {
//     const handleToggle = () => {
//       try {
//         // await sendCommand(baseString, tec); //chama afuncao para enviar o comando
//         console.log("teste", `${baseString}${commands.LigaDesliga}`)
//       } catch (error) {
//         console.error('Erro ao enviar comando via Bluetooth:', error);
//       }
//     };

//     return (
//       <CustomTouchableOpacity onPress={handleToggle} style={styles.powerControl}>
//         <Fontisto name='power' size={40} color={THEME.COLORS.WHITE} />
//       </CustomTouchableOpacity>
//     );
//   };

//   const Volume = ({ name, buttonId }) => {
//     const [isOn, setIsOn] = useState(false);

//     const handleToggle = () => {
//       setIsOn(!isOn);
//       const actions = {
//         volumeMais: () => commands.VolumeMais,
//         volumeMenos: () => commands.VolumeMenos,
//         canalMais: () => commands.CanalMais,
//         canalMenos: () => commands.CanalMenos
//       };

//       const tec = actions[buttonId] ? actions[buttonId]() : null;

//       if (tec) {
//         try {
//           // await sendCommand(baseString, tec); //chama afuncao para enviar o comando
//           console.log("teste", `${baseString}${tec}`)
//         } catch (error) {
//           console.error('Erro ao enviar comando via Bluetooth:', error);
//         }
//       }
//     };

//     return (
//       <CustomTouchableOpacity onPress={handleToggle} style={styles.controlVolume}>
//         <FontAwesome5 name={name} size={35} color="white" />
//       </CustomTouchableOpacity>
//     );
//   };

//   const Control = ({ name, isSelected, onSelect, size }) => {
//     const handleToggle = () => {
//       onSelect(name);

//       const actions = {
//         volumeMais: () => commands.VolumeMais,
//         play: () => commands.Play,
//         pause: () => commands.Pausa,
//         backward: () => commands.Rew,
//         forward: () => commands.Fwd,
//       };

//       const tec = actions[name] ? actions[name]() : null;

//       if (tec) {
//         try {
//           // await sendCommand(baseString, tec); //chama afuncao para enviar o comando
//           console.log("teste", `${baseString} ${tec}`)
//         } catch (error) {
//           console.error('Erro ao enviar comando via Bluetooth:', error);
//         }
//       }
//     };

//     return (
//       <CustomTouchableOpacity onPress={handleToggle} style={styles.controlPlay}>
//         <FontAwesome5 name={name} size={size} color={THEME.COLORS.WHITE} />
//       </CustomTouchableOpacity>
//     );
//   };

//   return (
//     <View style={styles.contentLeft}>
//       <View style={{ flexDirection: 'row', marginTop: '5%', justifyContent: 'space-between', width: '80%', height: '60%' }} >
//         <View style={styles.viewVolume}>
//           <Volume name="plus" buttonId="volumeMais" />
//           <View style={styles.divider} />
//           <Volume name="minus" buttonId="volumeMenos" />
//         </View>
//         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '80%' }}>
//           <PowerControl />
//         </View>
//         <View style={styles.viewVolume}>
//           <Volume name="chevron-up" buttonId="canalMais" />
//           <View style={styles.divider} />
//           <Volume name="chevron-down" buttonId="canalMenos" />
//         </View>
//       </View>
//       <View style={styles.viewControl}>
//         <Control name="backward" size={30} isSelected={selectedControl === "backward"} onSelect={setSelectedControl} />
//         <Control name="play" size={30} isSelected={selectedControl === "play"} onSelect={setSelectedControl} />
//         <Control name="pause" size={30} isSelected={selectedControl === "pause"} onSelect={setSelectedControl} />
//         <Control name="forward" size={30} isSelected={selectedControl === "forward"} onSelect={setSelectedControl} />
//       </View>
//     </View>
//   );
// };


// const ContentRight = () => {
//   const handleArrowPress = (direction) => {
//     // Lógica para lidar com o pressionar das setas
//     const actions = {
//       tv: () => commands.TV,
//       home: () => commands.Home,
//       volumeMute: () => commands.Mute,
//       setaCima: () => commands.SetaCima,
//       setaEsquerda: () => commands.SetaEsquerda,
//       setaDireita: () => commands.SetaDireita,
//       setaBaixo: () => commands.SetaBaixo,
//       voltar: () => commands.Voltar,
//       sair: () => commands.Sair,
//     };

//     const tec = actions[direction] ? actions[direction]() : null;

//     if (tec) {
//       try {
//         // await sendCommand(baseString, tec); //chama afuncao para enviar o comando
//         // console.log("teste", `${baseString} ${tec}`)
//         console.log("teste", `${baseString}${tec}`)
//       } catch (error) {
//         console.error('Erro ao enviar comando via Bluetooth:', error);
//       }
//     }
//   };

//   const handleOkPress = () => {
//     // Lógica para lidar com o pressionar do botão "OK"
//     console.log("teste", `${baseString}${commands.OK}`)
//   };



//   return (
//     <View style={styles.contentRight}>
//       {/* Botões de seta */}
//       <View style={styles.arrowButtonsContainer}>
//         <View style={styles.rowUp}>
//           <CustomTouchableOpacity onPress={() => handleArrowPress('home')} style={styles.arrowButton}>
//             <Entypo name="home" size={40} color={THEME.COLORS.TEXTHOME} />
//           </CustomTouchableOpacity>
//           <CustomTouchableOpacity onPress={() => handleArrowPress('setaCima')} style={styles.arrowButton}>
//             <Icon name="up" size={50} color={THEME.COLORS.TEXTHOME} />
//           </CustomTouchableOpacity>
//           <CustomTouchableOpacity onPress={() => handleArrowPress('volumeMute')} style={styles.arrowButton}>
//             <Ionicons name="volume-mute" size={50} color={THEME.COLORS.TEXTHOME} />
//           </CustomTouchableOpacity>
//         </View>
//         <View style={styles.row}>
//           <CustomTouchableOpacity onPress={() => handleArrowPress('setaEsquerda')} style={styles.arrowButton}>
//             <Icon name="left" size={50} color={THEME.COLORS.TEXTHOME} />
//           </CustomTouchableOpacity>
//           <CustomTouchableOpacity onPress={() => handleOkPress()} style={styles.okButton}>
//             <Text style={styles.okButtonText}>OK</Text>
//           </CustomTouchableOpacity>
//           <CustomTouchableOpacity onPress={() => handleArrowPress('setaDireita')} style={styles.arrowButton}>
//             <Icon name="right" size={50} color={THEME.COLORS.TEXTHOME} />
//           </CustomTouchableOpacity>
//         </View>
//         <View style={styles.rowUp}>
//           <CustomTouchableOpacity onPress={() => handleArrowPress('voltar')} style={styles.arrowButton}>
//             <Entypo name="back" size={40} color={THEME.COLORS.TEXTHOME} />
//             <Text style={styles.controlText}>Voltar</Text>
//           </CustomTouchableOpacity>
//           <CustomTouchableOpacity onPress={() => handleArrowPress('setaBaixo')} style={styles.arrowButton}>
//             <Icon name="down" size={50} color={THEME.COLORS.TEXTHOME} />
//           </CustomTouchableOpacity>
//           <CustomTouchableOpacity onPress={() => handleArrowPress('sair')} style={styles.arrowButton}>
//             <FontAwesome5 name="door-open" size={35} color={THEME.COLORS.TEXTHOME} />
//             <Text style={styles.controlText}>Sair</Text>
//           </CustomTouchableOpacity>
//         </View>
//       </View>
//     </View>
//   );
// };

export function SmartTV() {
  return (
    <View style={styles.container}>
      <LayoutBase customStyle={styles.container}>
        <ContentTop />
        <View style={styles.contentContainer}>
          <ContentLeft />
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
    paddingHorizontal: 10,
    paddingTop: 10,
  },

  //Header
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

  //Content Left
  contentLeft: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'green'
  },
  viewVolume: {
    backgroundColor: THEME.COLORS.BACKGROUND,
    // backgroundColor: 'tomato',
    padding: 5,
    borderRadius: 50,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  divider: {
    height: 4, // Altura da linha de divisão
    width: '90%', // Largura da linha de divisão
    borderRadius: 20,
    backgroundColor: THEME.COLORS.BACKGROUNDWHITE,
  },
  controlVolume: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 75,
    height: 75,
    borderRadius: 200,
    // borderWidth: 1,
    backgroundColor: THEME.COLORS.BACKGROUNDWHITE,
    // borderColor: THEME.COLORS.BORDERCOLORWHITE,
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
  okButtonText: {
    color: 'white',
    fontSize: 35,
    textAlign: 'center',
  },
  controlText: {
    color: 'white',
    fontSize: 15,
    // textAlign: 'center',
  },
  control: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 80,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: THEME.COLORS.BACKGROUNDWHITE,
    borderColor: THEME.COLORS.BORDERCOLORWHITE,
  },
  controlPlay: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 70,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: THEME.COLORS.BACKGROUNDWHITE,
    borderColor: THEME.COLORS.BORDERCOLORWHITE,
  },

  //Content Right
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
  okButton: {
    borderRadius: 55,
    width: 110,  // Largura fixa
    height: 110,  // Altura fixa
    margin: 20,  // Espaçamento entre os botões
    backgroundColor: THEME.COLORS.BACKGROUNDWHITE,  // Altere para preto
    borderWidth: 2,  // Adicione a largura da borda
    borderColor: THEME.COLORS.BORDERCOLORWHITE,  // Adicione a cor da borda
    alignItems: 'center',
    justifyContent: 'center'
  },
  okButtonText: {
    color: 'white',
    fontSize: 35,
    textAlign: 'center',
    // padding: 10,
  },
  arrowButton: {
    width: 85,  // Largura fixa
    height: 85,  // Altura fixa
    margin: 5,  // Espaçamento entre os botões
    borderRadius: 10,
    backgroundColor: THEME.COLORS.BACKGROUNDWHITE,  // Altere para preto
    borderWidth: 2,  // Adicione a largura da borda
    borderColor: THEME.COLORS.BORDERCOLORWHITE,  // Adicione a cor da borda
    alignItems: 'center',
    justifyContent: 'center'
  },
});

// const MuteButton = ({ isMuted, setActiveMuteButton }) => {

//   const handleToggle = () => {
//     setActiveMuteButton((prev) => !prev);
//     console.log("botao selecionado")
//   };

//   const buttonStyle = {
//     ...styles.powerControl,
//     ...(isMuted && { borderColor: `${THEME.COLORS.BORDERSELECTED}`, borderWidth: 4 }),
//   };

//   return (
//     <CustomTouchableOpacity onPress={handleToggle} style={styles.muteControl}>
//       {isMuted ? (
//         <Octicons name="mute" size={30} color={THEME.COLORS.COMANDBUTTOFF} />
//       ) : (
//         <Octicons name="unmute" size={30} color="white" />
//       )}
//     </CustomTouchableOpacity>
//   );
// };
