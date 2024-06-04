import { StackNavigationProp } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { observer, useLocalObservable } from 'mobx-react-lite';
import React from 'react';
import { StyleSheet, Text, View, Pressable, Image, Dimensions } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { Button, Checkbox, Dialog, Portal, Snackbar } from 'react-native-paper';
import { CustomTextInput } from 'src/components/customTextInput';
import { RegisterStoreModel } from 'src/models/authentication/registerStore';
import { AuthNavigatorParamList } from 'src/navigations/authNavigator';
import * as AuthService from 'src/services/authService';
import { COLOR } from 'src/theme';
import { isNetworkError } from 'src/utils/apiUtils';

interface IRegisterProps {
  navigation: StackNavigationProp<AuthNavigatorParamList>;
}

export const RegisterScreen: React.FC<IRegisterProps> = observer(function RegisterScreen(props) {
  const { navigation } = props;
  const registerStore = useLocalObservable(() =>
    RegisterStoreModel.create({
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
    }),
  );

  async function submit() {
    registerStore.submitValidator();
    if (
      registerStore.username.errorText !== '' ||
      registerStore.email.errorText !== '' ||
      registerStore.password.errorText !== '' ||
      registerStore.confirmPassword.errorText !== ''
    )
      return;
    if (!registerStore.isChecked) {
      registerStore.setSnackbar('Please indicate that you accept the terms & conditions!');
      return;
    }
    registerStore.setLoading(true);
    try {
      const response = await AuthService.register(
        registerStore.username.value,
        registerStore.email.value,
        registerStore.password.value,
      );
      if (response.ok) {
        registerStore.setDialog(true);
      } else if (isNetworkError(response.problem)) {
        registerStore.setSnackbar('Please check your network connection before continue!');
      } else {
        if (response.data.status === 409 && response.data.reason === 'Username already exist') {
          registerStore.setSnackbar('Username already exist!');
          registerStore.setUsernameAlreadyExist();
        } else if (response.data.status === 409 && response.data.reason === 'Email already exist') {
          registerStore.setSnackbar('Email already exist!');
          registerStore.setEmailAlreadyExist();
        } else {
          registerStore.setSnackbar('Unknown error occured!');
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: any) {
      registerStore.setSnackbar('Unknown error occured');
    }
    registerStore.setLoading(false);
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
        (registerStore.username.errorText === '' ? 0 : 20) +
        (registerStore.email.errorText === '' ? 0 : 20) +
        (registerStore.password.errorText === '' ? 0 : 20) +
        (registerStore.confirmPassword.errorText === '' ? 0 : 20),
    },
  });

  return (
    <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ flexGrow: 1 }}>
      <View style={dynamicStyles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.title}>Register</Text>
          <CustomTextInput
            label='Username'
            value={registerStore.username.value}
            onChangeText={(text) => registerStore.setUsername(text)}
            returnKeyType='next'
            autoCapitalize='none'
            errorText={registerStore.username.errorText}
          />
          <CustomTextInput
            label='Email'
            value={registerStore.email.value}
            onChangeText={(text) => registerStore.setEmail(text)}
            returnKeyType='next'
            autoCapitalize='none'
            errorText={registerStore.email.errorText}
          />
          <CustomTextInput
            label='Password'
            value={registerStore.password.value}
            onChangeText={(text) => registerStore.setPassword(text)}
            returnKeyType='next'
            autoCapitalize='none'
            errorText={registerStore.password.errorText}
            secureTextEntry
          />
          <CustomTextInput
            label='Confirm Password'
            value={registerStore.confirmPassword.value}
            onChangeText={(text) => registerStore.setConfirmPassword(text)}
            returnKeyType='done'
            autoCapitalize='none'
            errorText={registerStore.confirmPassword.errorText}
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
              status={registerStore.isChecked ? 'checked' : 'unchecked'}
              onPress={() => {
                registerStore.setIsChecked(!registerStore.isChecked);
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
            loading={registerStore.loading}>
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
            visible={!(!registerStore.snackbar || registerStore.snackbar === '')}
            onDismiss={() => registerStore.setSnackbar('')}
            action={{
              label: 'Ok',
            }}
            theme={{ colors: { inversePrimary: COLOR.PRIMARY } }}>
            {registerStore.snackbar}
          </Snackbar>
          <Dialog
            visible={registerStore.dialog}
            dismissable={false}
            onDismiss={() => {
              registerStore.setDialog(false);
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
                  registerStore.setDialog(false);
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
