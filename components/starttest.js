import React from 'react';
import { StyleSheet, View, Text, TextInput, Button, ImageBackground, Image, TouchableOpacity, ScrollView, Dimensions } from 'react-native';

const backgroundImage = require('../assets/BackgroundImage.png');
const inputIcon = require('../assets/icon.svg');
// const inputIcon = { uri: "http://simpleicon.com/wp-content/uploads/rocket.png" };

const fixedWidth = '88%';
const fixedHeight = '44%';
const fixedHeightSecondary = '30%';
const heightPrimary = '100%';

export default class Screen1 extends React.Component {

  constructor(props) {
    super(props);
    this.state = { 
      name: '' 
    };
  }

  render() {
    
    return (
      <ScrollView style={styles.container}>
        <ImageBackground source={backgroundImage} style={styles.backgroundImage}>

          <View style={styles.header}>
            <Text style={styles.title}>Chat App</Text>
          </View>

          <View style={styles.section}>
            <View style={styles.inputPlace}>
              {/* <Image source={inputIcon} style={styles.imageStyle}/> */}
              <TextInput style={styles.textInput} onChangeText={(name) => this.setState({name})} value={this.state.name} placeholder='You Name'/>
            </View>

            <View style={styles.chooseColor}>
              <View style={styles.chooseColorTextPlace}>
                <Text style={styles.chooseColorText}>Choose Background Color:</Text>
              </View>
              
              <View style={styles.circlePlaces}>
                <View style={styles.circle1}></View>
                <View style={styles.circle2}></View>
                <View style={styles.circle3}></View>
                <View style={styles.circle4}></View>
              </View>
            </View>
            {/* <Button style={styles.btn} title="Start Chatting" onPress={() => this.props.navigation.navigate('Chat', { name: this.state.name })}/> */}

            <TouchableOpacity onPress={() => this.props.navigation.navigate('Chat', { name: this.state.name })} style={styles.button}>
              <Text style={styles.buttonText}>Start Chatting</Text>
            </TouchableOpacity>
          </View>
         
        </ImageBackground>
      </ScrollView>
    )

  }
}

  const styles = StyleSheet.create({

    backgroundImage: {
      flex: 1,
      height: 60,
      resizeMode: "cover",
      justifyContent: "space-around", 
      alignItems: 'center'
    },

    container: {
      // flex: 1,
      height: heightPrimary,
      flexDirection: 'column'
    },

    header: {
      alignItems: 'center',
    },

    title: {
      fontSize: 45,
      fontWeight: '600',
      color: '#FFFFFF'
    },

    section: {
      alignItems: 'center',
      justifyContent: "space-around",
      height: fixedHeight,
      width: fixedWidth,
      backgroundColor: '#FFFFFF',
    },

    inputPlace: {
      width: fixedWidth,
      // flex: 1,
      height: fixedHeightSecondary,
    },
    
    textInput: {
      // width: fixedWidth,
      height: 60,
      borderWidth: 1,
      fontSize: 16,
      fontWeight: '300',
      color: '#757083',
      opacity: 50, 
      padding: 10,
    },

    chooseColor:{
      // flex: 1,
      height: fixedHeightSecondary,
      width: fixedWidth,
      flexDirection: 'column',
      justifyContent: 'flex-start'
    },

    chooseColorTextPlace: {
      marginBottom: 10,
    },

    chooseColorText: {
      fontSize: 16,
      fontWeight: '300',
      color: '#757083',
      opacity: 100
    },

    circlePlaces: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      // backgroundColor: 'red',
    },

    circle1: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: '#090C08',
    },

    circle2: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: '#474056',
    },

    circle3: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: '#8A95A5',
    },

    circle4: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: '#B9C6AE',
    },

    button: {
      width: fixedWidth,
      // height: 60,
      // flex: 1,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#757083',
    },

    buttonText: {
      fontSize: 16,
      fontWeight: '300',
      color: '#FFFFFF',
    }, 

    
   
  });


