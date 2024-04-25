// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getReactNativePersistence } from "firebase/auth"
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { initializeAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCi4QjJ2A4rOQP4jpILuna-vzr0aXjEkEg",
  authDomain: "nutrivision-33846.firebaseapp.com",
  projectId: "nutrivision-33846",
  storageBucket: "nutrivision-33846.appspot.com",
  messagingSenderId: "535842695202",
  appId: "1:535842695202:web:60de14d029c67fd54d427b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  })
  
getFirestore(app);
getStorage(app);