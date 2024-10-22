import React, { useEffect } from "react";
import { Image, ScrollView, StatusBar, Text, View, LogBox } from "react-native";
import { Redirect, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { images } from "../constants";
import { CustomButton } from "../components";
import { useGlobalContext } from "context/GlobalProvider";

// Ignore "NativeEventEmitter" log notification caused by Notifee
// not updating to the latest version of React Native
LogBox.ignoreLogs(["new NativeEventEmitter"]);

export default function Page() {
  const { isLoading, loggedIn } = useGlobalContext();

  if (!isLoading && loggedIn) return <Redirect href="/home" />;

  const angle = useSharedValue(0);
  const fade = useSharedValue(0);
  const fadePosX = useSharedValue(40);
  const fadePosY = useSharedValue(-40);

  useEffect(() => {
    angle.value = withDelay(1200, withSpring(360));
    fadePosX.value = withTiming(0, {
      duration: 1200,
      easing: Easing.linear,
    });
    fadePosY.value = withTiming(5, {
      duration: 1200,
      easing: Easing.linear,
    });
    fade.value = withTiming(1, {
      duration: 1500,
      easing: Easing.elastic(1.3),
    });
  }, []);

  const rotationStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${interpolate(angle.value, [0, 360], [0, 360])}deg` },
      ],
    };
  });

  return (
    <>
      <StatusBar barStyle="light-content" />
      <SafeAreaView className="h-full bg-primary">
        <ScrollView>
          <View className="w-full min-h-[85vh] justify-center items-center px-4">
            <View className="flex-row items-center">
              <Animated.Image
                source={images.logoSmall}
                className="h-[40px] w-[55px]"
                resizeMode="contain"
                style={rotationStyle}
              />
              <Text className="text-[40px] text-white font-bold">Aora</Text>
            </View>
            <Animated.Image
              source={images.cards}
              className="max-w--[380px] w-full h-[300px]"
              resizeMode="contain"
              style={{
                opacity: fade,
                transform: [{ translateX: fadePosX }, { translateY: fadePosY }],
              }}
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
              Where Creativity meets innovation: Embark on a journey of
              limitless exploration with Aora
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
