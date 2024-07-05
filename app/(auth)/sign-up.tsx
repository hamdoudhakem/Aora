import { ScrollView, StyleSheet, Text, View, Image,Alert } from "react-native";
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

export default function SignUp() {
  const { setUser, setLoggedIn } : { 
    setUser : (user : Models.Document & UsersType) => void, 
    setLoggedIn 

  }  = useGlobalContext();   
   

  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [useSubmiting, setUseSubmiting] = useState(false);

  const submit = async () => {
    if(form.username === "" || form.email === "" || form.password === "") {
      Alert.alert("Please fill all the fields");
      return;
    }

    setUseSubmiting(true);

    try{
      await appwrite.register(form.email, form.password, form.username);  

      const result = await appwrite.getUser();
      setUser(result);
      setLoggedIn(true);

      console.log("I created a new User!")     
      
      router.replace('/home');      
    }catch(err){
      Alert.alert("An error occured while creating a new user", err.message);      
    }finally{
      setUseSubmiting(false);
    }   
    
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
            Sign Up to Aora
          </Text>

          <FormField
            title="Username"
            value={form.username}
            handleTextChange={(e) => setForm({ ...form, username: e })}
            otherStyles="mt-11"
          />
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
            title="Sign Up"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={useSubmiting}
          />

          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Have an Account already
            </Text>
            <Link
              href={"./sign-in"}
              className="text-lg font-psemibold text-secondary"
            >
              Sign In
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({});