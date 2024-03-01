/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TextInput,
  Button,
  TouchableOpacity,
  Image,
  BackHandler,
  Modal,
} from 'react-native';
import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import { useNavigation } from '@react-navigation/native';
import { HomeScreenNavigationProp, HomeStackNavigationParamList } from '../type';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function Register(): React.JSX.Element {

  const navigation = useNavigation<HomeScreenNavigationProp>();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [emailError, setEmailError] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');
  const [modalVisible, setModalVisible] = React.useState(false);

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    flex: 1,
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  // For validation later
  const handleEmailChange = (text: string) => {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text);

    setEmailError(isValid ? '' : 'Invalid email address');
    
    setEmail(text);
  };

  // For validation later
  const handlePasswordChange = (text: string) => {
    const isLengthValid = text.length >= 6;
    const hasUppercase = /[A-Z]/.test(text);
    const hasLowercase = /[a-z]/.test(text);
    const hasNumber = /\d/.test(text);

  setPasswordError(
    !isLengthValid
      ? 'Password must be at least 6 characters long'
      : !hasUppercase || !hasLowercase
      ? 'Password must contain both uppercase and lowercase letters'
      : !hasNumber
      ? 'Password must contain at least one number'
      : ''
  );
    setPassword(text);
  };

  const handleRegister = async () => {
    try{
      if (emailError || passwordError) {
        return;
      }
      const response = await fetch('https://talangindong-api.icarusphantom.dev/v1/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Failed to register user');
      }
      setModalVisible(true);
    }
    catch (error :any) {
      console.error('Error registering user:', error.message);
    }
  };

  React.useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        navigation.goBack();
        return true; 
      }
    );

    return () => backHandler.remove();
  }, [navigation]);

  return (
    <SafeAreaView style={backgroundStyle}>
      <View style={styles.sectionContainer}>
        <Section title="Register">
        </Section>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          placeholderTextColor="#888"
          value={email}
          onChangeText={handleEmailChange}
        />
        {!!emailError && <Text style={styles.error}>{emailError}</Text>}
      </View>
      <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#888"
            value={password}
            onChangeText={handlePasswordChange}
            secureTextEntry={true}
          />
          {!!passwordError && <Text style={styles.error}>{passwordError}</Text>}
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Register" onPress={handleRegister}/>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>User registered successfully!</Text>
            <Button title="OK" onPress={() => 
            {
              setModalVisible(false);
              navigation.navigate('Login');
            }} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: '30%',
    paddingHorizontal: 24,
    marginBottom: -10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  inputContainer: {
    paddingHorizontal: 20,
    marginTop: '5%',
    marginLeft: '11%',
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: '#000000',
    borderWidth: 2,
    borderRadius: 5,
    paddingHorizontal: 10,
    color: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    marginTop: '10%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5, 
  },
});

export default Register;
