import React from 'react';
import { View, Platform, KeyboardAvoidingView, Text, StyleSheet} from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';

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
      image: "",
      location: "",
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

      // messages: [
      //   {
      //     _id: 1,
      //     text: 'Hello developer',
      //     createdAt: new Date(),
      //     user: {
      //       _id: 2,
      //       name: 'React Native',
      //       avatar: 'https://placeimg.com/140/140/any',
      //     },
      //    },
      //    {
      //     _id: 2,
      //     text: `${name} has entered the chat`,
      //     createdAt: new Date(),
      //     system: true,
      //    },
      // ],
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

  componentDidMount() {

    this.init();
    
   
    this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) {
        await firebase.auth().signInAnonymously();
      }
    
      //update user state with currently active user data
      this.setState({
        messages: [],
        uid: user.uid,
        loggedInText: 'Hello there',
      });
    });

    this.referenceMessages = firebase.firestore().collection('messages');
    this.unsubscribe = this.referenceMessages.onSnapshot(this.onCollectionUpdate);

    

  }

  componentWillUnmount() {
    this.unsubscribe();
    this.authUnsubscribe();
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

  };

  onSend(messages = []) {

    this.setState(
      previousState => ({
        messages: GiftedChat.append(previousState.messages, messages)
      }),

      () => {
        this.addMessages();
       
        console.log(this.state.messages)
      }
    );
  }

  renderBubble(props) {
    return (
      <Bubble {...props} wrapperStyle={{
        right: {backgroundColor: '#000'},
        left: {backgroundColor: '#fff'}
        
        }}/>
    )
  }

  render() {
   console.log(this.state.messages)
    return (

    <View style={{flex: 1, backgroundColor: this.state.bgColor }}>
      <Text>{this.state.loggedInText}</Text>
      <GiftedChat 
        renderBubble={this.renderBubble.bind(this)}
        messages={this.state.messages} 
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

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// })