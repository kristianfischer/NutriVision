import React, { createContext, useContext, useState } from "react";

interface MealContextValue {
  meal: string;
  setMeal: React.Dispatch<React.SetStateAction<string>>;
}
  
  const MealContext = createContext<MealContextValue | undefined>(undefined);
  
  export function useMeal() {
    return useContext(MealContext);
  }
  

export const MealProvider = ({ children } : {children:any}) => { // gives context of what meal is being pressed to each tab screen
    const [meal, setMeal] = useState<string>("breakast");
    return (
      <MealContext.Provider value={{meal, setMeal}}>
        {children}
      </MealContext.Provider>
    );
};
  
export const useMealContext = () => { // retrives context from mealprovider
  const onboardingContext = useContext(MealContext);
  if (onboardingContext === undefined) {
    throw new Error('useOnboardingContext must be inside a OnboardingProvider');
  }
  return onboardingContext;
};

