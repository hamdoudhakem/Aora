import { View, Text, FlatList,Image, RefreshControl, Button } from "react-native";
import React, {useEffect, useState} from "react";
import { images } from "../../constants";
import { SafeAreaView } from "react-native-safe-area-context";
import {EmptyState, VideoCard, SearchInput, Trending} from "components";
import * as appwrite from 'lib/appwrite'
import { Models } from 'react-native-appwrite'
import { useAppwrite } from 'lib/hooks'
import { useGlobalContext } from "context/GlobalProvider";
import { UsersType } from "lib/types";

const home = () => {
  const { user } : { user : Models.Document & UsersType } = useGlobalContext(); 

  const { data: posts, refetch } = useAppwrite(appwrite.getPosts);
  const { data: latestPosts } = useAppwrite(appwrite.getLatestPosts);

  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = async () => {
    setRefreshing(true)
    await refetch();
    setRefreshing(false)
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList 
        data={posts}
        keyExtractor={(item) => item.$id.toString()}
        renderItem={({item}) => <VideoCard post={item} />}
        keyboardShouldPersistTaps='handled'

        ListHeaderComponent={() => (
        <View className="my-6 px-4 space-y-6">
          <View className="justify-between items-start flex-row mb-6">
            <View>
              <Text className="font-pmedium text-sm text-gray-100">
                Welcome Back
              </Text>
              <Text className="text-2xl font-psemibold text-white">
                {user.username}
              </Text>
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

        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
      />
      
    </SafeAreaView>
  );
};

export default home;
