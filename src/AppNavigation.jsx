import { View, Text } from 'react-native'
import React, {useContext} from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { NavigationContainer } from "@react-navigation/native";
import Home from './screens/Home';
import AddToken from './components/AddToken';
import Barcode from './components/Barcode2';
import Barcode_Item from './components/Barcode_Item'
import Settings from './screens/Settings';
import { Ionicons  } from '@expo/vector-icons';
import themeContext from "./config/themeContext";
import About from './components/About';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigation = () => {
  const theme = useContext(themeContext);
  return (
    <Tab.Navigator screenOptions={{headerTintColor: '#0078d4', headerTitleAlign: 'center', headerStyle: {backgroundColor: theme.background}, tabBarInactiveTintColor: 'gray', tabBarActiveTintColor: '#0078d4', tabBarLabelStyle: { fontSize: 18, fontWeight: 'bold'}, tabBarStyle: {backgroundColor: theme.background}}}>
      <Tab.Screen
        name='Home'
        component={Home}
        options={{headerShown: false, tabBarIcon: ({color, size}) => (<Ionicons  name="home" size={20} color={color} />)}}
      />
      <Tab.Screen
        name='Settings'
        component={Settings}
        options={{tabBarIcon: ({color, size}) => (<Ionicons  name="settings-sharp" size={20} color={color} />)}}
      />
    </Tab.Navigator>
  )
}

const AppNavigation = () => {
  const theme = useContext(themeContext);
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={
        {headerTintColor: '#0078d4', headerTitleAlign: 'center', headerStyle: {backgroundColor: theme.background},}
      }>
        <Stack.Screen
          name='Home2'
          component={TabNavigation}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name='AddToken'
          component={AddToken}
        />
        <Stack.Screen
          name='Barcode_item'
          component={Barcode_Item}
        />
        <Stack.Screen
          name='Barcode'
          component={Barcode}
        />
        <Stack.Screen
          name='About'
          component={About}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AppNavigation