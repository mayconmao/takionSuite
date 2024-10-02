import React, { createContext, useContext, useEffect, useState } from 'react';
import { Platform, Alert } from 'react-native';
import { requestMultiple, PERMISSIONS, RESULTS } from 'react-native-permissions';

/**
 * @typedef {Object} PermissionsStatus
 * @property {string} bluetoothScan - Status da permissão de escaneamento Bluetooth.
 * @property {string} bluetoothConnect - Status da permissão de conexão Bluetooth.
 * @property {string} fineLocation - Status da permissão de localização precisa.
 * @property {string} manageExternalStorage - Status da permissão de gerenciamento de armazenamento.
 * @property {string} accessMediaLocation - Status da permissão de acesso à localização de mídia.
 * @property {string} readMediaAudio - Status da permissão de leitura de mídia de áudio.
 * @property {string} readMediaImages - Status da permissão de leitura de imagens.
 */

const PermissionsContext = createContext();

/**
 * Hook para acessar o contexto de permissões.
 * @returns {{permissionsStatus: PermissionsStatus, requestAndroidPermissions: () => Promise<void>}} - Retorna o status atual das permissões e a função para solicitar permissões.
 */
export const usePermissions = () => useContext(PermissionsContext);

/**
 * Componente provedor que envolve a aplicação e gerencia o status das permissões.
 * Solicita permissões automaticamente ao iniciar no Android.
 * @param {Object} props
 * @param {React.ReactNode} props.children - Elementos filhos que receberão o contexto de permissões.
 * @returns {JSX.Element} O provedor de contexto de permissões.
 */
export const PermissionsProvider = ({ children }) => {
  const [permissionsStatus, setPermissionsStatus] = useState({
    bluetoothScan: RESULTS.UNAVAILABLE,
    bluetoothConnect: RESULTS.UNAVAILABLE,
    fineLocation: RESULTS.UNAVAILABLE,
    manageExternalStorage: RESULTS.UNAVAILABLE,
    accessMediaLocation: RESULTS.UNAVAILABLE,
    readMediaAudio: RESULTS.UNAVAILABLE,
    readMediaImages: RESULTS.UNAVAILABLE,
  });

  /**
   * Atualiza o estado com o resultado das permissões solicitadas.
   * @param {Object} result - Objeto contendo o status de cada permissão.
   */
  const handlePermissionResult = (result) => {
    setPermissionsStatus({
      bluetoothScan: result[PERMISSIONS.ANDROID.BLUETOOTH_SCAN] || RESULTS.UNAVAILABLE,
      bluetoothConnect: result[PERMISSIONS.ANDROID.BLUETOOTH_CONNECT] || RESULTS.UNAVAILABLE,
      fineLocation: result[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION] || RESULTS.UNAVAILABLE,
      manageExternalStorage: result[PERMISSIONS.ANDROID.MANAGE_EXTERNAL_STORAGE] || RESULTS.UNAVAILABLE,
      accessMediaLocation: result[PERMISSIONS.ANDROID.ACCESS_MEDIA_LOCATION] || RESULTS.UNAVAILABLE,
      readMediaAudio: result[PERMISSIONS.ANDROID.READ_MEDIA_AUDIO] || RESULTS.UNAVAILABLE,
      readMediaImages: result[PERMISSIONS.ANDROID.READ_MEDIA_IMAGES] || RESULTS.UNAVAILABLE,
    });
  };

  /**
   * Solicita permissões específicas no Android, com base na versão do sistema.
   * Exibe um alerta caso permissões críticas sejam negadas.
   * @async
   * @returns {Promise<void>}
   */
  const requestAndroidPermissions = async () => {
    // Definindo permissões a serem solicitadas com base na versão do Android
    const permissionsToRequest = [
      ...(Platform.Version >= 31 ? [
        PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
        PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
        PERMISSIONS.ANDROID.ACCESS_MEDIA_LOCATION,
        PERMISSIONS.ANDROID.READ_MEDIA_AUDIO,
        PERMISSIONS.ANDROID.READ_MEDIA_IMAGES
      ] : []),
      PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      PERMISSIONS.ANDROID.MANAGE_EXTERNAL_STORAGE,
    ];

    try {
      // Solicita permissões ao sistema
      const result = await requestMultiple(permissionsToRequest);
      handlePermissionResult(result);

      // Identifica permissões negadas ou bloqueadas
      const deniedPermissions = Object.values(result).filter(status => status === RESULTS.DENIED || status === RESULTS.BLOCKED);

      if (deniedPermissions.length > 0) {
        Alert.alert(
          "Permissões Necessárias",
          "Algumas permissões essenciais foram negadas. Por favor, conceda as permissões para o correto funcionamento do app.",
          [
            { text: "Tentar Novamente", onPress: requestAndroidPermissions },
            { text: "Cancelar", style: "cancel" },
          ]
        );
      }
    } catch (error) {
      console.error("Erro ao solicitar permissões:", error);
      Alert.alert("Erro", "Houve um erro ao tentar solicitar as permissões. Tente novamente.");
    }
  };

  // Executa a solicitação de permissões ao montar o componente, apenas no Android
  useEffect(() => {
    if (Platform.OS === 'android') {
      requestAndroidPermissions();
    }
  }, []);

  return (
    <PermissionsContext.Provider value={{ permissionsStatus, requestAndroidPermissions }}>
      {children}
    </PermissionsContext.Provider>
  );
};
