import React from 'react';
import { TouchableOpacity } from 'react-native';
// import { useScreenSaver } from '../../context/ScreenSaverContext';

// O CustomTouchableOpacity garante que a lógica de reset do temporizador de inatividade seja sempre 
// executada quando o componente é pressionado.
export const CustomTouchableOpacity = ({ onPress, ...props }) => {
  // Uso do hook useScreenSaver para obter a função resetInactivityTimer,
  // que é usada para resetar o temporizador de inatividade quando o componente é pressionado.
  // const { resetInactivityTimer } = useScreenSaver();

  // Definição de handlePress, uma função que será chamada quando o TouchableOpacity for pressionado.
  // Esta função verifica se a prop 'onPress' foi fornecida e, em caso afirmativo, chama essa função.
  // Após chamar 'onPress', ela chama resetInactivityTimer para resetar o temporizador de inatividade.
  const handlePress = (e) => {
    if (onPress) {
      onPress(e);
    }
    // resetInactivityTimer();
  };

  // Renderização do componente TouchableOpacity, passando todas as props recebidas
  // pelo CustomTouchableOpacity, substituindo a prop 'onPress' pela função handlePress definida acima.
  return <TouchableOpacity {...props} onPress={handlePress} />;
};