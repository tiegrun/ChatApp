import React from 'react';
import { View, Platform, KeyboardAvoidingView, Text, StyleSheet} from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';

export default class Chat extends React.Component {

  constructor() {
    super();
    this.state = {
      bgColor: '',
      messages: [],
    }
  }
  
  init() {
    let { name, color } = this.props.route.params;
    this.props.navigation.setOptions({ title: 'Chat Room'});
    this.setState({
      bgColor: color,

      messages: [
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
         },
         {
          _id: 2,
          text: `${name} has entered the chat`,
          createdAt: new Date(),
          system: true,
         },
      ],
    })
  }

  componentDidMount() {

    this.init();

  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
  }

  renderBubble(props) {
    return (
      <Bubble {...props} wrapperStyle={{right: {backgroundColor: '#000'}}}/>
    )
  }

  render() {
   
    return (

    //  <View style={ [ styles.container, { backgroundColor: this.state.bgColor } ] }>
    //     <Text>Hello Chat!</Text>
    //   </View>

    <View style={{flex: 1, backgroundColor: this.state.bgColor }}>
      <GiftedChat 
        renderBubble={this.renderBubble.bind(this)}
        messages={this.state.messages} 
        onSend={messages => this.onSend(messages)}
        user={{
          _id: 1,
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