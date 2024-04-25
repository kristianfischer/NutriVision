import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Camera } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore, setDoc, doc, collection, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import 'firebase/storage';
import { getAuth } from "firebase/auth";
import axios from 'axios';
import { useMealContext } from '../../back-end/providers/MealProvider'

const db = getFirestore();
const storage = getStorage();

const CameraComponent = ({name} : {name:any}) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraRef, setCameraRef] = useState<Camera | null>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const { meal, setMeal } = useMealContext();

  useEffect(() => { // check for permissions
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const fetchAIResponse = async ({ image }: { image: any }) => { // send image from firebase storage to open ai vision model
    const apiKey = process.env.OPEN_AI_API_KEY
    try {
      const result = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          "model": "gpt-4-vision-preview",
          "messages": [
            {
              "role": "user",
              "content": [
                {
                  "type": "text",
                  "text": "Return the number of calories in this meal, as well as the approximate carbs, protein, and fat in grams. I understand you cannot know for certain, but please return your best estimate. If it is not a picture of food, return zero for all values. The data must be returned only in the following format, with no other words: calories,carbs,protein,fat"
                },
                {
                  "type": "image_url",
                  "image_url": {
                    "url": image
                  }
                }
              ]
            }
          ],
          "max_tokens": 300
        },
        {
          "headers": { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
        },
      )
      console.log(result.data.choices[0].message.content)
      return result.data.choices[0].message.content
    } catch (error) {
      console.error('Error fetching AI response:', error)
    }
  }

  const uploadImage = async ({ uri, user }: { uri: any, user:any }) => { // upload image data to storage for api usage
    try {
        const blob = await fetch(uri).then((response) => response.blob());
        const storageRef = ref(storage, `images/${user}_${name}_${Date.now()}.jpg`);
        await uploadBytes(storageRef, blob);
      
        // Get public URL of the uploaded image
        const imageUrl = await getDownloadURL(storageRef);
      
        return imageUrl;
    } catch (error) {
        console.error("Error uploading image:", error);
        throw error;
    }
};
  
const saveImageUrlInFirestore = async ({ image, user, response }: { image: any, user: any, response: any }) => { // daves public download link of image to firestore
  try {
      // Get a reference to the user document
    const userDocRef = doc(db, "users", user);
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString().split('T')[0]; // Extract YYYY-MM-DD format

    const documentName = `${name}_${formattedDate}`;

      // Add the image URL to the "images" subcollection within the user document
      const imagesCollectionRef = collection(userDocRef, "images");
      const newDocRef = doc(imagesCollectionRef, documentName);
      await setDoc(newDocRef, { url: image, response: response });

      console.log("Image URL saved successfully in Firestore");
  } catch (error) {
      console.error("Error saving image URL in Firestore:", error);
  }
  };


  const takePicture = async () => {
    if (cameraRef) {
      const photo = await cameraRef.takePictureAsync();
      setPhotoUri(photo.uri); // Save the captured photo URI
    }
  };

  const confirm = async () => { // confirm photo, send to firebase storage and firestore, and use the data to capture async storage
    const currentUser = getAuth().currentUser;
    const curr = currentUser ? currentUser.uid : null;

    const imageUrl = await uploadImage({ uri: photoUri, user: curr });
    
    // Call a function to get a number
    const number = await fetchAIResponse({ image: imageUrl });
    const arr = number.split(",")
    
    // Check if it's a new day
      // Reset values or perform actions specific to a new day
      const mealDataString = await AsyncStorage.getItem('mealData');
      // Add the number to AsyncStorage with key "breakfast"
    const mealData = mealDataString ? JSON.parse(mealDataString) : {};
    
    console.log(meal in mealData)
    
    if (mealData[meal] == 0 && meal in mealData) {
      await saveImageUrlInFirestore({ image: imageUrl.substring(8, imageUrl.length-1), user: curr, response: number });
      mealData[meal] += parseInt(arr[0]);
      mealData["carbs"] += parseInt(arr[1]);
      mealData["protein"] += parseInt(arr[2]);
      mealData["fat"] += parseInt(arr[3]);
    }

    console.log(mealData[meal])
      // Store updated meal data back into AsyncStorage
    await AsyncStorage.setItem('mealData', JSON.stringify(mealData));
    
    const currentDate = new Date().toISOString().split('T')[0];
      
    // Update lastDate 
    await AsyncStorage.setItem('lastDate', currentDate)
  }

  const retakePicture = () => {
    setPhotoUri(null); // Reset the photo URI to allow retaking
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      {!photoUri ? ( // Render camera preview if no photo is captured
        <Camera
          style={styles.camera}
          ref={(ref) => setCameraRef(ref)}
        />
      ) : ( // Render captured photo if available
        <Image source={{ uri: photoUri }} style={styles.image} />
      )}
      {!photoUri ? ( // Render capture button if no photo is captured
        <TouchableOpacity style={styles.button1} onPress={takePicture}>
        </TouchableOpacity>
      ) : ( // Render confirm and retake buttons if photo is captured
        <View style={styles.buttonsContainer}>
          <TouchableOpacity style={styles.button2} onPress={retakePicture}>
            <Text style={styles.text}>    New</Text>
          </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={confirm}>
            <Text style={styles.text}> Confirm</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  image: {
    flex: 1,
    width: '100%',
  },
  button: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 40,
    marginVertical: 10,
    marginRight: 50,
    width:121
  },
  button2: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 40,
    marginVertical: 10,
    marginRight: 50,
    width: 120,
    marginLeft: 30
  },
  button1: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 40,
    marginVertical: 10,
    width: 80,
    height: 80,
    paddingBottom: 10
  },
  text: {
    color: 'black',
    fontSize: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
  },
});

export default CameraComponent;
