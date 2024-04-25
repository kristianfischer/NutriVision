import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Octicons } from '@expo/vector-icons'; 


export function MyTabBar({ state, descriptors, navigation }  : {state:any, descriptors:any, navigation:any}) { // sets up routes for tab bar navigation, as well as their icons
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route:any, index:any) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;
        
        
        const icon = options.tabBarIcon;

        const isFocused = state.index === index;

        const onPress = () => { // active navigation after tab press
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate({ name: route.name, merge: true });
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabBarItem}
            key={route.name}
          >
            <View>
            <Octicons  
              name={route.name == "Home" ? "home" : route.name == "Camera" ? "device-camera" : "dependabot"}
              size={25} 
              color={isFocused? "green" : "black"}
              />
            <Octicons
              name= "dash"
              size={15} 
              color= {"white"} 
              />
              </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    height: 65,
    backgroundColor: 'white',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabBarItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});