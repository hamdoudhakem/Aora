import React, { createContext, useContext, useState, useEffect } from "react";
import { Alert } from "react-native";
import { getUser } from "lib/appwrite";
import { Models } from "react-native-appwrite";

const GlobalContext = createContext(null);

export const useGlobalContext = () => useContext(GlobalContext);

export const globalProvider = ({ children } : {children : React.ReactNode}) => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [user, setUser] = useState<Models.Document>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getUser()
            .then((user) => {
                if(user){
                    setLoggedIn(true)
                    setUser(user)
                }else{
                    setLoggedIn(false)
                    setUser(null)
                }
            })
            .catch((error) => {
                Alert.alert('An error occured while fetching user', error.message)
            })
            .finally(() => {
                setIsLoading(false)
            })     
    }, [])    

    return (       
        <GlobalContext.Provider 
            value={{
                loggedIn,
                setLoggedIn,
                user,
                setUser,
                isLoading,
            }}
        >
            {children}
        </GlobalContext.Provider>
    )
}
