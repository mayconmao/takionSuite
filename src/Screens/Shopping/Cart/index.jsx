import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useNavigation } from '@react-navigation/native';
import uuid from 'react-native-uuid';

import { useSocketContext } from '../../../context/SocketClient';
import { useCart } from '../../../context/Cart';
import { CustomTouchableOpacity } from '../../../Components/CustomTouchableOpacity';
import { ModalButton } from '../Components/ModalButton';
import { Header } from '../../../Components/Header';
import Entypo from 'react-native-vector-icons/Entypo.js';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons.js';
import Icon from 'react-native-vector-icons/FontAwesome.js';

import THEME from '../../../Theme';

export const MyCart = () => {
  const { sendMessage } = useSocketContext();
  const { cart, clearCart, removeItemCart, increaseItem, decreaseItem, total, ordersInProgress, addOrdersInProgress } = useCart();
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);

  console.log("carrinho", cart)

  useEffect(() => {
    let timer;
    if (modalVisible) {
      timer = setTimeout(() => {
        setModalVisible(false); // Fecha o modal após 3 segundos

      }, 3000);
    }

    return () => clearTimeout(timer); // Limpa o temporizador
  }, [modalVisible]);

  const pedido = {
    id: 1,
    pedido: "A380",
    room: "1",
    status: "Esperando",
    items: [
      { id: 1, code: "1", item: "Cheeseburg", info: "sem maionese e mostarda sem maionese e mostarda sem maionese e mostarda", qtd: "101" },
      { id: 2, code: "23", item: "Frago Frito", info: "caldo de galinhya especial", qtd: "1" },
      { id: 3, code: "432", item: "Batata Frita com Bacon", info: "com queijo", qtd: "1" },
      { id: 4, code: "2433", item: "drink soda", info: "", qtd: "2" },
      { id: 5, code: "43153", item: "suco de goiaba", info: "", qtd: "1" },
    ]
  }
  const showModal = () => {
    const newId = uuid.v4();
    const currentDateTime = new Date().toISOString();

    const updatedPedido = {
      ...pedido,
      id: newId,
      dateTime: currentDateTime //o servidor vai lidar com a data 
    };

    addOrdersInProgress(cart);
    setModalVisible(true);
    clearCart();
    sendMessage(updatedPedido);
    // sendMessage(pedido);
  };



  const onClose = () => {
    setModalVisible(false); // Fecha o modal
  };

  function handleGoBack() {
    navigation.navigate('Restaurant');
  }

  //remove data from Cart
  const removeItemFromCart = async id => {
    removeItemCart(id);
  };

  const RenderProducts = ({ data }) => {
    return (
      <View
        key={data.key}
        style={{
          width: '100%',
          height: 100,
          marginVertical: 6,
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: THEME.COLORS.GRAY5,
          borderRadius: 10,
        }}>
        <View
          style={{
            width: '30%',
            height: 100,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
            marginRight: 22,
          }}>
          <Image
            source={data.image}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: 10,
            }}
          />
        </View>
        <View
          style={{
            flex: 1,
            height: '100%',
            justifyContent: 'space-around',
          }}>
          <View style={{}}>
            <Text
              style={{
                fontSize: 14,
                maxWidth: '100%',
                color: THEME.COLORS.GRAY6,
                fontWeight: '600',
                letterSpacing: 1,
              }}>
              {data.name}
            </Text>
            <View
              style={{
                marginTop: 4,
                flexDirection: 'row',
                alignItems: 'center',
                opacity: 0.6,
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '400',
                  maxWidth: '85%',
                  marginRight: 4,
                }}>
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(data.price)}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '400',
                  maxWidth: '85%',
                  marginRight: 4,
                }}>
                Total:{' '}
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }).format(data.amount * data.price)}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <CustomTouchableOpacity
                onPress={() => decreaseItem(data)}
                style={{
                  borderRadius: 100,
                  marginRight: 20,
                  padding: 4,
                  borderWidth: 1,
                  borderColor: THEME.COLORS.GRAY6,
                  opacity: 0.5,
                }}>
                <MaterialCommunityIcons
                  name="minus"
                  style={{
                    fontSize: 16,
                    color: THEME.COLORS.GRAY6,
                  }}
                />
              </CustomTouchableOpacity>
              <Text>{data.amount}</Text>
              <CustomTouchableOpacity
                onPress={() => increaseItem(data)}
                style={{
                  borderRadius: 100,
                  marginLeft: 20,
                  padding: 4,
                  borderWidth: 1,
                  borderColor: THEME.COLORS.GRAY6,
                  opacity: 0.5,
                }}>
                <MaterialCommunityIcons
                  name="plus"
                  style={{
                    fontSize: 16,
                    color: THEME.COLORS.GRAY6,
                  }}
                />
              </CustomTouchableOpacity>
            </View>
            <CustomTouchableOpacity style={{
              backgroundColor: THEME.COLORS.GRAY4,
              padding: 8,
              borderRadius: 100,
              marginRight: 5
            }} onPress={() => removeItemFromCart(data.id)}>
              <MaterialCommunityIcons
                name="delete-outline"
                size={20}
                color={THEME.COLORS.GRAY}
              />
            </CustomTouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const NotRequested = () => {
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <Entypo name="emoji-happy" size={50} color={THEME.COLORS.TOMATO} />
        <CustomTouchableOpacity onPress={handleGoBack}>
          <Text style={{ color: `${THEME.COLORS.NAVIGATION_BUTTON}`, fontSize: 20 }}>
            Continue comprando
          </Text>
        </CustomTouchableOpacity>
      </View>
    );
  };

  if (cart.length === 0 && ordersInProgress.length === 0) {
    return <ErrorComponent screen="Restaurant" />
  }

  return (
    <SafeAreaView style={styles.container}>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingVertical: 10,
          // backgroundColor: 'tomato'
        }}>
        <Header
          name="Meus Pedidos"
          toBack="Restaurant"
          color={THEME.COLORS.GRAY6}
          ink={THEME.COLORS.GRAY6}
          pressed={THEME.COLORS.GRAY5}
        />
        {/* <Text style={styles.myOder}>Meus Pedidos</Text> */}
        {ordersInProgress && ordersInProgress.length > 0 && (
          <CustomTouchableOpacity style={styles.ordersInProgress} onPress={() => { }}>
            <Text style={styles.shoppingText}>Pedidos em andamanto</Text>
          </CustomTouchableOpacity>
        )}
        <CustomTouchableOpacity style={styles.keepShopping} onPress={handleGoBack}>
          <Text style={styles.shoppingText}>Continue Comprando</Text>
        </CustomTouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            paddingHorizontal: 16,
          }}>
          {cart && Object.keys(cart).length === 0 ? (
            <NotRequested />
          ) : (
            cart.map(item => <RenderProducts data={item} key={item.id} />)
          )}
        </View>
      </ScrollView>
      <View style={styles.total}>
        <Text style={styles.totalText}>Total</Text>
        <Text style={[styles.totalText, { color: THEME.COLORS.TOMATO }]}>
          {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(total)}
        </Text>
      </View>
      <ModalButton
        style={{ marginVertical: 20 }}
        onPress={showModal}
        title={`Pedir agora`}
        value={new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(total)}
      />
      {/* Substituído pela lógica correta de renderização do Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={onClose}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Icon name='check-square-o' size={60} color={THEME.COLORS.BORDERSELECTED} />
            <Text style={styles.modalText}>Seu Pedido foi enviado com Sucesso</Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export const ErrorComponent = ({ screen }) => {
  const navigation = useNavigation();

  function handleGoBack() {
    navigation.navigate(screen);
  }

  return (
    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: '#000' }
    }>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Image
          source={require('../../../assets/error.png')}
          style={styles.img}
          resizeMode="contain"
        />
      </View>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#fff', fontSize: 40 }}>Ainda não há pedidos!!</Text>
        <Text style={{ color: '#fff', fontSize: 20 }}>Aperte o Botõe abaixo para ir ao Shopping</Text>
        <CustomTouchableOpacity onPress={handleGoBack} style={styles.control}>
          <Text style={{ color: '#fff', fontSize: 20 }}>Shopping</Text>
        </CustomTouchableOpacity>
      </View>
    </View>
  )
};

export const styles = EStyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
    // backgroundColor: "tomato",
    backgroundColor: THEME.COLORS.PHANTOMWITE,
  },
  myOder: {
    fontSize: '1.25rem',
    fontWeight: '500',
    color: THEME.COLORS.BLACK,
  },
  keepShopping: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: THEME.COLORS.COLORLIGHTINGON,
  },
  ordersInProgress: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: THEME.COLORS.BORDERSELECTED,
  },
  shoppingText: {
    fontSize: '0.8rem',
    color: THEME.COLORS.DARK,
  },
  total: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: '0.625rem',
  },
  totalText: {
    fontSize: '1.875rem',
    fontWeight: '400',
    color: THEME.COLORS.DARK,
  },

  control: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    padding: 20,
    borderRadius: 20,
    backgroundColor: THEME.COLORS.BLUE,
    marginTop: 20
  },
  img: {
    //   width: 200,
    //   height: 200
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)"
  },
  modalView: {
    margin: 20,
    backgroundColor: "#f1f7e2",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    marginBottom: 20,
    textAlign: "center",
    fontSize: 20
  }
});
