import { Image, ScrollView, StatusBar, Text, View } from "react-native";
import { Redirect, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../constants";
import {CustomButton} from "../components";
import { useGlobalContext } from 'context/GlobalProvider';

export default function Page() {
  const {isLoading, loggedIn} = useGlobalContext()

  if(!isLoading && loggedIn) return <Redirect href="/home" />

  return (      
    <>
      <StatusBar barStyle="light-content" />
      <SafeAreaView className="h-full bg-primary">
        <ScrollView>
          <View className="w-full min-h-[85vh] justify-center items-center px-4">
            <Image
              source={images.logo}
              className="h-[84px] w-[130px]"
              resizeMode="contain"
            />
            <Image
              source={images.cards}
              className="max-w--[380px] w-full h-[300px]"
              resizeMode="contain"
            />

            <View className="relative mt-5">
              <Text className="text-3xl text-white font-bold text-center">
                Discover Endless Possiblities with
                <Text className="text-secondary-200"> Aora</Text>
              </Text>
              <Image
                source={images.path}
                className="w-[136px] h-[15px] absolute -bottom-2 -right-8"
                resizeMode="contain"
              />
            </View>

            <Text className="text-sm font-pregular text-gray-100 mt-7 text-center">
              Where Creativity meets innovation: Embark on a journey of limitless
              exploration with Aora
            </Text>

            <CustomButton
              title="Continue with Email"
              containerStyles="w-full mt-7"
              handlePress={() => router.push("./sign-in")}
            />
          </View>
        </ScrollView>      
     </SafeAreaView> 
    </>    
  );
}
