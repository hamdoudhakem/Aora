import { View, Text, FlatList, Image, RefreshControl } from "react-native";
import React, { useEffect, useState } from "react";
import { images } from "../../constants";
import { SafeAreaView } from "react-native-safe-area-context";
import { EmptyState, VideoCard, SearchInput, Trending } from "components";
import * as appwrite from "lib/appwrite";
import { Models } from "react-native-appwrite";
import { useAppwrite } from "lib/hooks";
import { useGlobalContext } from "context/GlobalProvider";
import { UsersType } from "lib/types";
import notifee, {
  RepeatFrequency,
  TimestampTrigger,
  TriggerType,
} from "@notifee/react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

const home = () => {
  const { user }: { user: Models.Document & UsersType } = useGlobalContext();

  const { data: posts, refetch } = useAppwrite(appwrite.getPosts);
  const { data: latestPosts } = useAppwrite(appwrite.getLatestPosts);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const waveRotation = useSharedValue(0);
  const wavePosX = useSharedValue(0);
  const wavePosY = useSharedValue(0);

  useEffect(() => {
    async function onCreateTriggerNotification() {
      // Request permissions (required for iOS)
      await notifee.requestPermission();

      // Create a channel (required for Android)
      const channelId = await notifee.createChannel({
        id: "default",
        name: "Default Channel",
      });

      const date = new Date(Date.now());
      date.setMinutes(date.getMinutes() + 2);

      console.log("date", date);

      // Create a time-based trigger
      const trigger: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: date.getTime(),
        repeatFrequency: RepeatFrequency.DAILY,
      };

      // Create a trigger notification
      await notifee.createTriggerNotification(
        {
          title: "Discover new AI-Generated videos!",
          body:
            "Why don't you take a look at the recent uploads? \n" +
            "PS: this notification will run 3 mins after each time Aora is opened",
          android: {
            channelId,

            //This is needed if you want the notification to open the app when pressed
            pressAction: {
              id: "default",
            },
          },
        },
        trigger
      );
    }

    notifee.getTriggerNotificationIds().then(async (ids) => {
      console.log("All trigger notifications: ", ids);
      if (ids.length > 0) {
        await notifee.cancelTriggerNotifications();
      }

      onCreateTriggerNotification();
    });

    const rotationConfig = {
      duration: 300,
      easing: Easing.inOut(Easing.ease),
    };

    const posConfig = {
      duration: 300,
      easing: Easing.linear,
    };

    const waveDegree = 50;
    const wavePosXVal = 3;

    waveRotation.value = withTiming(waveDegree, rotationConfig, () => {
      waveRotation.value = withTiming(0, rotationConfig, () => {
        waveRotation.value = withTiming(waveDegree, rotationConfig, () => {
          waveRotation.value = withTiming(0, rotationConfig);
          wavePosX.value = withTiming(0, posConfig);
        });
        wavePosX.value = withTiming(wavePosXVal, posConfig);
      });
      wavePosX.value = withTiming(0, posConfig);
    });

    wavePosX.value = withTiming(wavePosXVal, posConfig);
  }, []);

  //NOTE: useAnimatedStyle gives an error when using multiple objects for transform
  //@ts-expect-error
  const waveStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${waveRotation.value}deg` },
        { translateX: wavePosX.value },
        { translateY: wavePosX.value * -3 },
      ],
    };
  });

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id.toString()}
        renderItem={({ item }) => <VideoCard post={item} user={user} />}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={() => (
          <View className="my-6 px-4 space-y-6">
            <View className="justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pmedium text-sm text-gray-100">
                  Welcome Back
                </Text>
                <View className="flex-row">
                  <Text
                    className="max-w-[200px] text-2xl font-psemibold text-white"
                    numberOfLines={1}
                  >
                    {user.username}fdsfdsffsdfdsfdsfdsf
                  </Text>
                  <Animated.Text
                    className="text-2xl font-psemibold ml-4 mb-3"
                    style={[waveStyle]}
                  >
                    👋
                  </Animated.Text>
                </View>
              </View>

              <View className="mt-1.5">
                <Image
                  source={images.logoSmall}
                  className="w-9 h-10"
                  resizeMode="contain"
                />
              </View>
            </View>

            <SearchInput />

            <View className="w-full flex-1 pt-5 pb-8">
              <Text className="text-gray-100 font-pregular text-lg mb-3">
                Latest Videos
              </Text>

              <Trending posts={latestPosts ?? []} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No videos found"
            description="Be the first one to upload a video"
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default home;
