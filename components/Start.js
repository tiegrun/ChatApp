import React from 'react';
import {
  StyleSheet, View, Text, TextInput, ImageBackground, TouchableOpacity, Dimensions,
} from 'react-native';

const backgroundImage = require('../assets/BackgroundImage.png');
const heightPrimary = Dimensions.get('window').height;
const fixedWidth = '88%';
const fixedHeight = heightPrimary * 0.44;
const fixedHeightSecondary = '30%';

/**
*@requires react
*@requires react-native
*/

export default class Start extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      color: '',
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
          <View style={styles.header}>
            <Text style={styles.title}>Chat App</Text>
          </View>
          <View style={styles.section}>
            <View style={styles.inputPlace}>
              <TextInput style={styles.textInput} onChangeText={(name) => this.setState({ name })} value={this.state.name} placeholder='You Name' />
            </View>
            <View style={styles.chooseColor}>
              <View style={styles.chooseColorTextPlace}>
                <Text style={styles.chooseColorText}>Choose Background Color:</Text>
              </View>
              <View style={styles.circlePlaces}>
                <TouchableOpacity onPress={() => this.setState({ color: '#090C08' })} style={styles.circle1} />
                <TouchableOpacity onPress={() => this.setState({ color: '#474056' })} style={styles.circle2} />
                <TouchableOpacity onPress={() => this.setState({ color: '#8A95A5' })} style={styles.circle3} />
                <TouchableOpacity onPress={() => this.setState({ color: '#B9C6AE' })} style={styles.circle4} />
              </View>
            </View>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Chat', { name: this.state.name, color: this.state.color })} style={styles.button}>
              <Text style={styles.buttonText}>Start Chatting</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  backgroundImage: {
    height: heightPrimary,
    resizeMode: 'cover',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
  },
  title: {
    fontSize: 45,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  section: {
    alignItems: 'center',
    justifyContent: 'space-around',
    height: fixedHeight,
    width: fixedWidth,
    backgroundColor: '#FFFFFF',
  },
  inputPlace: {
    width: fixedWidth,
    borderWidth: 1,
  },
  textInput: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    opacity: 50,
    padding: 10,
  },
  chooseColor: {
    height: fixedHeightSecondary,
    width: fixedWidth,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  chooseColorTextPlace: {
    marginBottom: 15,
  },
  chooseColorText: {
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    opacity: 100,
  },
  circlePlaces: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  circle1: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 6,
    backgroundColor: '#090C08',
  },
  circle2: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#474056',
  },
  circle3: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#8A95A5',
  },
  circle4: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#B9C6AE',
  },
  button: {
    width: fixedWidth,
    height: 60,
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
