import React from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Camera from "../../front-end/screens/CameraPage";
import { MyTabBar } from "./TabBar";
import Home from "../../front-end/screens/HomeScreen";
import Chat from "../../front-end/screens/Chatbot";
import { useContext } from 'react';
import { useMealContext } from '../../back-end/providers/MealProvider'


const { meal, setMeal } = useMealContext();
const Tab = createBottomTabNavigator();

const TabNavigator = () => { // sets up tab navigator structure, such as screen order and names
  return (
    <Tab.Navigator
      tabBar={props => <MyTabBar {...props} />}
      screenOptions={{
        headerShown: false
      }}
    >
      <Tab.Screen name = "Home" component={Home} options={{
        tabBarLabel: 'Home',
        }} />
      <Tab.Screen name="Camera"
      children={()=><Camera name={meal}/>} options={{
        tabBarLabel: 'Camera',
      }} />
      <Tab.Screen name="Chat" component={Chat} options={{
        tabBarLabel: 'Chat',
        }} />
      </Tab.Navigator>
  );
}

export default TabNavigator