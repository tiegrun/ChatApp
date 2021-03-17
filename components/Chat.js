import React from 'react';
import { View, Platform, KeyboardAvoidingView, Text, StyleSheet, Image} from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
// import { AsyncStorage, NetInfo} from '@react-native-community/async-storage';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from "@react-native-community/netinfo";

import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import MapView from 'react-native-maps';

import CustomActions from './CustomActions';

const firebase = require('firebase');
require('firebase/firestore');

export default class Chat extends React.Component {

  constructor() {
    super();
    this.state = {
      bgColor: "",
      messages: [],
      user: {
        _id: "",
        name: "",
        avatar: "",
      },
      uid: "",
      loggedInText: "",
      isConnected: false,
      image: null,
    }

    if (!firebase.apps.length) {
      firebase.initializeApp({

        apiKey: "AIzaSyBu20jbshPKZgi9JH8O37YrmVD3mAuSOe4",
        authDomain: "chatapp-2e14d.firebaseapp.com",
        projectId: "chatapp-2e14d",
        storageBucket: "chatapp-2e14d.appspot.com",
        messagingSenderId: "1076471906125",
        appId: "1:1076471906125:web:59d8aa5c59ee13b431c104",
        measurementId: "G-H8FCZKYDE1"
      
      });
    } 

    this.referenceMessages = firebase.firestore().collection('messages')

  }
  
  init() {
    let { name, color } = this.props.route.params;
    this.props.navigation.setOptions({ title: 'Chat Room'});

    this.setState({
      bgColor: color,
    })
  }

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      var data = doc.data();

      messages.push({
        _id: data._id,
        text: data.text.toString(),
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name,
          avatar: data.user.avatar,
        },
        image: data.image || '',
        location: data.location,
      });
    });
    this.setState({
      messages
    });

  };

  handleConnectivityChange = state => {
    const isConnected = state.isConnected;
    if (isConnected == true) {
      this.setState({
        isConnected: true
      });
      this.unsubscribe = this.referenceMessages
        .orderBy("createdAt", "desc")
        .onSnapshot(this.onCollectionUpdate);
    } else {
      this.setState({
        isConnected: false
      });
    }
  };

  async getMessages() {
    let messages = '';
    try {
      messages = await AsyncStorage.getItem('messages') || [];
      this.setState({
        messages: JSON.parse(messages)
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  componentDidMount() {

    this.init();

      NetInfo.addEventListener(state => {
        this.handleConnectivityChange(state);
      });

      NetInfo.fetch().then(state => {

        const isConnected = state.isConnected;

        if (isConnected) {
          this.setState({
            isConnected: true
          });

          this.authUnsubscribe = firebase.auth().onAuthStateChanged(async user => {

            if (!user) {
              await firebase.auth().signInAnonymously();
            }

            this.setState({
              uid: user.uid,
              messages: []
            });

            this.unsubscribe = this.referenceMessages.orderBy("createdAt", "desc").onSnapshot(this.onCollectionUpdate);
          });
        } else {

          this.setState({
            isConnected: false
          });

          this.getMessages();
        }
      });
  }

  componentWillUnmount() {
    this.authUnsubscribe();
    this.unsubscribe();
  }

  addMessages = () => {

    const message = this.state.messages[0];

    this.referenceMessages.add({
      _id: message._id,
      text: message.text || '',
      createdAt: message.createdAt,
      user: message.user,
      image: message.image || '',
      location: message.location || '',
      sent: true,
      uid: this.state.uid,
    });

    console.log(message)
  };

  async saveMessages() {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error) {
      console.log(error.message);
    }
  };

  async deleteMessages() {
    try {
      await AsyncStorage.removeItem('messages');
      this.setState({
        messages: []
      })
    } catch (error) {
      console.log(error.message);
    }
  }

  onSend(messages = []) {

    this.setState(
      previousState => ({
        messages: GiftedChat.append(previousState.messages, messages)
      }),

      () => {
        this.addMessages();
        this.saveMessages();
        // console.log(this.state.messages)
      }
    );
  };

  renderBubble(props) {
    return (
      <Bubble {...props} wrapperStyle={{
        right: {backgroundColor: '#000'},
        left: {backgroundColor: '#fff'}
        }}/>
    )
  }

  renderInputToolbar(props) {
    if (this.state.isConnected == false) {
    } else {
      return(
        <InputToolbar
        {...props}
        />
      );
    }
  }

  renderCustomActions = (props) => {
    return <CustomActions {...props} />;
  };

  renderCustomView (props) {
    const { currentMessage} = props;
    if (currentMessage.location) {
      return (
          <MapView
            style={{width: 150,
              height: 100,
              borderRadius: 13,
              margin: 3}}
            region={{
              latitude: currentMessage.location.latitude,
              longitude: currentMessage.location.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          />
      );
    }
    return null;
  }

  render() {
   console.log(this.state.messages)

    return (

    <View style={{flex: 1, backgroundColor: this.state.bgColor }}>
      <Text>{this.state.loggedInText}</Text>
      {this.state.image && 
                    <Image source={{uri: this.state.image.uri}} style={{width: 200, height: 200}} />
                }
      <GiftedChat 
        renderBubble={this.renderBubble.bind(this)}
        renderInputToolbar={this.renderInputToolbar.bind(this)}
        renderActions={this.renderCustomActions.bind(this)}
        renderCustomView={this.renderCustomView.bind(this)}
        messages={this.state.messages} 
        image={this.state.image}
        onSend={messages => this.onSend(messages)}
        user={{
          _id: 1,
          // name: `${name}`,
          // avatar: "",
            }}
        
      />
      { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
    </View>
      
    );
  };
}
