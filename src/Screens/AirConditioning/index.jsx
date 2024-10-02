import React, { useState } from 'react';
import { View, Text } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

import { useControlsContext } from '../../context/ControlsContext';
import { CustomTouchableOpacity } from '../../Components/CustomTouchableOpacity';
import { LayoutBase } from '../LayoutBase';
import { Header } from '../../Components/Header';

import THEME from '../../Theme';
import Fontisto from 'react-native-vector-icons/Fontisto';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Aleta from '../../assets/aleta.svg';
import Air from '../../assets/frioQuente.svg';
// import { sendCommand } from '../../Utils/bluetoothUtils';
import { GenericButton } from '../../Components/GenericButton';
import { useBleContext } from '../../context/BleConnectionConextProvide';

const baseString = "01003";
const commands = {
  ligaDesliga: "001000000000005",
  alenta: "002000000000006",
  temperaturaMais: "003000000000007",
  temperaturaMenos: "004000000000008",
  quenteFrio: "005000000000009",
  velocidadeMais: "006000000000010",
  velocidadeMenos: "007000000000011",
};

const HeaderTop = () => {
  const [powerControlIsOn, setPowerControlIsOn] = useState(false);
  const { sendCommand } = useBleContext();

  const handlePress = (command) => {
    const cmd = `${baseString}${command}`
    sendCommand(cmd);
  };

  const PowerControl = () => {
    const handleToggle = () => {
      console.log("teste", `${baseString} ${commands.ligaDesliga}`)
    };

    const powerControlStyle = {
      ...styles.powerControl,
      ...(powerControlIsOn && {
        borderColor: THEME.COLORS.BORDERCOLORLIGHTING,
        borderWidth: 4,
      }),
    };

    return (
      <CustomTouchableOpacity
        onPress={handleToggle}
        style={styles.powerControl}
      >
        <Fontisto name="power" size={40} color={THEME.COLORS.WHITE} />
      </CustomTouchableOpacity>
    );
  };

  return (
    <View style={styles.containerHeader}>
      <View>
        <Header
          name="Ar Condicionado"
          toBack="Home"
          color={THEME.COLORS.TEXTHOME}
        />
      </View>
      <View style={styles.containerPower}>
        <GenericButton command={commands.ligaDesliga} onPress={handlePress}>
          <Fontisto name="power" size={40} color={THEME.COLORS.WHITE} />
        </GenericButton>
        <View style={styles.containerStreaming}>
          {/* <ButtonStreaming iconName="snow" />
          <ButtonStreaming iconName="fan" /> */}
          <GenericButton command={commands.quenteFrio} onPress={handlePress}>
            <Air name="snow" width={50} height={50} />
          </GenericButton>
          <GenericButton command={commands.alenta} onPress={handlePress}>
            <Aleta name="fan" width={46} height={46} />
          </GenericButton>
        </View>
      </View>
    </View>
  );
};

const ContentLeft = () => {
  const { sendCommand } = useBleContext();

  const BotaoComandos = ({ name, icon }) => {
    const { temperatura, velocidade, setTemperatura, setVelocidade } = useControlsContext();

    const handleToggle = async () => {

      // let tec;
      // if (name === 'temperaturaMais') {
      //   tec = commands.temperaturaMais;
      //   setTemperatura(prevTemperatura => prevTemperatura < 25 ? prevTemperatura + 1 : 25);
      // } else if (name === 'temperaturaMenos') {
      //   tec = commands.temperaturaMenos;
      //   setTemperatura(prevTemperatura => prevTemperatura > 16 ? prevTemperatura - 1 : 16);
      // } else if (name === 'velocidadeMais') {
      //   tec = commands.velocidadeMais;
      // } else if (name === 'velocidadeMenos') {
      //   tec = commands.velocidadeMenos;
      // }

      const actions = {
        temperaturaMais: () => {
          setTemperatura(prevTemperature => prevTemperature < 25 ? prevTemperature + 1 : 25);
          return commands.temperaturaMais;
        },
        temperaturaMenos: () => {
          setTemperatura(prevTemperature => prevTemperature > 16 ? prevTemperature - 1 : 16);
          return commands.temperaturaMenos;
        },
        velocidadeMais: () => {
          setVelocidade(prevVelocidade => prevVelocidade < 5 ? prevVelocidade + 1 : 5);
          return commands.velocidadeMais
        },
        velocidadeMenos: () => {
          setVelocidade(prevVelocidade => prevVelocidade > 1 ? prevVelocidade - 1 : 1);
          return commands.velocidadeMenos
        }
      };

      const tec = actions[name] ? actions[name]() : null;


      if (tec) {
        try {
          await sendCommand(`${baseString}${tec}`); //chama afuncao para enviar o comando
          // console.log("teste", `${baseString}${tec}`)
        } catch (error) {
          console.error('Erro ao enviar comando via Bluetooth:', error);
        }
      }
    };

    const isDisabled = () => {
      if (name === 'temperaturaMais' && temperatura >= 25) return true;
      if (name === 'temperaturaMenos' && temperatura <= 16) return true;
      if (name === 'velocidadeMais' && velocidade >= 5) return true;
      if (name === 'velocidadeMenos' && velocidade <= 1) return true;
      return false;
    };


    return (
      <CustomTouchableOpacity onPress={handleToggle} style={styles.control} disabled={isDisabled()}>
        <FontAwesome5 name={icon} size={40} color="white" />
      </CustomTouchableOpacity>
    );
  };

  return (
    <View style={styles.contentLeft}>
      <View style={styles.viewSideBar}>
        <View style={styles.viewControl}>
          <BotaoComandos name="temperaturaMais" icon="plus" />
          <Text style={styles.buttonText}>Temperatura</Text>
          <BotaoComandos name="temperaturaMenos" icon="minus" />
        </View>
        <View style={styles.viewControl}>
          <BotaoComandos name="velocidadeMais" icon="plus" />
          <Text style={styles.buttonText}>Velocidade</Text>
          <BotaoComandos name="velocidadeMenos" icon="minus" />
        </View>
      </View>
    </View>
  );
};

const VelocidadeIndicator = ({ velocidade }) => {
  const renderBars = () => {
    const barStyles = [
      styles.bar5, // Barra maior no topo
      styles.bar4,
      styles.bar3,
      styles.bar2,
      styles.bar1, // Barra menor na parte inferior
    ];

    return barStyles.map((barStyle, index) => (
      <View
        key={index}
        style={[
          styles.bar,
          barStyle,
          {
            opacity: index < 5 - velocidade ? 0.3 : 1, // Define a opacidade com base na velocidade
          },
        ]}
      />
    ));
  };

  return <View style={styles.container}>{renderBars()}</View>;
};

const ContentRight = () => {
  const { temperatura, velocidade } = useControlsContext();

  return (
    <View style={styles.contentRight}>
      <View style={[styles.temperature, {}]}>
        <Ionicons name="snow" size={80} color="white" />
        <View style={{ flexDirection: 'row', marginHorizontal: 20, alignItems: 'center' }}>
          <VelocidadeIndicator velocidade={velocidade} />
          <Text style={styles.temperatureText}>{temperatura}°c</Text>
        </View>
      </View>
    </View>
  );
};

export function AirConditioning() {
  return (
    <View style={styles.container}>
      <LayoutBase customStyle={styles.container}>
        <HeaderTop />
        <View style={styles.contentContainer}>
          <ContentLeft />
          <ContentRight icon="sun" size={80} />
        </View>

      </LayoutBase>
    </View>
  );
}

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
    paddingHorizontal: '3%',
    gap: 50,
  },
  containerPower: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 50,
    padding: 10,
    borderRadius: 10,
    backgroundColor: THEME.COLORS.BACKGROUND,
  },
  containerStreaming: {
    flexDirection: 'row',
    gap: 6,
  },
  powerControl: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 90,
    height: 90,
    borderRadius: 10,
    padding: 10,
    backgroundColor: THEME.COLORS.BACKGROUNDWHITE,
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
  },
  viewSideBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  viewControl: {
    alignItems: 'center',
    gap: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 25,
    textAlign: 'center',
  },
  control: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 90,
    height: 90,
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
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  temperature: {
    width: 270,
    height: 270,
    gap: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.COLORS.BACKGROUNDWHITE,
    borderColor: THEME.COLORS.BORDERCOLORWHITE,
    borderWidth: 1,
    borderRadius: 12,
  },
  temperatureText: {
    color: 'white',
    fontSize: 60,
    fontWeight: 'bold',
  },

  //velocidadeBar
  containerVelocidadeBar: {
    // flexDirection: 'column',
    // alignItems: 'center',
    // justifyContent: 'flex-end',
    // height: 100, // Altura do contêiner para manter as barras alinhadas
  },
  bar: {
    backgroundColor: 'white',
    marginVertical: 1,
    borderRadius: 2, // Bordas arredondadas
  },
  bar1: {
    width: 8,
    height: 10,
  },
  bar2: {
    width: 12,
    height: 10,
  },
  bar3: {
    width: 16,
    height: 10,
  },
  bar4: {
    width: 20,
    height: 10,
  },
  bar5: {
    width: 24,
    height: 10,
  },
});