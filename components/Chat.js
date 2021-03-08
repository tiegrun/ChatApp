import React from 'react';
import { View, Text, StyleSheet} from 'react-native';

export default class Chat extends React.Component {

  state = {
    bgColor: '',
  };

  init() {
    let { name, color } = this.props.route.params;
    this.props.navigation.setOptions({ title: name});
    this.setState({
      bgColor: color,
    })
  }

  componentDidMount() {
    this.init()
  }

  render() {
   
    return (

     <View style={ [ styles.container, { backgroundColor: this.state.bgColor } ] }>
        <Text>Hello Chat!</Text>
      </View>
      
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})