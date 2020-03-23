import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import itemList from './src/itemList';
import login from './src/login';
import signup from './src/signup';
import newItem from './src/newItem';



const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="itemList">
        <Stack.Screen name="login" component={login} />
        <Stack.Screen name="signup" component={signup}/>
        <Stack.Screen name="itemList" component={itemList}/>
        <Stack.Screen name="newItem" component={newItem}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
