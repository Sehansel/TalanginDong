import { StackNavigationProp } from '@react-navigation/stack';
import * as SecureStore from 'expo-secure-store';
import { StatusBar } from 'expo-status-bar';
import { observer, useLocalObservable } from 'mobx-react-lite';
import React from 'react';
import { StyleSheet, Text, View, Pressable, Image, Dimensions } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { Button, Portal, Snackbar } from 'react-native-paper';
import { CustomTextInput } from 'src/components/customTextInput';
import { STORAGE_KEY } from 'src/constants';
import { useStores } from 'src/models';
import { LoginStoreModel } from 'src/models/authentication/loginStore';
import { AuthNavigatorParamList } from 'src/navigations/authNavigator';
import * as AuthService from 'src/services/authService';
import { COLOR } from 'src/theme';
import { isNetworkError } from 'src/utils/apiUtils';

interface ILoginProps {
  navigation: StackNavigationProp<AuthNavigatorParamList>;
}

export const LoginScreen: React.FC<ILoginProps> = observer(function LoginScreen(props) {
  const { navigation } = props;
  const {
    authenticationStore: { setBothAuthToken },
  } = useStores();
  const loginStore = useLocalObservable(() =>
    LoginStoreModel.create({
      email: {
        value: '',
        errorText: '',
      },
      password: {
        value: '',
        errorText: '',
      },
      loading: false,
      snackbar: '',
    }),
  );

  async function submit() {
    loginStore.submitValidator();
    if (loginStore.email.errorText !== '' || loginStore.password.errorText !== '') return;
    loginStore.setLoading(true);
    try {
      const response = await AuthService.login(loginStore.email.value, loginStore.password.value);
      if (response.ok) {
        await SecureStore.setItemAsync(STORAGE_KEY.TOKEN, response.data.data.token);
        await SecureStore.setItemAsync(STORAGE_KEY.REFRESH_TOKEN, response.data.data.refreshToken);
        setBothAuthToken(response.data.data.token, response.data.data.refreshToken);
      } else if (isNetworkError(response.problem)) {
        loginStore.setSnackbar('Please check your network connection before continue!');
      } else {
        if (response.data.code === 'NOT_FOUND') {
          loginStore.setSnackbar('Email or password is invalid!');
          loginStore.setIsInvalid();
        } else {
          loginStore.setSnackbar('Unknown error occured!');
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: any) {
      loginStore.setSnackbar('Unknown error occured!');
    }
    loginStore.setLoading(false);
  }

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      height:
        Dimensions.get('window').height -
        80 +
        (loginStore.email.errorText === '' ? 0 : 20) +
        (loginStore.password.errorText === '' ? 0 : 20),
    },
  });

  return (
    <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ flexGrow: 1 }}>
      <View style={dynamicStyles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.title}>Login</Text>
          <CustomTextInput
            label='Email'
            value={loginStore.email.value}
            onChangeText={(text) => loginStore.setEmail(text)}
            returnKeyType='next'
            autoCapitalize='none'
            errorText={loginStore.email.errorText}
          />
          <CustomTextInput
            label='Password'
            value={loginStore.password.value}
            onChangeText={(text) => loginStore.setPassword(text)}
            returnKeyType='done'
            autoCapitalize='none'
            errorText={loginStore.password.errorText}
            secureTextEntry
          />
          <View style={styles.forgotPasswordContainer}>
            <Pressable onPress={() => navigation.navigate('ForgotPassword')}>
              <Text style={styles.touchableText}>Forgot Password?</Text>
            </Pressable>
          </View>
          <Button
            mode='contained'
            buttonColor={COLOR.PRIMARY}
            textColor='white'
            style={styles.button}
            onPress={submit}
            loading={loginStore.loading}>
            Login
          </Button>
          <View style={styles.accountCreateContainer}>
            <Text style={{ fontWeight: '600', fontSize: 12 }}>Don't have an account?</Text>
            <Pressable onPress={() => navigation.navigate('Register')}>
              <Text style={styles.touchableText}>Create Account</Text>
            </Pressable>
          </View>
          <View
            style={{
              position: 'absolute',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              bottom: 20,
            }}>
            <View style={styles.iconContainer}>
              <Image
                style={styles.icon}
                source={require('../../assets/images/adaptive-icon.png')}
              />
            </View>
            <Text style={{ fontWeight: '600', fontSize: 20 }}>TalanginDong</Text>
          </View>
        </View>
        <Portal>
          <Snackbar
            visible={!(!loginStore.snackbar || loginStore.snackbar === '')}
            onDismiss={() => loginStore.setSnackbar('')}
            action={{
              label: 'Ok',
            }}
            theme={{ colors: { inversePrimary: COLOR.PRIMARY } }}>
            {loginStore.snackbar}
          </Snackbar>
        </Portal>
        <StatusBar style='auto' />
      </View>
    </KeyboardAwareScrollView>
  );
});

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    margin: 5,
    width: '80%',
    alignItems: 'center',
  },
  forgotPasswordContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
  },
  accountCreateContainer: {
    flexDirection: 'row',
    columnGap: 5,
  },
  title: {
    fontWeight: '600',
    fontSize: 40,
    marginVertical: 40,
  },
  textInput: {
    width: '100%',
    height: 50,
  },
  button: {
    width: '100%',
    height: 40,
    marginTop: 60,
  },
  touchableText: {
    color: COLOR.PRIMARY,
    fontWeight: '600',
    fontSize: 12,
  },
  iconContainer: {
    width: 200,
    alignItems: 'flex-end',
    marginBottom: -25,
  },
  icon: {
    flex: 0,
    height: 50,
    width: 50,
    transform: [
      {
        rotate: '-25deg',
      },
    ],
  },
});
