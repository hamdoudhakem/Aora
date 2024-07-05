import { ScrollView, StyleSheet, Text, View, Image, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, router } from "expo-router";
import { images } from "../../constants";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import * as appwrite from "lib/appwrite"
import { useGlobalContext } from "context/GlobalProvider";
import { Models } from "react-native-appwrite";
import { UsersType } from "lib/types";

export default function SignIn() {
  const { setUser, setLoggedIn } : { 
    setUser : (user : Models.Document & UsersType) => void, 
    setLoggedIn 

  }  = useGlobalContext();   

  const [form, setForm] = useState({ email: "", password: "" });
  const [useSubmiting, setUseSubmiting] = useState(false);

  const submit = async () => {
    if(form.email === "" || form.password === "") {
      Alert.alert("Please fill all the fields");
      return;
    }

    setUseSubmiting(true);
            
    try{
      await appwrite.login(form.email, form.password)
          
      const result = await appwrite.getUser();
      setUser(result);
      setLoggedIn(true);

      router.replace('/home');      
    }catch(err){
      Alert.alert("An error occured while logging in", err.message);
    }       
            
    setUseSubmiting(false);
    
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView keyboardShouldPersistTaps={"handled"}>
        <View className="w-full justify-center min-h-[83vh] my-6 px-4">
          <Image
            source={images.logo}
            resizeMode="contain"
            className="w-[115px] h-[35px]"
          />

          <Text className="text-2xl text-semibold text-white mt-10 font-psemibold">
            Log into Aora
          </Text>

          <FormField
            title="Email"
            value={form.email}
            handleTextChange={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-adress"
          />
          <FormField
            title="Password"
            value={form.password}
            handleTextChange={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
          />

          <CustomButton
            title="Sign In"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={useSubmiting}
          />           

          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Don't have an account?
            </Text>
            <Link
              href={"./sign-up"}
              className="text-lg font-psemibold text-secondary"
            >
              Sign Up
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});
