import React from 'react';
import { StyleSheet, View, Text, Button, TouchableOpacity } from 'react-native';

import PropTypes from 'prop-types';

import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

const firebase = require('firebase');


export default class CustomActions extends React.Component {

  constructor() {
    super();
    this.state = {
      image: null,
      location: null
    }; 
  }

  pickImage = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
 
    if(status === 'granted') {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'Images',
      }).catch(error => console.log(error));
 
      // if (!result.cancelled) {
      //   this.setState({
      //     image: result
      //   });  
      // }

      if (!result.cancelled){
        const imageUrl = await this.uploadImage(result.uri);
        this.props.onSend({ image: imageUrl})
      }
 
    }
  }

  takePhoto = async () => {
    const { status } = await Permissions.askAsync(
      Permissions.CAMERA_ROLL,
      Permissions.CAMERA
      );
 
    if(status === 'granted') {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: 'Images',
      }).catch(error => console.log(error));
 
      // if (!result.cancelled) {
      //   this.setState({
      //     image: result
      //   });  
      // }

      if (!result.cancelled){
        const imageUrl = await this.uploadImage(result.uri);
        this.props.onSend({ image: imageUrl})
      }
 
    }
  }

  getLocation = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if(status === 'granted') {
      let result = await Location.getCurrentPositionAsync({});
 
      // if (result) {
      //   this.setState({
      //     location: result
      //   });
      // }

      if (result) {
        this.props.onSend({
            location: {
                longitude: result.coords.longitude,
                latitude: result.coords.latitude,
            },
        });
    }
    }
  }

    uploadImage = async (uri) => {
      try{
      const blob = await new Promise((resolve, reject) =>{
        const xhr = new XMLHttpRequest();
        xhr.onload = function(){
          resolve(xhr.response);
        };
        xhr.onerror = function(e) {
          console.log(e);
          reject(new TypeError('Network request failed'));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);
        xhr.send(null);
      });

      
      let uriGetName = uri.split('/')
      let imageName = uriGetName[uriGetName.length - 1]

      const ref = firebase.storage().ref().child(`${imageName}`)
      const snapshot = await ref.put(blob);

      blob.close();

      const imageUrl = await snapshot.ref.getDownloadURL();

      return imageUrl;
    }
    catch(error){
      console.log(error)
    }
  }


  onActionPress = () => {
    const options = ['Choose From Library', 'Take Picture', 'Send Location', 'Cancel'];
    const cancelButtonIndex = options.length - 1;

    this.context.actionSheet().showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      async (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            return this.pickImage();
          case 1:
            return this.takePhoto();
          case 2:
            return this.getLocation();
          default:
        }
      },
    );
  };

  render() {
    
    return (
      <TouchableOpacity style={[styles.container]} onPress={this.onActionPress}>
       <View style={[styles.wrapper, this.props.wrapperStyle]}>
         <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
       </View>
     </TouchableOpacity>
    );
  }

} 

const styles = StyleSheet.create({
  container: {
    width: 26,
    height: 26,
    marginLeft: 10,
    marginBottom: 10,
  },
  wrapper: {
    borderRadius: 13,
    borderColor: '#b2b2b2',
    borderWidth: 2,
    flex: 1,
  },
  iconText: {
    color: '#b2b2b2',
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: 'transparent',
    textAlign: 'center',
  },
 });

 CustomActions.contextTypes = {
  actionSheet: PropTypes.func,
 };
  