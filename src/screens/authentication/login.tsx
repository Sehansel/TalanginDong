import { StackNavigationProp } from '@react-navigation/stack';
import * as SecureStore from 'expo-secure-store';
import { StatusBar } from 'expo-status-bar';
import { observer, useLocalObservable } from 'mobx-react-lite';
import React from 'react';
import { StyleSheet, Text, View, Pressable, Image, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { Button, HelperText } from 'react-native-paper';
import { STORAGE_KEY } from 'src/constants';
import { useStores } from 'src/models';

import { CustomTextInput } from '../../components/customTextInput';
import { AuthNavigatorParamList } from '../../navigations/authNavigator';
import * as AuthService from '../../services/authService';
import { COLOR } from '../../theme';

interface ILoginProps {
  navigation: StackNavigationProp<AuthNavigatorParamList>;
}

export const LoginScreen: React.FC<ILoginProps> = observer(function LoginScreen(props) {
  const { navigation } = props;
  const {
    authenticationStore: { setBothAuthToken },
  } = useStores();
  const authStore = useLocalObservable(() => ({
    email: {
      value: '',
      isError: false,
      isInvalid: false,
    },
    password: {
      value: '',
      isError: false,
      isInvalid: false,
    },
    isSubmited: false,
    loading: false,
    setEmail(text: string) {
      this.email.value = text;
      this.email.isInvalid = false;
      this.password.isInvalid = false;
      if (this.isSubmited) {
        if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(this.email.value)) {
          this.email.isError = true;
        } else {
          this.email.isError = false;
        }
        if (this.password.value.length === 0) {
          this.password.isError = true;
        } else {
          this.password.isError = false;
        }
      }
    },
    setPassword(text: string) {
      this.password.value = text;
      this.email.isInvalid = false;
      this.password.isInvalid = false;
      if (this.isSubmited) {
        if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(this.email.value)) {
          this.email.isError = true;
        } else {
          this.email.isError = false;
        }
        if (this.password.value.length === 0) {
          this.password.isError = true;
        } else {
          this.password.isError = false;
        }
      }
    },
    setIsInvalid() {
      this.email.isInvalid = true;
      this.password.isInvalid = true;
    },
    setIsSubmited() {
      this.isSubmited = true;
      if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(this.email.value)) {
        this.email.isError = true;
      }
      if (this.password.value.length === 0) {
        this.password.isError = true;
      }
    },
    setLoading(state: boolean) {
      this.loading = state;
    },
  }));

  async function submit() {
    authStore.setIsSubmited();
    if (authStore.email.isError || authStore.password.isError) return;
    authStore.setLoading(true);
    try {
      const response = await AuthService.login(authStore.email.value, authStore.password.value);
      if (response.ok) {
        await SecureStore.setItemAsync(STORAGE_KEY.TOKEN, response.data.data.token);
        await SecureStore.setItemAsync(STORAGE_KEY.REFRESH_TOKEN, response.data.data.refreshToken);
        setBothAuthToken(response.data.data.token, response.data.data.refreshToken);
      } else {
        if (response.data.code === 'NOT_FOUND') {
          Alert.alert('Error', 'Email or password is invalid');
          authStore.setIsInvalid();
        } else {
          Alert.alert('Error', 'Unknown Error');
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: any) {
      Alert.alert('Error', 'Unknown Error');
    }
    authStore.setLoading(false);
  }

  return (
    <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.title}>Login</Text>
          <CustomTextInput
            label='Email'
            value={authStore.email.value}
            onChangeText={(text) => authStore.setEmail(text)}
            error={authStore.email.isError || authStore.email.isInvalid}
            autoCapitalize='none'
          />
          <HelperText
            style={{ alignSelf: 'flex-start' }}
            type='error'
            visible={authStore.email.isError || authStore.email.isInvalid}>
            Email is invalid!
          </HelperText>
          <CustomTextInput
            isSecureInput
            label='Password'
            value={authStore.password.value}
            onChangeText={(text) => authStore.setPassword(text)}
            error={authStore.password.isError || authStore.password.isInvalid}
          />
          <View style={styles.forgotPasswordContainer}>
            <HelperText
              type='error'
              visible={authStore.password.isError || authStore.password.isInvalid}>
              Password is invalid!
            </HelperText>
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
            loading={authStore.loading}>
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
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              marginTop: 222,
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
        <StatusBar style='auto' />
      </View>
    </KeyboardAwareScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContainer: {
    flex: 1,
    margin: 5,
    width: '80%',
    alignItems: 'center',
  },
  forgotPasswordContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
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
