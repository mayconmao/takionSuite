import React from 'react';
import { Dimensions, ImageBackground, ScrollView, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useCart } from '../../../context/Cart';
import { CustomTouchableOpacity } from '../../../Components/CustomTouchableOpacity';
import { OrderButton } from '../Components/OrderButton';
import Ionicons from 'react-native-vector-icons/Ionicons.js';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons.js';
import THEME from '../../../Theme';

const { height } = Dimensions.get('window');
const SPACING = 10;

export const DetailScreen = ({ route }) => {
  const recipe = route.params;
  const { addItemCart } = useCart();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  function handleToBack() {
    navigation.navigate('Restaurant');
  }

  function handleOrdersScreen() {
    addItemCart(recipe);
    navigation.navigate('Order');
  }

  return (
    <View style={{ flex: 1, backgroundColor: THEME.COLORS.PHANTOMWITE }}>
      <ImageBackground
        style={{
          padding: SPACING * 2,
          height: height / 2.3,
          paddingTop: SPACING * 4,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
        source={recipe.image}>
        <CustomTouchableOpacity
          onPress={handleToBack}
          style={{
            height: SPACING * 4.5,
            width: SPACING * 4.5,
            backgroundColor: THEME.COLORS.PHANTOMWITE,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: SPACING * 2.5,
          }}>
          <MaterialIcons
            name="arrow-back-ios"
            size={25}
            color={THEME.COLORS.GRAY}
            style={{ paddingLeft: 10 }}
          />
        </CustomTouchableOpacity>
      </ImageBackground>
      <View style={[styles.containerDetails, { marginBottom: insets.bottom }]}>
        <View
          style={{
            flexDirection: 'row',
            // marginBottom: SPACING,
            alignItems: 'center',
          }}>
          <View style={{ width: '70%' }}>
            <Text
              style={{
                fontSize: SPACING * 3,
                color: THEME.COLORS.DARK,
                fontWeight: '700',
              }}>
              {recipe.name}
            </Text>
          </View>
          {recipe.time ? (
            <View
              key={recipe.id}
              style={{
                padding: 10,
                paddingHorizontal: 20,
                backgroundColor: THEME.COLORS.YELLOW,
                flexDirection: 'row',
                borderRadius: SPACING,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Ionicons
                name="time"
                color={THEME.COLORS.GRAY6}
                size={20}
              />
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  marginLeft: SPACING / 2,
                  color: THEME.COLORS.GRAY6,
                }}>
                {recipe.time}
              </Text>
            </View>
          ) : null}
        </View>
        <OrderButton
          style={{ marginVertical: 20 }}
          onPress={handleOrdersScreen}
          title={`Pedir agora`}
          value={new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(recipe.price)}
        />

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.ingredients}>
            {recipe.ingredients ? (
              <Text style={styles.textIngredients}>Ingredientes</Text>
            ) : null}
            {recipe.ingredients
              ? recipe.ingredients.map(ingredient => (
                <View
                  style={{
                    paddingVertical: 3,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                  key={ingredient.id}>
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      backgroundColor: 'tomato',
                      borderRadius: 10,
                    }}
                  />
                  <Text
                    style={{
                      fontSize: 17,
                      fontWeight: '600',
                      color: THEME.COLORS.GRAY,
                      marginLeft: 10,
                    }}>
                    {ingredient.title}
                  </Text>
                </View>
              ))
              : null}
            <Text style={styles.textIngredients}>Descrição</Text>
            <Text style={styles.textDescription}>{recipe.description}</Text>
          </View>
        </ScrollView>
      </View>
    </View >
  );
};

export const styles = EStyleSheet.create({
  containerDetails: {
    flex: 1,
    paddingHorizontal: '1rem',
    paddingVertical: '1rem',
    marginTop: '-2rem',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: THEME.COLORS.PHANTOMWITE,
  },
  wrapButton: {
    paddingVertical: '0.9375rem',
  },
  button: {
    width: '100%',
    padding: 10,
    backgroundColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
  ingredients: {},
  textIngredients: {
    paddingBottom: '0.3125rem',
    fontSize: '1.3rem',
    fontWeight: '700',
    color: THEME.COLORS.DARK,
  },
  textDescription: {
    fontSize: '0.9375rem',
    fontWeight: '500',
    color: THEME.COLORS.GRAY,
  },
});
