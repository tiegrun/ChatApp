Chat App created by React Native

# Chat App created by React Native

## Installation

At first install [expo](https://expo.io/), by running:

```sh
npm install expo-cli -g
```

To run the app locally,

```sh
expo start
```

## Dependencies

```sh
"@react-native-community/async-storage":
"@react-native-community/masked-view":
"@react-native-community/netinfo":
"@react-navigation/native":
"@react-navigation/stack":
"expo":
"expo-image-picker":
"expo-location":
"expo-permissions":
"expo-status-bar":
"firebase":
"react":
"react-dom":
"react-native":
"react-native-gesture-handler":
"react-native-gifted-chat":
"react-native-maps":
"react-native-reanimated":
"react-native-safe-area-context":
"react-native-screens":
"react-native-web":
"react-navigation":
```

## Setup firebase

- Go to Google Firebase and click on "Sign in" in the upper-right corner. (https://firebase.google.com/)
- Click on the "Go to console" link and click on "Create Project"
  (A form will appear asking you to fill basic in information about your new project)
- Give your project a name. With the default settings selected,
  agree to the terms and click “Create Project.”
- Create a database, click on “Firestone” from the menu on the left-hand side then select "Create database".
- Choose “Create database” in the Cloud Firestore section.

Before you can start throwing data into it, you first need to set up some security rules
for your database. The default is “Start in production mode,” which makes your database private.
With this option, you’d need to create your own security rules for reading and writing data.
Or you can choose “Start in test mode” option.

Kanban: https://trello.com/b/kMzs1olU/native-chat-app
