import React from 'react';
import SignUpScreen from './SignUpScreen';
import { useEffect, useState } from 'react';
import { User, getAuth, onAuthStateChanged } from "firebase/auth";
import "./firebaseConfig"
import { UserContextProvider } from './src/back-end/providers/UserProvider';
import TabNavigator from './src/back-end/navigation/TabNavigator';
import { NavigationContainer } from '@react-navigation/native';
import {MealProvider} from './src/back-end/providers/MealProvider'

type UserState = User | null;

export default function App() { // Generates React Native application, checks for user authentication. If authenticated, brings them into app, otherwise, login screen
  const [user, setUser] = useState<UserState>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setAuthChecked(true);
    });
  
    return () => {
      unsubscribe();
    };
  }, []);
  
  if (!authChecked) return null;
  if (user === null) return <SignUpScreen setUser={setUser} />

  return (
    <NavigationContainer>
      <UserContextProvider user={user}>
        <MealProvider>
          <TabNavigator />
        </MealProvider>
      </UserContextProvider>
    </NavigationContainer>
  );
}

