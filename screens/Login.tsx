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

function Login(): React.JSX.Element {

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [modalVisible, setModalVisible] = React.useState(false);

  const handleEmailChange = (text: string) => {
    setEmail(text);
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
  };

  const loginHandler = async () => {
    try{
      if (!email || !password) {
        return;
      }
      const response = await fetch('https://talangindong-api.icarusphantom.dev/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Failed to log in');
      }
      
      navigation.navigate('Home');
    } 
    catch (error: any) {
        setModalVisible(true);
    }
  };

  const navigation = useNavigation<HomeScreenNavigationProp>()

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    flex: 1,
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <View style={styles.sectionContainer}>
        <Section title="Log In">
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
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Login" onPress={loginHandler} />
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
            <Text>Login Failed</Text>
            <Button title="OK" onPress={() => 
            {
              setModalVisible(false);
            }} />
          </View>
        </View>
      </Modal>
      <View>
        <Text>
          Don't have an account? Tap{' '}
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={{ color: 'blue', marginTop: 50}}>Register</Text>
          </TouchableOpacity>{' '}
          to register an account.
        </Text>
      </View>
        
        
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: '40%',
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

export default Login;
