import React, { useState } from 'react';
import { View, Text, Image, ToastAndroid, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import EStyleSheet from 'react-native-extended-stylesheet';

import { useCart } from '../../../context/Cart';
import { CustomTouchableOpacity } from '../../../Components/CustomTouchableOpacity';
import { Header } from '../../../Components/Header';
import { LayoutBase } from '../../LayoutBase';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons.js';
import data from '../server/data';
import THEME from '../../../Theme';


export function Restaurant() {
  const { cart, ordersInProgress } = useCart()
  const navigation = useNavigation();
  const [activeCategory, setActiveCategory] = useState(0);

  const handleDetails = item => {
    navigation.navigate('Detail', item);
  };

  const handleViewCart = () => {
    if (cart.length === 0 && ordersInProgress.length === 0) {
      // Mostra um Toast ao usuário se o carrinho estiver vazio
      ToastAndroid.show('Não há pedidos', ToastAndroid.SHORT);
    } else {
      // Navega para a tela 'Order' se o carrinho não estiver vazio
      navigation.navigate('Order');
    }
  };

  const CategorySelector = ({ categories, activeCategory, setActiveCategory }) => {
    const renderItem = ({ item, index }) => {
      const isActive = activeCategory === index;
      return (
        <CustomTouchableOpacity
          onPress={() => setActiveCategory(index)}
          style={[styles.buttonMenu, isActive && styles.activeButton]}
        >
          <Text style={[styles.buttonText, isActive && styles.activeButtonText]}>
            {item.title}
          </Text>
        </CustomTouchableOpacity>
      );
    };

    return (
      <View style={[styles.containerButton]}>
        <FlatList
          data={categories}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
        <CustomTouchableOpacity
          onPress={handleViewCart}
          style={[styles.buttonMenu]}
        >
          <MaterialIcons
            name="shopping-cart-checkout"
            size={20}
            color={THEME.COLORS.TEXTCOLOROFF}
          />
        </CustomTouchableOpacity>

      </View>
    );
  };

  // Calcula o número de itens vazios necessários para preencher a última linha
  const fillItemsCount = 3 - (data[activeCategory].recipes.length % 3);
  const filledData = [...data[activeCategory].recipes];

  // Adiciona itens vazios apenas se necessário
  if (fillItemsCount > 0 && fillItemsCount < 3) {
    for (let i = 0; i < fillItemsCount; i++) {
      filledData.push({ id: `empty-${i}`, isEmpty: true }); // Adiciona itens vazios com um identificador único
    }
  }

  const renderItem = ({ item }) => {
    if (item.isEmpty) {
      return <View style={[styles.touchable, styles.invisibleItem]} />;
    }
    return (
      <CustomTouchableOpacity
        style={[styles.touchable, {}]}
        onPress={() => handleDetails(item)}>
        <Image
          style={styles.image}
          source={item.image}
        />
        <View style={styles.information}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemName}>Today discount {item.discount}</Text>
          <Text style={styles.itemName}>
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            }).format(item.price)}
          </Text>
        </View>
      </CustomTouchableOpacity>
    )
  };



  return (
    <SafeAreaView style={styles.container}>
      <LayoutBase customStyle={styles.container} >
        <View style={styles.content}>
          <View style={styles.header}>
            <Header name="Shopping" toBack="Home" color={THEME.COLORS.WHITE} />
            <View style={{ justifyContent: 'center' }}>
              <View style={styles.scrollView}>
                <CategorySelector
                  categories={data}
                  activeCategory={activeCategory}
                  setActiveCategory={setActiveCategory}
                />
              </View>
            </View>
          </View>
          <FlatList
            data={filledData}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            numColumns={3}
          />
        </View>
      </LayoutBase>
    </SafeAreaView >
  );
}

export const styles = EStyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: colors.gray_600,
  },
  content: {
    flex: 1,
    paddingHorizontal: '1rem',
    paddingTop: '1rem',
    paddingBottom: '0.5rem',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  touchable: {
    flex: 1,
    margin: 4,
    aspectRatio: 1,
    maxHeight: 300,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  image: {
    width: '100%', // Ocupa toda a largura do card
    height: '100%', // Ocupa toda a altura do card
    borderRadius: 10, // Arredonda os cantos da imagem para combinar com o card
  },
  itemName: {
    color: '#434343',
    fontSize: 20,
    fontWeight: '600',
  },
  information: {
    position: 'absolute', // Posiciona a View de texto sobre a imagem
    bottom: 0, // Alinha a View de texto na parte inferior do card
    width: '100%', // Estende a View de texto para a largura total do card
    backgroundColor: 'rgba(255,255,255,0.6)', // Fundo semi-transparente para destacar o texto sobre a imagem
    padding: 10, // Espaçamento interno para o texto// Garante que a View ocupe toda a largura do card
    borderRadius: 10,
  },

  button: {
    borderRadius: 20,
    padding: 10,
  },

  invisibleItem: {
    backgroundColor: 'transparent', // Ou outra lógica de estilo para torná-lo "invisível"
  },

  ///
  containerButton: {
    flexDirection: 'row',
    gap: 40
  },
  listContainer: {
    gap: 15,
  },
  //menu
  scrollView: {
    padding: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: THEME.COLORS.BACKGROUND,
  },
  buttonMenu: {
    width: 90,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: THEME.COLORS.BACKGROUNDWHITE
  },
  activeButton: {
    borderWidth: 2,
    borderColor: THEME.COLORS.BORDERCOLORWHITE,
    backgroundColor: THEME.COLORS.NAVIGATION_BUTTON,
  },
  buttonText: {
    color: THEME.COLORS.TEXTCOLOROFF,
  },
  activeButtonText: {
    color: 'white',
    fontWeight: '700',
  },
});