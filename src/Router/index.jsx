import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ContextProvider } from '../context';
import { Router } from './navigation';

export function Providers() {
  return (
    <NavigationContainer>
      <SafeAreaProvider>
        <ContextProvider>
          <Router />
        </ContextProvider>
      </SafeAreaProvider>
    </NavigationContainer>
  );
}