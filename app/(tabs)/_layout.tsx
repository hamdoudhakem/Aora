import { Image, Text, View } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { icons } from "../../constants";

const TabIcon = ({ source, focused, color, name }) => {
  return (
    <View className="items-center justify-center gap-2">
      <Image
        source={source}
        resizeMode="contain"
        tintColor={color}
        className="w-6 h-6"
      />
      <Text
        className={`${focused ? "font-psemibold" : "font-pregular"} text-xs`}
        style={{ color }}
      >
        {name}
      </Text>
    </View>
  );
};

export default function tabsLayout() {
  return (
    <>    
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#FFA001",
          tabBarInactiveTintColor: "#CDCDE0",
          tabBarStyle: {
            backgroundColor: "#161622",
            borderTopWidth: 1,
            borderTopColor: "#232533",
            height: 84,
          },
          headerShown: false,
          tabBarHideOnKeyboard : true
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            tabBarIcon: (props) => (
              <TabIcon source={icons.home} name="Home" {...props} />
            ),
          }}
        />
        <Tabs.Screen
          name="create"
          options={{
            title: "Create",
            tabBarIcon: (props) => (
              <TabIcon source={icons.plus} name="Create" {...props} />
            ),
          }}
        />
        <Tabs.Screen
          name="bookmark"
          options={{
            title: "Bookmark",
            tabBarIcon: (props) => (
              <TabIcon source={icons.bookmark} name="Bookmark" {...props} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: (props) => (
              <TabIcon source={icons.profile} name="Profile" {...props} />
            ),
          }}
        />
      </Tabs>      
    </>
  );
}
