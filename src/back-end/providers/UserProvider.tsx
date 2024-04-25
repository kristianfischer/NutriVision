import React, { createContext, useContext } from "react";

const UserContext = createContext({}); //provides user context to each tab screen and meal provider, for authenticated user

export function useUser() {
    return useContext(UserContext);
}

export const UserContextProvider = ({user, children} : {user:any, children:any}) => {
    return (
        <UserContext.Provider value={{ user }}>
            {children}
        </UserContext.Provider>
    )
}

