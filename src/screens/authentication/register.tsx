import { StackNavigationProp } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { observer, useLocalObservable } from 'mobx-react-lite';
import React from 'react';
import { StyleSheet, Text, View, Pressable, Image } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { Button, HelperText } from 'react-native-paper';

import { CustomTextInput } from '../../components/customTextInput';
import { AuthNavigatorParamList } from '../../navigations/authNavigator';
import { COLOR } from '../../theme';

interface IRegisterProps {
  navigation: StackNavigationProp<AuthNavigatorParamList>;
}

export const RegisterScreen: React.FC<IRegisterProps> = observer(function RegisterScreen(props) {
  const { navigation } = props;
  const authStore = useLocalObservable(() => ({
    email: '',
    password: '',
    isSubmited: false,
    loading: false,
    setEmail(text: string) {
      this.email = text;
    },
    setPassword(text: string) {
      this.password = text;
    },
    setIsSubmited() {
      this.isSubmited = true;
    },
    setLoading(state: boolean) {
      this.loading = state;
    },
  }));

  function isEmailInvalid() {
    return !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(authStore.email) && authStore.isSubmited;
  }

  function isPasswordInvalid() {
    return authStore.password === '' && authStore.isSubmited;
  }

  function submit() {
    authStore.setIsSubmited();
    if (isEmailInvalid() || isPasswordInvalid()) return;
    console.log('success');
  }

  console.log('Re render');

  return (
    <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }} style={{ flexGrow: 1 }}>
      <View style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.title}>Register</Text>
          <CustomTextInput
            label='Email'
            value={authStore.email}
            onChangeText={(text) => authStore.setEmail(text)}
            error={isEmailInvalid()}
          />
          <HelperText style={{ alignSelf: 'flex-start' }} type='error' visible={isEmailInvalid()}>
            Email is invalid!
          </HelperText>
          <CustomTextInput
            isSecureInput
            label='Password'
            value={authStore.password}
            onChangeText={(text) => authStore.setPassword(text)}
            error={isPasswordInvalid()}
          />
          <View style={styles.forgotPasswordContainer}>
            <HelperText type='error' visible={isPasswordInvalid()}>
              Password is invalid!
            </HelperText>
            <Pressable onPress={() => console.log('test')}>
              <Text style={{ ...styles.touchableText, fontSize: 12 }}>Forgot Password?</Text>
            </Pressable>
          </View>
          <Button
            mode='contained'
            buttonColor={COLOR.PRIMARY}
            textColor='white'
            style={styles.button}
            onPress={submit}>
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
              marginTop: 200,
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
