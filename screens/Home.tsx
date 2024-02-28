import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableOpacity,
  Image,
  ImageBackground,
} from 'react-native';

import { Link, useNavigation } from '@react-navigation/native';
import { HomeScreenNavigationProp, HomeStackNavigationParamList } from '../type';

type SectionProps = PropsWithChildren<{
  title: string;
}>;


function Login(): React.JSX.Element {

  const navigation = useNavigation<HomeScreenNavigationProp>()

  const backgroundStyle = {
    flex: 1,
    backgroundColor: 'blue',
  };

  return (
    <SafeAreaView style={backgroundStyle}>
        <View>
          
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 35,
    fontWeight: '600',
    color: 'white',
    justifyContent: 'center',
    textAlign: 'center',
  },
  sectionDescription: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    justifyContent: 'center',
    textAlign: 'center'
  },
  loginContainer: {
    marginTop: '7%',
    marginLeft: '25%',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    width: 200, 
    height: 43, 
    borderRadius: 28, 
    backgroundColor: 'white',
    borderColor: '#39e75f',
    borderWidth: 2
  },
  registerContainer: {
    marginTop: '5%',
    marginLeft: '25%',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    width: 200, 
    height: 43, 
    borderRadius: 28, 
    backgroundColor: '#39e75f',
    borderColor: 'white',
    borderWidth: 2
  },
  orText:{
    fontSize: 18,
    fontWeight: '600',
    color: 'black',
    justifyContent: 'center',
    textAlign: 'center',
    marginTop: '3%'
  },
  loginButtonText: {
    color: '#39e75f', 
    fontSize: 16, 
    fontWeight: 'bold', 
  },
  registerButtonText: {
    color: 'white', 
    fontSize: 16, 
    fontWeight: 'bold', 
  },
});

export default Login;
