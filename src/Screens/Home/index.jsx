import React, { useCallback } from 'react';
import { View, FlatList, Dimensions, Text, Button } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { useSocketContext } from '../../context/SocketClient';
import { LayoutBase } from '../LayoutBase';
import { SideBar } from '../../Components/SideBar';
import { ButtonCard } from '../../Components/ButtonCard';
import { data } from './data';
import THEME from '../../Theme';

export function Home() {
  const { socket, status, messages } = useSocketContext();
  const renderItem = useCallback(({ item, index }) => (<CardRendering {...item} index={index} />), []);
  const keyExtractor = useCallback(item => String(item.id), []);

  const { height } = Dimensions.get('window');
  const renderSpacer = () => <View style={{ height: (height - 110 * data.length) / 2 }}></View>;

  return (
    <SafeAreaView style={styles.container}>
      <LayoutBase customStyle={styles.container}>
        <View style={styles.viewSideBar}>
          <SideBar title="Seja Bem Vindo" name="Suite Master" />
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ padding: 15 }}>
            <Text style={{ color: "#fff", fontSize: 20 }}>Status: {status}</Text>
            <Text style={{ color: "#fff", fontSize: 20 }}>mensagem: {messages}</Text>
          </View>
          <View style={styles.containerFlatList}>
            <View style={styles.viewFlatList}>
              <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                showsVerticalScrollIndicator={false}
                numColumns={3}
                ListHeaderComponent={renderSpacer}
              />
            </View>
          </View>
        </View>
      </LayoutBase>
    </SafeAreaView>
  );
};

function CardRendering({ color, icon, iconName, name, hover, screen, index }) {
  const navigation = useNavigation();

  const handleButtonPress = () => {
    navigation.navigate(screen);
  };

  return (
    <ButtonCard
      onPress={handleButtonPress}
      name={name}
      borderColor={THEME.COLORS.BORDERCOLORADIO}
      icon={icon}
      iconName={iconName}
      screen={screen}
    />
  );
}

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  viewSideBar: {
    alignItems: 'flex-start',
  },
  containerFlatList: {
    flex: 1,
    justifyContent: 'center',
  },
  viewFlatList: {
    alignItems: 'center',
  }
});


