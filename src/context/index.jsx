import React from 'react';
import { MusicProvider } from './MusicContext';
import { BleProvider } from './BleConnectionConextProvide';
import { PermissionsProvider } from './PermissionsProvider';
import { CartProvider } from './Cart';
import { BackHandlerProvider } from './BackHandlerAndroid';
import { SocketClientProvider } from './SocketClient';
import { ControlsProvider } from './ControlsContext';
import { DeviceNameProvider } from './DeviceNameContext';

export const ContextProvider = ({ children }) => {
  return (
    <DeviceNameProvider>
      <SocketClientProvider>
        <PermissionsProvider>
          <BleProvider>
            <MusicProvider>
              <CartProvider>
                <ControlsProvider>
                  <BackHandlerProvider>
                    {children}
                  </BackHandlerProvider>
                </ControlsProvider>
              </CartProvider>
            </MusicProvider>
          </BleProvider>
        </PermissionsProvider>
      </SocketClientProvider>
    </DeviceNameProvider>
  );
}