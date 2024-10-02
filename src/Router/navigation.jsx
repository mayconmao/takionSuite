import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { useMusicContext } from '../context/MusicContext';

import THEME from '../Theme';

import { ConnectionScreen } from '../Screens/ConnectionScreen';
import { Home } from '../Screens/Home';
import { Lighting } from '../Screens/Lighting';
import { SmartTV } from '../Screens/SmartTV';
import { AirConditioning } from '../Screens/AirConditioning';
import { Som } from '../Screens/Som';
import { Radio } from '../Screens/Radio';
import { ListCategories } from '../Screens/Music/categories';
import { Library } from '../Screens/Music/library';
import { PlayMusics } from '../Screens/Music';
import { List } from '../Screens/Music/List';
import { Restaurant } from '../Screens/Shopping/Restaurant';
import { DetailScreen } from '../Screens/Shopping/Details';
import { MyCart } from '../Screens/Shopping/Cart';
import { TotalSpent } from '../Screens/TotalSpent';
import { Settings } from '../Screens/Settings';

const { Navigator, Screen } = createStackNavigator();
const TopTab = createMaterialTopTabNavigator();

export function Router() {
  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false, // Desabilita gestos, se necessário
        // cardStyleInterpolator: CardStyleInterpolators.forFadeFromBottomAndroid,
        cardStyleInterpolator: ({ current }) => ({
          cardStyle: {
            opacity: current.progress,
          },
          overlayStyle: {
            opacity: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.5], // Ajuste conforme necessário para o efeito desejado
            }),
          },
        }),
        cardStyle: {
          backgroundColor: THEME.COLORS.BLACK, // Isso remove o fundo branco
        },
      }}>
      <Screen name="Connection" component={ConnectionScreen} />
      <Screen name="Home" component={Home} />
      <Screen name="Lighting" component={Lighting} />
      <Screen name="SmartTV" component={SmartTV} />
      <Screen name="AirConditioning" component={AirConditioning} />
      <Screen name="Som" component={Som} />
      <Screen name="Radio" component={Radio} />
      <Screen name="PlayMusic" component={PlayMusics} />
      <Screen name="Restaurant" component={Restaurant} />
      <Screen name="Detail" component={DetailScreen} />
      <Screen name="Order" component={MyCart} />
      <Screen name="TotalSpent" component={TotalSpent} />
      <Screen name="Settings" component={Settings} />
    </Navigator>
  );
}


export function MyTopTabs() {
  const { queue } = useMusicContext();

  const initialRouteName = queue && queue.length > 0 ? "List" : "Library";

  return (
    <TopTab.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        tabBarLabelStyle: { fontSize: 15, margin: 0 },
        tabBarItemStyle: { width: 203 },
        tabBarActiveTintColor: THEME.COLORS.WHITE,
        tabBarInactiveTintColor: THEME.COLORS.GRAY3,
        tabBarStyle: { backgroundColor: THEME.COLORS.BACKGROUND, marginVertical: 10, borderRadius: 30, shadowColor: 'transparent' },
        tabBarScrollEnabled: true,
        tabBarPressColor: 'transparent',
        tabBarIndicatorStyle: {
          backgroundColor: THEME.COLORS.NAVIGATION_BUTTON,
          height: '100%',
          // top: 0,
          borderRadius: 30
        }
      }}

      sceneContainerStyle={{ backgroundColor: 'transparent' }}
    >
      <TopTab.Screen
        name="Library"
        component={Library}
        options={{ tabBarLabel: 'Estilos' }}
      />
      <TopTab.Screen
        name="Categories"
        component={ListCategories}
        options={{ tabBarLabel: 'Artistas' }}
      />
      <TopTab.Screen
        name="List"
        component={List}
        options={{ tabBarLabel: 'Músicas' }}
      />
    </TopTab.Navigator>
  );
}