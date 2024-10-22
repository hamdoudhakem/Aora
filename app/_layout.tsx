import React from "react";
import { StyleSheet, Text, View, StatusBar } from "react-native";
import { useFonts } from "expo-font";
import { Slot, SplashScreen } from "expo-router";
import { Stack } from "expo-router/stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect } from "react";
import { globalProvider as GlobalProvider } from "context/GlobalProvider";

SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const [fontloaded, error] = useFonts({
    "Poppins-Black": require("../assets/fonts/Poppins-Black.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-ExtraLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
  });

  useEffect(() => {
    if (error) throw error;
    if (fontloaded) SplashScreen.hideAsync();
  }, [fontloaded, error]);

  if (!fontloaded && !error) return null;

  return (
    <>
      <StatusBar barStyle="light-content" />
      <GlobalProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="search/[query]"
            options={{ headerShown: false }}
          />
        </Stack>
      </GlobalProvider>
    </>
  );
}
