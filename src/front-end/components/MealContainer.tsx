import * as React from "react";
import {useEffect, useState} from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { Image } from "expo-image";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation, ParamListBase } from "@react-navigation/native";
import MealPhoto from "./MealPhoto";
import { FontFamily, Border, Color, FontSize } from "../Constants";
import { getFirestore, doc, collection, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const db = getFirestore();

interface MealContainerProps { // props from HomeScreen
  t: any;
  name: any;
  reco: any;
  pressed: any;
  setMeal: React.Dispatch<React.SetStateAction<any>>;
}

const MealContainer: React.FC<MealContainerProps> = ({
  t,
  name,
  reco,
  pressed,
  setMeal
}) => {
  const currentUser = getAuth().currentUser;
    const curr = currentUser ? currentUser.uid : null;

  const styles = StyleSheet.create({
    groupChildLayout: {
      height: 81,
      width: 351,
      left: "50%",
      position: "absolute",
    },
    dinnerTypo: {
      textAlign: "center",
      fontFamily: FontFamily.poppinsRegular,
      left: "50%",
      position: "absolute",
    },
    groupChild: {
      marginLeft: -175.5,
      top: 0,
      borderRadius: Border.br_3xs,
      backgroundColor: Color.colorGray_400,
    },
    recommended000: {
      marginLeft: -103.5,
      top: 53,
      fontSize: FontSize.size_2xs,
      letterSpacing: 0.1,
      color: Color.colorSilver,
      width: 179,
    },
    dinner: {
      marginLeft: -116.5,
      top: 22,
      fontSize: FontSize.size_base,
      letterSpacing: 0.2,
      color: Color.colorWhite,
      width: 93,
      height: 19,
    },
    icon: {
      width: "100%",
      height: "100%",
    },
    wrapper: {
      left: 297,
      top: 24,
      width: 34,
      height: 34,
      position: "absolute",
    },
    rectangleParent: {
      marginLeft: -176,
      top: t,
    },
  });

  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const fetchImageUrl = async () => { // gets image from database if there is one
      try {
        // Assuming getImageUrlFromFirestore is an asynchronous function
        const url = await getImageUrlFromFirestore({ user:curr });
        setImageUrl(url);
      } catch (error) {
        console.error("Error fetching image URL:", error);
      }
    };

    fetchImageUrl();
  }, []);

  const getImageUrlFromFirestore = async ({user} : {user:any}) => { // helper function
    try {
      const docRef = doc(db, "users", user);
      const imagesCollectionRef = collection(docRef, 'images');

      const currentDate = new Date();
      const formattedDate = currentDate.toISOString().split('T')[0]; // Extract YYYY-MM-DD format

      const documentName = `${name.toLowerCase()}_${formattedDate}`;

      console.log(documentName)

      // Reference to the specific image document within the images subcollection
      const imageDocRef = doc(imagesCollectionRef, documentName)
      const docSnap = await getDoc(imageDocRef);
  
      if (docSnap.exists()) {
        // Extract imageUrl from the document data
        console.log(docSnap.data().url)
        return docSnap.data().url
      } else {
        console.log('No such document!');
        return null;
      }
    } catch (error) {
      console.error('Error getting document:', error);
      return null;
    }
  };

  return ( // returns UI of either breakfast, lunch, or dinner component
    <Pressable style={[styles.rectangleParent, styles.groupChildLayout]} onPress={!pressed ? ()=>setMeal(name.toLowerCase()) : null}>
      <View style={[styles.groupChild, styles.groupChildLayout]} />
      <Text style={[styles.recommended000, styles.dinnerTypo]}>
        Recommended: {reco} cal
      </Text>
      <Text style={[styles.dinner, styles.dinnerTypo]}>{name}</Text>
      <Pressable
        style={styles.wrapper}
      >
        <Image  
          style={styles.icon}
          contentFit="cover"
          source={pressed ? require("../../../assets/group-44.png") : require("../../../assets/group-5.png")}
        />
      </Pressable>
      {!pressed ? (
        <MealPhoto
          layer2={
            name === "Breakfast"
              ? require("../../../assets/sandwich.png")
              : name === "Lunch"
              ? require("../../../assets/salad.png")
              : require("../../../assets/layer-2.png")
          }
          hotpotPosition="absolute"
          hotpotWidth={68}
          hotpotHeight={85}
          hotpotTop={6}
          hotpotLeft={3}
          layer2IconHeight="51.71%"
          layer2IconWidth="78.38%"
          layer2IconTop="24.43%"
          layer2IconRight="10.44%"
          layer2IconBottom="23.86%"
          layer2IconLeft="11.18%"
          frameViewTop="98.29%"
          frameViewRight="-10.59%"
          frameViewBottom="-98.29%"
          frameViewLeft="10.59%"
        />
      ) : (
        <MealPhoto
        layer2={
          name === "Breakfast"
            ? {uri: "https://"+imageUrl}
            : name === "Lunch"
            ? {uri: "https://"+imageUrl}
            : {uri: "https://"+imageUrl}
        }
        hotpotPosition="absolute"
        hotpotWidth={68}
        hotpotHeight={85}
        hotpotTop={6}
        hotpotLeft={3}
        layer2IconHeight="51.71%"
        layer2IconWidth="78.38%"
        layer2IconTop="24.43%"
        layer2IconRight="10.44%"
        layer2IconBottom="23.86%"
        layer2IconLeft="11.18%"
        frameViewTop="98.29%"
        frameViewRight="-10.59%"
        frameViewBottom="-98.29%"
        frameViewLeft="10.59%"
      />
      )}
    </Pressable>
  );
};

export default MealContainer;
