import { NavigationContainer } from '@react-navigation/native';
import * as SecureStore from 'expo-secure-store';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { PaperProvider } from 'react-native-paper';
import { initialWindowMetrics, SafeAreaProvider } from 'react-native-safe-area-context';
import { STORAGE_KEY } from 'src/constants';
import { useStores } from 'src/models';
import { AppNavigator } from 'src/navigations/appNavigator';
import * as AuthService from 'src/services/authService';

interface AppProps {
  hideSplashScreen: () => Promise<boolean>;
}

/**
 * This is the root component of our app.
 * @param {AppProps} props - The props for the `App` component.
 * @returns {JSX.Element} The rendered `App` component.
 */
export const App = observer(function App(props: AppProps) {
  const { hideSplashScreen } = props;
  const {
    authenticationStore: { setBothAuthToken },
  } = useStores();

  (async () => {
    const refreshToken = await SecureStore.getItemAsync(STORAGE_KEY.REFRESH_TOKEN);
    if (refreshToken) {
      try {
        const response = await AuthService.refreshToken(refreshToken);
        if (response.ok) {
          await SecureStore.setItemAsync(STORAGE_KEY.TOKEN, response.data.data.token);
          setBothAuthToken(response.data.data.token, refreshToken);
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error: any) {
        // should not log any error in here
      }
    }
    setTimeout(hideSplashScreen, 500);
  })();

  return (
    <NavigationContainer>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <KeyboardProvider>
            <PaperProvider>
              <AppNavigator />
            </PaperProvider>
          </KeyboardProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </NavigationContainer>
  );
});

export default App;
