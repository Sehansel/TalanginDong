import { StackNavigationProp } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { observer, useLocalObservable } from 'mobx-react-lite';
import React from 'react';
import { StyleSheet, Text, View, Pressable, Image } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { Button, HelperText, Checkbox, Dialog, Portal, Snackbar } from 'react-native-paper';

import { CustomTextInput } from '../../components/customTextInput';
import { AuthNavigatorParamList } from '../../navigations/authNavigator';
import * as AuthService from '../../services/authService';
import { COLOR } from '../../theme';

interface IRegisterProps {
  navigation: StackNavigationProp<AuthNavigatorParamList>;
}

export const RegisterScreen: React.FC<IRegisterProps> = observer(function RegisterScreen(props) {
  const { navigation } = props;
  const authStore = useLocalObservable(() => ({
    username: {
      value: '',
      isError: false,
      helperText: '',
    },
    email: {
      value: '',
      isError: false,
      helperText: '',
    },
    password: {
      value: '',
      isError: false,
      helperText: '',
    },
    confirmPassword: {
      value: '',
      isError: false,
      helperText: '',
    },
    isChecked: false,
    isSubmited: false,
    loading: false,
    snackbar: {
      value: '',
      visible: false,
    },
    dialog: false,
    setUsername(text: string) {
      this.username.value = text;
      if (text.length < 3) {
        this.username.isError = true;
        this.username.helperText = 'Must be alteast 3 characters!';
      } else if (!/^\w+$/.test(text)) {
        this.username.isError = true;
        this.username.helperText = 'Must be alphanumeric!';
      } else {
        this.username.isError = false;
        this.username.helperText = '';
      }
    },
    setEmail(text: string) {
      this.email.value = text;
      if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(text)) {
        this.email.isError = true;
        this.email.helperText = 'Email is invalid!';
      } else {
        this.email.isError = false;
        this.email.helperText = '';
      }
    },
    setPassword(text: string) {
      this.password.value = text;
      if (text.length < 8) {
        this.password.isError = true;
        this.password.helperText = 'Must be atleast 8 characters!';
      } else if (!/[A-Z]/.test(text) || !/[a-z]/.test(text)) {
        this.password.isError = true;
        this.password.helperText = 'Must include lowercase and uppercase letter!';
      } else if (!/[0-9]/.test(text)) {
        this.password.isError = true;
        this.password.helperText = 'Must include number!';
      } else {
        this.password.isError = false;
        this.password.helperText = '';
      }
    },
    setConfirmPassword(text: string) {
      this.confirmPassword.value = text;
      if (this.password.value !== this.confirmPassword.value) {
        this.confirmPassword.isError = true;
        this.confirmPassword.helperText = "Password doesn't match!";
      } else {
        this.confirmPassword.isError = false;
        this.confirmPassword.helperText = '';
      }
    },
    setUsernameAlreadyExist() {
      this.username.isError = true;
      this.username.helperText = 'Username already exist!';
    },
    setEmailAlreadyExist() {
      this.email.isError = true;
      this.email.helperText = 'Email already exist!';
    },
    setIsChecked(state: boolean) {
      this.isChecked = state;
    },
    setIsSubmited() {
      this.isSubmited = true;
    },
    setLoading(state: boolean) {
      this.loading = state;
    },
    setSnackbar(text: string) {
      this.snackbar.value = text;
      this.snackbar.visible = true;
    },
    hideSnackbar() {
      this.snackbar.value = '';
      this.snackbar.visible = false;
    },
    setDialogVisible() {
      this.dialog = true;
    },
    hideDialog() {
      this.dialog = false;
    },
  }));

  async function submit() {
    authStore.setIsSubmited();
    if (
      authStore.username.isError ||
      authStore.email.isError ||
      authStore.password.isError ||
      authStore.confirmPassword.isError
    )
      return;
    if (!authStore.isChecked) {
      authStore.setSnackbar('Please indicate that you accept the terms & conditions!');
      return;
    }
    authStore.setLoading(true);
    try {
      const response = await AuthService.register(
        authStore.username.value,
        authStore.email.value,
        authStore.password.value,
      );
      if (response.ok) {
        authStore.setDialogVisible();
      } else if (
        ['CONNECTION_ERROR', 'NETWORK_ERROR', 'TIMEOUT_ERROR'].includes(response.problem ?? '')
      ) {
        authStore.setSnackbar('Please check your network connection before continue!');
      } else {
        if (response.data.status === 409 && response.data.reason === 'Username already exist') {
          authStore.setSnackbar('Username already exist!');
          authStore.setUsernameAlreadyExist();
        } else if (response.data.status === 409 && response.data.reason === 'Email already exist') {
          authStore.setSnackbar('Email already exist!');
          authStore.setEmailAlreadyExist();
        } else {
          authStore.setSnackbar('Unknown error occured!');
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: any) {
      authStore.setSnackbar('Unknown error occured');
    }
    authStore.setLoading(false);
  }

  return (
    <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.title}>Register</Text>
          <CustomTextInput
            label='Username'
            value={authStore.username.value}
            onChangeText={(text) => authStore.setUsername(text)}
            error={authStore.username.isError}
          />
          <HelperText
            style={{ alignSelf: 'flex-start' }}
            type='error'
            visible={authStore.username.isError}
            padding='none'>
            {authStore.username.helperText}
          </HelperText>
          <CustomTextInput
            label='Email'
            value={authStore.email.value}
            onChangeText={(text) => authStore.setEmail(text)}
            error={authStore.email.isError}
            autoCapitalize='none'
          />
          <HelperText
            style={{ alignSelf: 'flex-start' }}
            type='error'
            visible={authStore.email.isError}>
            {authStore.email.helperText}
          </HelperText>
          <CustomTextInput
            isSecureInput
            label='Password'
            value={authStore.password.value}
            onChangeText={(text) => authStore.setPassword(text)}
            error={authStore.password.isError}
          />
          <HelperText
            style={{ alignSelf: 'flex-start' }}
            type='error'
            visible={authStore.password.isError}>
            {authStore.password.helperText}
          </HelperText>
          <CustomTextInput
            isSecureInput
            label='Confirm Password'
            value={authStore.confirmPassword.value}
            onChangeText={(text) => authStore.setConfirmPassword(text)}
            error={authStore.confirmPassword.isError}
          />
          <HelperText
            style={{ alignSelf: 'flex-start' }}
            type='error'
            visible={authStore.confirmPassword.isError}>
            {authStore.confirmPassword.helperText}
          </HelperText>
          <View
            style={{
              flexDirection: 'row',
              maxWidth: '100%',
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
            }}>
            <Checkbox
              status={authStore.isChecked ? 'checked' : 'unchecked'}
              onPress={() => {
                authStore.setIsChecked(!authStore.isChecked);
              }}
              color={COLOR.PRIMARY}
            />
            <Text style={{ flexShrink: 1, overflow: 'hidden', marginTop: 7, fontSize: 15 }}>
              By creating an account you agree to our
              <Text style={{ color: COLOR.PRIMARY }}> terms & conditions</Text>.
            </Text>
          </View>
          <Button
            mode='contained'
            buttonColor={COLOR.PRIMARY}
            textColor='white'
            style={styles.button}
            onPress={submit}
            loading={authStore.loading}>
            Register
          </Button>
          <View style={styles.accountCreateContainer}>
            <Text style={{ fontWeight: '600', fontSize: 12 }}>Already have an account?</Text>
            <Pressable onPress={() => console.log('test')}>
              <Text style={styles.touchableText} onPress={() => navigation.navigate('Login')}>
                Login
              </Text>
            </Pressable>
          </View>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              marginTop: 55,
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
        <Snackbar
          visible={authStore.snackbar.visible}
          onDismiss={authStore.hideSnackbar}
          action={{
            label: 'Ok',
          }}
          theme={{ colors: { inversePrimary: COLOR.PRIMARY } }}>
          {authStore.snackbar.value}
        </Snackbar>
        <Portal>
          <Dialog
            visible={authStore.dialog}
            dismissable={false}
            onDismiss={() => {
              authStore.hideDialog();
              navigation.navigate('Login');
            }}
            theme={{
              colors: {
                elevation: {
                  level3: 'white',
                },
              },
            }}>
            <Dialog.Icon size={45} color={COLOR.PRIMARY} icon='check-circle' />
            <Dialog.Title style={{ textAlign: 'center' }}>Success</Dialog.Title>
            <Dialog.Content>
              <Text>
                Your account has been registered! To continue, please login using your registered
                account.
              </Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                textColor={COLOR.PRIMARY}
                onPress={() => {
                  authStore.hideDialog();
                  navigation.navigate('Login');
                }}>
                Ok
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
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
    marginTop: 10,
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
