import { StatusBar } from 'expo-status-bar';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface IFriendProps {}

export const FriendScreen: React.FC<IFriendProps> = observer(function FriendScreen(props) {
  return (
    <>
      <View style={styles.container}>
        <Text>Open up App.tsx to start working on your app!</Text>
        <StatusBar style='auto' />
      </View>
    </>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
