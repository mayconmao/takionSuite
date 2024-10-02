import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useMusicContext } from '../../context/MusicContext';
import { CustomTouchableOpacity } from '../../Components/CustomTouchableOpacity';
import img from '../../assets/teste.png';
import Paradas from '../../assets/paradas.svg';
import Sertanejo from '../../assets/sertanejo.svg';
import Mpb from '../../assets/mpb.svg';
import Rock from '../../assets/rock.svg';
import Brazil from '../../assets/brazil.svg';
import Pagode from '../../assets/pagode.svg';
import Hiphop from '../../assets/hiphop.svg';
import DJ from '../../assets/dj.svg';
import Pop from '../../assets/pop.svg';
import Love from '../../assets/love.svg';
import Decadas from '../../assets/decadas.svg';
import Lancamentos from '../../assets/lancamentos.svg';
import Alta from '../../assets/alta.svg';
import Dance from '../../assets/dance.svg';
import Latina from '../../assets/latina.svg';
import Kpop from '../../assets/kpop.svg';
import Singles from '../../assets/singles.svg';

export const Library = () => {
  const navigation = useNavigation();
  const { handleCategories } = useMusicContext();
  const [listCategories, setListCategories] = useState([]);

  useEffect(() => {
    setListCategories(categories);
  }, [categories]);

  const handlePressPlayCategoties = (itemId) => {
    handleCategories(itemId)
    navigation.navigate('Categories');
  };

  // const handlePressPlay = () => {
  //   navigation.navigate('');
  // };

  // function handleGoBack() {
  //   navigation.navigate('Home');
  // };

  // useMemo para adicionar um componente espaçador se necessário, de maneira imutável
  const modifiedListCategories = useMemo(() => {
    // Verifica se o número total de itens é ímpar e adiciona um espaçador se necessário
    const isOdd = listCategories.length % 2 !== 0;
    return isOdd ? [...listCategories, { isSpacer: true, id: 'spacer' }] : listCategories;
  }, [listCategories]);

  const renderItem = useCallback(({ item, index }) => (
    <CardRendering key={item.id} name={item.name} icon={item.icon} index={index} isSpacer={item.isSpacer} onPress={handlePressPlayCategoties} />
  ), [handlePressPlayCategoties]);

  const keyExtractor = useCallback(item => String(item.id), []);

  return (
    <View style={styles.container}>
      <View style={styles.wrap}>
        <FlatList
          data={modifiedListCategories}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          numColumns={2}
        />
      </View>
    </View>

  );
};

const CardRendering = ({ name, onPress, index, isSpacer, icon }) => {
  const navigation = useNavigation();

  // Verifica se o item é o espaçador
  if (isSpacer) {
    // Retorna um componente vazio ou com um estilo específico
    return <CustomTouchableOpacity style={[styles.item, styles.itemSpacer]} />;
  };

  const IconComponent = icon;

  return (
    <CustomTouchableOpacity style={styles.item} onPress={() => onPress(name)}>
      <Image
        source={img}
        style={styles.itemImage}
      />
      <IconComponent width={90} height={90} />
      <Text style={styles.itemText}>{name}</Text>
    </CustomTouchableOpacity>
  )
};

const categories = [
  {
    href: "https://api.spotify.com/v1/browse/categories/0JQ5DAqbMKFJCTDO6ndZMP",
    icon: Sertanejo,
    id: "1",
    name: "Sertanejo"
  },
  {
    href: "https://api.spotify.com/v1/browse/categories/0JQ5DAqbMKFHCaWrPJOoNF",
    icon: Mpb,
    id: "2",
    name: "MPB"
  },
  {
    href: "https://api.spotify.com/v1/browse/categories/0JQ5DAqbMKFDXXwE9BDJAr",
    icon: Rock,
    id: "3",
    name: "Rock"
  },
  {
    href: "https://api.spotify.com/v1/browse/categories/0JQ5DAqbMKFJCTDO6ndZMP",
    icon: Sertanejo,
    id: "4",
    name: "Forro"
  },
  {
    icon: Paradas,
    id: "5",
    name: "Internacional"
  },
]

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#000',
  },
  wrap: {
    flex: 1,
    // margin: 20,
  },
  played: {
    height: '35%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 10,
  },
  header: {
    alignItems: 'flex-start',
    height: '100%',
    width: '10%',
    justifyContent: 'center',
    paddingLeft: 10,
  },
  buttonPlayed: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  headerIcon: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    gap: 200,
  },
  headerText: {
    color: '#FFF',
    fontSize: 40,
    textAlign: 'center',
  },
  item: {
    flex: 1,
    margin: 5,
    height: 180,
    justifyContent: 'flex-end',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: 10,
  },
  itemImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  itemText: {
    color: '#FFF',
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});