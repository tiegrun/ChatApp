import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, View, Text, TextInput, Alert, Button, ScrollView  } from 'react-native';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Start from './components/Start';
import Chat from './components/Chat';

// Create the navigator
const Stack = createStackNavigator();

export default class App extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { 
//       text: '' 
//     };
//   }
 
//    // alert the user input
//  alertMyText (input = []) {
//   Alert.alert(input.text);
// }

render() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Screen1">
        <Stack.Screen name="Start" component={Start}/>
        <Stack.Screen name="Chat" component={Chat}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

}