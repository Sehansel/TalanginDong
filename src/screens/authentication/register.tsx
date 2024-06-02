import { StackNavigationProp } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { observer, useLocalObservable } from 'mobx-react-lite';
import React from 'react';
import { StyleSheet, Text, View, Pressable, Image } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { Button, Checkbox, Dialog, Portal, Snackbar } from 'react-native-paper';
import { CustomTextInput } from 'src/components/customTextInput';
import { AuthNavigatorParamList } from 'src/navigations/authNavigator';
import * as AuthService from 'src/services/authService';
import { COLOR } from 'src/theme';
import { isNetworkError } from 'src/utils/apiUtils';

interface IRegisterProps {
  navigation: StackNavigationProp<AuthNavigatorParamList>;
}

export const RegisterScreen: React.FC<IRegisterProps> = observer(function RegisterScreen(props) {
  const { navigation } = props;
  const authStore = useLocalObservable(() => ({
    username: {
      value: '',
      errorText: '',
    },
    email: {
      value: '',
      errorText: '',
    },
    password: {
      value: '',
      errorText: '',
    },
    confirmPassword: {
      value: '',
      errorText: '',
    },
    isChecked: false,
    loading: false,
    snackbar: '',
    dialog: false,
    usernameValidator() {
      if (this.username.value === '') {
        this.username.errorText = "This field can't be empty";
      } else if (this.username.value.length < 3) {
        this.username.errorText = 'Must be alteast 3 characters!';
      } else if (!/^\w+$/.test(this.username.value)) {
        this.username.errorText = 'Must be alphanumeric!';
      } else {
        this.username.errorText = '';
      }
    },
    emailValidator() {
      if (this.email.value === '') {
        this.email.errorText = "This field can't be empty";
      } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(this.email.value)) {
        this.email.errorText = 'Email is invalid!';
      } else {
        this.email.errorText = '';
      }
    },
    passwordValidator() {
      if (this.password.value === '') {
        this.password.errorText = "This field can't be empty";
      } else if (this.password.value.length < 8) {
        this.password.errorText = 'Must be atleast 8 characters!';
      } else if (!/[A-Z]/.test(this.password.value) || !/[a-z]/.test(this.password.value)) {
        this.password.errorText = 'Must include lowercase and uppercase letter!';
      } else if (!/[0-9]/.test(this.password.value)) {
        this.password.errorText = 'Must include number!';
      } else {
        this.password.errorText = '';
      }
    },
    confirmPasswordValidator() {
      if (this.confirmPassword.value === '') {
        this.confirmPassword.errorText = "This field can't be empty";
      } else if (this.password.value !== this.confirmPassword.value) {
        this.confirmPassword.errorText = "Password doesn't match!";
      } else {
        this.confirmPassword.errorText = '';
      }
    },
    setUsername(text: string) {
      this.username.value = text;
      this.usernameValidator();
    },
    setEmail(text: string) {
      this.email.value = text;
      this.emailValidator();
    },
    setPassword(text: string) {
      this.password.value = text;
      this.passwordValidator();
    },
    setConfirmPassword(text: string) {
      this.confirmPassword.value = text;
      this.confirmPasswordValidator();
    },
    setIsChecked(state: boolean) {
      this.isChecked = state;
    },
    setLoading(state: boolean) {
      this.loading = state;
    },
    setSnackbar(text: string) {
      this.snackbar = text;
    },
    setDialog(state: boolean) {
      this.dialog = state;
    },
    setUsernameAlreadyExist() {
      this.username.errorText = 'Username already exist!';
    },
    setEmailAlreadyExist() {
      this.email.errorText = 'Email already exist!';
    },
    submitValidator() {
      this.usernameValidator();
      this.emailValidator();
      this.passwordValidator();
      this.confirmPasswordValidator();
    },
  }));

  async function submit() {
    authStore.submitValidator();
    if (
      authStore.username.errorText !== '' ||
      authStore.email.errorText !== '' ||
      authStore.password.errorText !== '' ||
      authStore.confirmPassword.errorText !== ''
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
        authStore.setDialog(true);
      } else if (isNetworkError(response.problem)) {
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
            returnKeyType='next'
            autoCapitalize='none'
            errorText={authStore.username.errorText}
          />
          <CustomTextInput
            label='Email'
            value={authStore.email.value}
            onChangeText={(text) => authStore.setEmail(text)}
            returnKeyType='next'
            autoCapitalize='none'
            errorText={authStore.email.errorText}
          />
          <CustomTextInput
            label='Password'
            value={authStore.password.value}
            onChangeText={(text) => authStore.setPassword(text)}
            returnKeyType='next'
            autoCapitalize='none'
            errorText={authStore.password.errorText}
            secureTextEntry
          />
          <CustomTextInput
            label='Confirm Password'
            value={authStore.confirmPassword.value}
            onChangeText={(text) => authStore.setConfirmPassword(text)}
            returnKeyType='done'
            autoCapitalize='none'
            errorText={authStore.confirmPassword.errorText}
            secureTextEntry
          />
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
              marginBottom: 30,
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
            visible={!(!authStore.snackbar || authStore.snackbar === '')}
            onDismiss={() => authStore.setSnackbar('')}
            action={{
              label: 'Ok',
            }}
            theme={{ colors: { inversePrimary: COLOR.PRIMARY } }}>
            {authStore.snackbar}
          </Snackbar>
          <Dialog
            visible={authStore.dialog}
            dismissable={false}
            onDismiss={() => {
              authStore.setDialog(false);
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
                  authStore.setDialog(false);
                  navigation.reset({
                    index: 1,
                    routes: [
                      {
                        name: 'Welcome',
                      },
                      {
                        name: 'Login',
                      },
                    ],
                  });
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
