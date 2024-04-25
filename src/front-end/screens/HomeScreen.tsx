import * as React from "react";
import { useState, useEffect } from 'react';
import { Image } from "expo-image";
import { StyleSheet, Text, View, Pressable, ScrollView } from "react-native";
import StatsContainer from "../components/StatsContainer";
import MealContainer from "../components/MealContainer";
import { Color, FontSize, FontFamily, Border } from "../Constants";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useMealContext } from '../../back-end/providers/MealProvider'

const currentDate = new Date();
const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
const formattedDate = `TODAY, ${monthNames[currentDate.getMonth()]} ${currentDate.getDate().toString().padStart(2, '0')}`;


const HomeScreen = () => {
// dyanmic variable UseStates
const [caloriesTotal, setCalories] = useState(0);
const [breakfast, setB] = useState(0);
const [lunch, setL] = useState(0);
const [dinner, setD] = useState(0);
const [carbs, setCarbs] = useState(0);
const [protein, setProtein] = useState(0);
const [fat, setFat] = useState(0);
const { meal, setMeal } = useMealContext();

  const clear = async () => {
    const resetMap = { breakfast: 0, lunch: 0, dinner: 0, carbs: 0, protein: 0, fat: 0 };
        await AsyncStorage.setItem('mealData', JSON.stringify(resetMap));
  }
  
useFocusEffect( // calls this function each time the tab is pressed, not on render
  React.useCallback(() => {
    const resetDailyValues = async () => { // Either refreshes map on a new day, or gets values from map to display in UI
      // Check if it's a new day 
      console.log(meal)
      const currentDate = new Date().toISOString().split('T')[0];
      const lastDate = await AsyncStorage.getItem('lastDate');
      console.log(lastDate, String(currentDate))
      if (lastDate !== currentDate) {
        // Reset values of map to 0 if it's a new day
        clear(); 
      } else {      
        console.log("same day")
        // Retrieve meal data from AsyncStorage
        const mealDataString = await AsyncStorage.getItem('mealData');
        const mealData = mealDataString ? JSON.parse(mealDataString) : {};
        console.log(mealData)
        // Calculate total calories
        const totalCalories = mealData["breakfast"] + mealData["lunch"] + mealData["dinner"];
        setB(mealData["breakfast"])
        setL(mealData["lunch"])
        setD(mealData["dinner"])
        setCarbs(mealData["carbs"])
        setProtein(mealData["protein"])
        setFat(mealData["fat"])
        setCalories(totalCalories);
        console.log(totalCalories)  
        console.log(meal)
      }
    };
    resetDailyValues();
  }, [])
); 

  return ( // returns homescreen with all components
    <ScrollView style={styles.homeScreen}>
      <View style={[styles.maskGroupParent, styles.maskGroupPosition]}>
        <Image
          style={[styles.maskGroupIcon, styles.maskGroupPosition]}
          contentFit="cover"
          source={require("../../../assets/mask-group.png")}
        />
        <Text style={[styles.text, styles.textFlexBox]}>{2000 - caloriesTotal}</Text>
        <Text style={[styles.text1, styles.textTypo]}>{caloriesTotal > 999 ? caloriesTotal.toString().substring(0, 1) + "." + caloriesTotal.toString().substring(1, 2) + "k": caloriesTotal}</Text>
        <Text style={[styles.text2, styles.textTypo]}>2k</Text>
        <Text style={[styles.eaten, styles.goalTypo]}>EATEN</Text>
        <Text style={[styles.calLeft, styles.goalTypo]}>CAL LEFT</Text>
        <Text style={[styles.goal, styles.goalTypo]}>GOAL</Text>
        <Image
          style={styles.calendarIcon}
          contentFit="cover"
          source={require("../../../assets/calendar.png")}
        />
        <Text style={[styles.todayMar07, styles.seeMealsTypo]}>
          {formattedDate}
        </Text>
        <StatsContainer
          carbs={carbs}
          protein={protein}
          fat={fat} />
        <MealContainer  
          t={525}
          name={"Breakfast"}
          reco={"300 - 500"}
          pressed={breakfast!=0 ? true : false}
          setMeal={setMeal}
        />
        <MealContainer
          t={625}
          name={"Lunch"}
          reco={"500 - 800"}
          pressed={lunch != 0 ? true : false}
          setMeal={setMeal}
        />
        <MealContainer
          t={725}
          name={"Dinner"}
          reco={"800 - 1000"}
          pressed={dinner != 0 ? true : false}
          setMeal={setMeal}
          />
        <Image
          style={[styles.frameChild, styles.todayMar07Position]}
          contentFit="cover"
          source={require("../../../assets/ellipse-1.png")}
        />
        <View style={[styles.nutrivisionParent, styles.nutrivisionPosition]}>
          <Text style={[styles.nutrivision, styles.nutrivisionPosition]}>
            NutriVision
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  maskGroupPosition: {
    width: 418,
    top: 0,
    position: "absolute",
  },
  textFlexBox: {
    textAlign: "center",
    color: Color.colorSnow,
  },
  textTypo: {
    height: 43,
    width: 85,
    letterSpacing: 2.2,
    fontSize: FontSize.size_17xl,
    top: 196,
    textAlign: "center",
    color: Color.colorSnow,
    fontFamily: FontFamily.caladeaRegular,
    left: "50%",
    position: "absolute",
  },
  goalTypo: {
    height: 22,
    fontFamily: FontFamily.poppinsRegular,
    letterSpacing: -0.1,
    fontSize: FontSize.size_sm,
    width: 85,
    textAlign: "center",
    color: Color.colorSnow,
    left: "50%",
    position: "absolute",
  },
  seeMealsTypo: {
    fontFamily: FontFamily.poppinsRegular,
    textAlign: "center",
  },
  groupPosition: {
    height: 81,
    width: 351,
    marginLeft: -176,
    left: "50%",
    position: "absolute",
  },
  groupChildLayout: {
    marginLeft: -175.5,
    height: 81,
    width: 351,
  },
  groupChildPosition: {
    backgroundColor: Color.colorGray_400,
    left: "50%",
    top: 0,
    position: "absolute",
  },
  recommendedTypo: {
    width: 179,
    color: Color.colorSilver,
    letterSpacing: 0.1,
    fontSize: FontSize.size_2xs,
    fontFamily: FontFamily.poppinsRegular,
    textAlign: "center",
    left: "50%",
    position: "absolute",
  },
  snackTypo: {
    height: 19,
    width: 93,
    color: Color.colorWhite,
    letterSpacing: 0.2,
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.poppinsRegular,
    textAlign: "center",
    left: "50%",
    position: "absolute",
  },
  wrapperLayout: {
    height: 34,
    width: 34,
    top: 24,
    position: "absolute",
  },
  iconLayout: {
    maxHeight: "100%",
    maxWidth: "100%",
    overflow: "hidden",
  },
  seePosition: {
    marginLeft: -45,
    height: 21,
    left: "50%",
    position: "absolute",
  },
  todayMar07Position: {
    left: "50%",
    position: "absolute",
  },
  nutrivisionPosition: {
    height: 56,
    left: "50%",
    position: "absolute",
  },
  viewSpaceBlock: {
    marginLeft: -209,
    width: 418,
  },
  iconLayout1: {
    height: "100%",
    width: "100%",
  },
  parentLayout: {
    width: 53,
    position: "absolute",
  },
  iconPosition: {
    width: 20,
    top: 0,
    position: "absolute",
    overflow: "hidden",
  },
  homePosition: {
    height: 16,
    marginLeft: -26.5,
    width: 53,
    color: Color.colorSilver,
    letterSpacing: 0.1,
    fontSize: FontSize.size_2xs,
    fontFamily: FontFamily.poppinsRegular,
    textAlign: "center",
    left: "50%",
    position: "absolute",
  },
  maskGroupIcon: {
    left: 0,
    height: 435,
  },
  text: {
    marginLeft: -68,
    top: 186,
    fontSize: FontSize.size_29xl,
    letterSpacing: 2.9,
    width: 136,
    height: 53,
    fontFamily: FontFamily.caladeaRegular,
    textAlign: "center",
    color: Color.colorSnow,
    left: "50%",
    position: "absolute",
  },
  text1: {
    marginLeft: -184,
  },
  text2: {
    marginLeft: 96,
  },
  eaten: {
    top: 237,
    height: 22,
    marginLeft: -184,
  },
  calLeft: {
    marginLeft: -43,
    top: 234,
  },
  goal: {
    top: 237,
    height: 22,
    marginLeft: 96,
  },
  calendarIcon: {
    top: 486,
    left: 142,
    width: 15,
    height: 15,
    position: "absolute",
    overflow: "hidden",
  },
  todayMar07: {
    marginLeft: -46,
    top: 484,
    fontSize: FontSize.size_smi,
    letterSpacing: 1.4,
    color: "#adaeb0",
    left: "50%",
    position: "absolute",
  },
  groupChild: {
    borderRadius: Border.br_3xs,
    marginLeft: -175.5,
    height: 81,
    width: 351,
  },
  recommended000: {
    marginLeft: -105.5,
    top: 49,
  },
  snack: {
    marginLeft: -119.5,
    top: 17,
    height: 19,
    width: 93,
    color: Color.colorWhite,
    letterSpacing: 0.2,
    fontSize: FontSize.size_base,
  },
  wrapper: {
    left: 296,
  },
  rectangleParent: {
    left: "50%",
    position: "absolute",
    top: 0,
  },
  groupParent: {
    top: 824,
  },
  lunch: {
    marginLeft: -118.5,
    top: 17,
    height: 19,
    width: 93,
    color: Color.colorWhite,
    letterSpacing: 0.2,
    fontSize: FontSize.size_base,
  },
  recommended0001: {
    marginLeft: -102.5,
    top: 48,
  },
  container: {
    left: 297,
  },
  rectangleGroup: {
    top: 623,
  },
  breakfast: {
    marginLeft: -104.5,
    top: 15,
  },
  recommended0002: {
    marginLeft: -100.5,
    top: 46,
  },
  sandwichIcon: {
    height: "56.42%",
    width: "13.68%",
    top: "18.52%",
    right: "82.62%",
    bottom: "25.06%",
    left: "3.7%",
    position: "absolute",
  },
  rectangleContainer: {
    top: 523,
  },
  seeMeals: {
    width: 81,
    height: 21,
    fontFamily: FontFamily.poppinsRegular,
    textAlign: "center",
    letterSpacing: -0.1,
    fontSize: FontSize.size_sm,
    marginLeft: -45,
    color: Color.colorSnow,
    top: 0,
  },
  arrowIcon: {
    marginTop: -2.5,
    top: "50%",
    left: 80,
    width: 10,
    height: 5,
    position: "absolute",
  },
  seeMealsParent: {
    top: 352,
    width: 90,
    height: 21,
  },
  frameChild: {
    marginLeft: -93,
    top: 123,
    width: 185,
    height: 185,
  },
  nutrivision: {
    marginLeft: -144.5,
    fontSize: FontSize.size_9xl,
    fontWeight: "700",
    fontFamily: FontFamily.quicksandBold,
    width: 255,
    textAlign: "center",
    color: Color.colorSnow,
    top: 0,
  },
  icon3: {
    height: "100%",
    width: "100%",
  },
  user: {
    left: "88.24%",
    top: "7.14%",
    right: "0%",
    bottom: "33.93%",
    width: "11.76%",
    height: "58.93%",
    position: "absolute",
  },
  nutrivisionParent: {
    marginLeft: -128,
    shadowColor: "rgba(0, 0, 0, 0.25)",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 4,
    elevation: 4,
    shadowOpacity: 1,
    width: 289,
    top: 48,
  },
  maskGroupParent: {
    left: -14,
    height: 781,
  },
  homeScreen: {
    backgroundColor: Color.colorGray_500,
    flex: 1,
    height: 844,
    overflow: "hidden",
    width: "100%",
  },
});

export default HomeScreen;
