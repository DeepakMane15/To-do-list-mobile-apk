import { StatusBar } from 'expo-status-bar';
import React from 'react';

import { Authenticate,TasksList } from './components';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <>

    <NavigationContainer>
    <Stack.Navigator>
    {/* <Stack.Screen
       name="Home"
       component={Authenticate}
    />  */}
    <Stack.Screen
       name="Tasks"
       component={TasksList}
    />        
              
    </Stack.Navigator>
    
  </NavigationContainer>
  </>
  );
};
