import React from 'react';
import {
  View, Platform, KeyboardAvoidingView, Text, Image,
} from 'react-native';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';
import MapView from 'react-native-maps';
import CustomActions from './CustomActions';

// import firestore/firebase
const firebase = require('firebase');
require('firebase/firestore');

/**
* @class chat
* @requires React
* @requires React-native
* @requires react-native-gifted-chat
* @requires react-native-community/async-storage
* @requires react-native-community/netinfo
* @requires react-native-maps
* @requires CustomActions from './CustomActions'
* @requires firebase
* @requires firestore
*/

export default class Chat extends React.Component {
  constructor() {
    super();
    this.state = {
      bgColor: '',
      messages: [],
      // user: {
      //   _id: "",
      //   name: "",
      //   avatar: "",
      // },
      uid: '',
      loggedInText: '',
      isConnected: false,
      image: null,
    };

    /**
    * firestore credentials
    * @param {string} apiKey
    * @param {string} authDomain
    * @param {string} databaseURL
    * @param {string} projectId
    * @param {string} storageBucket
    * @param {string} messageSenderId
    * @param {string} appId
    * @param {string} measurementId
    */
    if (!firebase.apps.length) {
      firebase.initializeApp({
        // firestore credentials
        apiKey: 'AIzaSyBu20jbshPKZgi9JH8O37YrmVD3mAuSOe4',
        authDomain: 'chatapp-2e14d.firebaseapp.com',
        projectId: 'chatapp-2e14d',
        storageBucket: 'chatapp-2e14d.appspot.com',
        messagingSenderId: '1076471906125',
        appId: '1:1076471906125:web:59d8aa5c59ee13b431c104',
        measurementId: 'G-H8FCZKYDE1',
      });
    }

    this.referenceMessages = firebase.firestore().collection('messages');
  }

  // initial params for componentDidMount
  init() {
    let { name, color } = this.props.route.params;
    this.props.navigation.setOptions({ title: 'Chat Room' });
    this.setState({
      bgColor: color, // background color
    });
  }

  /**
  * Updates the state of the message with the input
  * @function onCollectionUpdate
  * @param {string} _id - message id
  * @param {string} text - text message
  * @param {string} image - uri
  * @param {number} location - geo coordinates
  * @param {object} user - user data
  * @param {date} createdAt - a message creation time
  */
  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    // go through each document
    querySnapshot.forEach((doc) => {
      // get the QueryDocumentSnapshot's data
      const data = doc.data();

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
      messages,
    });
  };

  // checking inernet connection, on or off
  handleConnectivityChange = (state) => {
    const isConnected = state.isConnected;
    if (isConnected == true) {
      this.setState({
        isConnected: true,
      });
      this.unsubscribe = this.referenceMessages
        .orderBy('createdAt', 'desc')
        .onSnapshot(this.onCollectionUpdate);
    } else {
      this.setState({
        isConnected: false,
      });
    }
  };

  componentDidMount() {
    this.init(); // initial params
    NetInfo.addEventListener(state => {
      this.handleConnectivityChange(state);
    });

    NetInfo.fetch().then((state) => {
      const isConnected = state.isConnected;

      if (isConnected) {
        this.setState({
          isConnected: true,
        });

        this.authUnsubscribe = firebase.auth().onAuthStateChanged(async (user) => {
          if (!user) {
            await firebase.auth().signInAnonymously();
          }

          this.setState({
            uid: user.uid,
            messages: [],
          });

          this.unsubscribe = this.referenceMessages.orderBy('createdAt', 'desc').onSnapshot(this.onCollectionUpdate);
        });
      } else {
        // user is offline
        this.setState({
          isConnected: false,
        });

        this.getMessages();
      }
    });
  }

  componentWillUnmount() {
    this.authUnsubscribe();
    this.unsubscribe();
  }

  /**
  * @function onSend
  * @param {string} messages
  * @returns {state}
  */
  onSend(messages = []) {
    this.setState(
      (previousState) => ({
        messages: GiftedChat.append(previousState.messages, messages),
      }),

      () => {
        this.addMessages();
        this.saveMessages();
        // console.log(this.state.messages)
      },
    );
  }

  /**
  * If user is offline, loads all messages from async storage
  * @async
  * @function getMessages
  * @param {string} messages
  * @return {promise} offline date from storage
  */

  async getMessages() {
    let messages = '';
    try {
      messages = await AsyncStorage.getItem('messages') || [];
      this.setState({
        messages: JSON.parse(messages),
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  /**
  * Adds the message the firebase database
  * @function addMessage
  * @param {number} _id
  * @param {string} text
  * @param {date} createdAt
  * @param {object} user
  * @param {string} image
  * @param {number} geo
  */

  // Adding messages to the firebase database
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

  /**
  * Saves messages to AsyncStorage
  * @async
  * @function saveMessages
  * @param {string} messages
  * @return {promise} saved date
  */
  async saveMessages() {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error) {
      console.log(error.message);
    }
  }

  // deletes messages from AsyncStorage
  async deleteMessages() {
    try {
      await AsyncStorage.removeItem('messages');
      this.setState({
        messages: [],
      });
    } catch (error) {
      console.log(error.message);
    }
  }

  /**
  * Chat bubble
  *@function renderBubble
  *the background color of message bubbles, both sides
  */
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={
          {
            right: { backgroundColor: '#000' },
            left: { backgroundColor: '#fff' },
          }
        }
      />
    );
  }

/**
*does not render toolbar if user is offline
*@function renderInputToolbar
*/
  renderInputToolbar(props) {
    if (this.state.isConnected == false) {

    } else {
      return (
        <InputToolbar
          {...props}
        />
      );
    }
  }

  renderCustomActions = (props) => {
    return <CustomActions {...props} />;
  };

  // map view
  renderCustomView(props) {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={
            {
              width: 150,
              height: 100,
              borderRadius: 13,
              margin: 3,
            }
          }
          region={
            {
              latitude: currentMessage.location.latitude,
              longitude: currentMessage.location.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }
          }
        />
      );
    }
    return null;
  }

  render() {
    return (

      <View style={{ flex: 1, backgroundColor: this.state.bgColor }}>
        <Text>{this.state.loggedInText}</Text>
        { this.state.image
        && <Image
          source={{ uri: this.state.image.uri }}
          style={
            {
              width: 200,
              height: 200,
            }
          }
        />
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
  }
}
