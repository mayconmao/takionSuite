import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import EStyleSheet from 'react-native-extended-stylesheet';

import { LayoutBase } from '../LayoutBase';
import { CustomTouchableOpacity } from '../../Components/CustomTouchableOpacity';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';

import THEME from '../../Theme';

export function TotalSpent() {
  const navigation = useNavigation();

  const [total, setTotal] = useState(0);

  useEffect(() => {
    // Calcula o total somando os valores anteriores
    const calculatedTotal = data.reduce((acc, item) => acc + item.accountValue, 0);
    setTotal(calculatedTotal);
  }, []);

  const getIconComponent = (iconName) => {
    switch (iconName) {
      case 'bed':
        return <MaterialIcons name="bed" size={30} color={THEME.COLORS.TEXTHOME} />;
      case 'kitchen':
        return <Ionicons name="fast-food-outline" size={30} color={THEME.COLORS.TEXTHOME} />;
      case 'gift':
        return <Octicons name="gift" size={30} color={THEME.COLORS.TEXTHOME} />;
      case 'refrigerator':
        return <MaterialIcons name="kitchen" size={30} color={THEME.COLORS.TEXTHOME} />;
      default:
        return null;
    }
  };

  const AccountCard = ({ id, iconName, accountName, accountValue }) => {
    return (
      <View style={styles.cardContainer} key={id}>
        {iconName && getIconComponent(iconName)}
        <Text style={styles.accountName}>{accountName}</Text>
        <Text style={styles.accountValue}>R$ {accountValue}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LayoutBase customStyle={styles.container}>
        <Header name="Conta" screen="Home" color={THEME.COLORS.TEXTHOME} />
        <View style={styles.content}>
          <View style={styles.contentCard}>
            {data.map(AccountCard)}
          </View>
          <View style={{ flexDirection: 'row', width: '80%', justifyContent: 'space-between', marginTop: '5%' }}>
            <View style={styles.cardContainer}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalValue}>{total.toFixed(2)}</Text>
            </View>
            <CustomTouchableOpacity style={styles.buttonOrder} onPress={() => navigation.navigate("Home")}>
              <Text style={styles.totalLabel}>Fechar</Text>
            </CustomTouchableOpacity>
          </View>
        </View>
      </LayoutBase>
    </View>
  );
};

function Header({ name, screen, color }) {
  const navigation = useNavigation();

  function handleGoBack() {
    navigation.navigate(screen);
  }
  return (
    <View style={styles.containerHeader}>
      <CustomTouchableOpacity style={styles.wrap} onPress={handleGoBack}>
        <Icon name="arrow-back-ios" color={color} size={50} />
      </CustomTouchableOpacity>
      <Text style={{ fontSize: 50, color: color }}>
        {name}
      </Text>
    </View>
  );
}

const data = [
  { id: 1, iconName: 'bed', accountName: 'Quarto', accountValue: 130.0 },
  { id: 2, iconName: 'kitchen', accountName: 'Cozinha', accountValue: 30.0 },
  { id: 3, iconName: 'gift', accountName: 'Loja', accountValue: 100.0 },
  { id: 4, iconName: 'refrigerator', accountName: 'Geladeira', accountValue: 70.0 },
];

const styles = EStyleSheet.create({
  container: {
    flex: 1,

  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    // width: '80%',
    // backgroundColor: 'tomato'
  },
  contentCard: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    // backgroundColor: 'tomato'
  },
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.COLORS.BACKGROUND,
    padding: 16,
    marginVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: THEME.COLORS.BORDERCOLORWHITE,
  },
  accountName: {
    flex: 1,
    marginLeft: 16,
    fontSize: 20,
    color: THEME.COLORS.TEXTHOME
  },
  accountValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: THEME.COLORS.TEXTHOME
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: THEME.COLORS.TEXTHOME,
  },
  totalValue: {
    fontSize: 18,
    marginLeft: 10,
    color: THEME.COLORS.TEXTHOME,
  },
  buttonOrder: {
    alignItems: 'center',
    width: '20%',
    backgroundColor: THEME.COLORS.BORDERCOLORTV,
    padding: 16,
    marginVertical: 4,
    borderRadius: 30,
  },
  containerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 10,
  },
});

