import Octicons from 'react-native-vector-icons/Octicons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';

import { createIconSet } from 'react-native-vector-icons';

const glyphMap = {
  'air': 59648, // O valor é o caractere correspondente na sua fonte
  // Adicione mais ícones conforme necessário
};
const CustomIcon = createIconSet(glyphMap, 'icomoon');//arquivo da fonte em android/app/src/main/assets/fonts.

export const data = [
  {
    id: 1,
    name: 'Iluminação',
    color: '#EB87E7',
    hover: '#f5c3f3',
    screen: 'Lighting',
    icon: Octicons,
    iconName: 'light-bulb',
  },
  {
    id: 2,
    permit: '5',
    name: 'Ar Condicionado',
    color: '#9FCFFB',
    hover: '#c5e2fc',
    screen: 'AirConditioning',
    icon: CustomIcon,
    iconName: 'air',
  },
  {
    id: 3,
    permit: '4',
    name: 'TV',
    color: '#84D98A',
    hover: '#b5e8b8',
    screen: 'SmartTV',
    icon: FontAwesome5,
    iconName: 'tv',
  },
  {
    id:4,
    name: 'Som',
    screen: 'Som',
    icon: Fontisto,
    iconName: 'applemusic',
  },
  // {
  //   id:5,
  //   name: 'Música',
  //   color: '#CA5B3B',
  //   hover: '#df9c89',
  //   screen: 'PlayMusic',
  //   icon: Fontisto,
  //   iconName: 'applemusic',
  // },
  // {
  //   id: 6,
  //   name: 'Radio',
  //   color: '#6030C9',
  //   hover: '#BFACE9',
  //   screen: 'Radio',
  //   icon: MaterialIcons,
  //   iconName: 'radio',
  // },
  {
    id: 5,
    permit: '6',
    name: 'Pedidos',
    color: '#D9910D',
    hover: '#f5c68e',
    screen: 'Restaurant',
    icon: MaterialIcons,
    iconName: 'add-shopping-cart',
  },
  {
    id: 6,
    permit: '6',
    name: 'Conta',
    color: '#D9910D',
    hover: '#f5c68e',
    screen: 'TotalSpent',
    icon: Fontisto,
    iconName: 'wallet',
  },
  // {
  //   id: 7,
  //   permit: '7',
  //   name: 'Configuração',
  //   color: '#7B7B7B',
  //   hover: '#bdbdbd',
  //   screen: 'Settings',
  //   icon: Octicons,
  //   iconName: 'gear',
  // },
];
