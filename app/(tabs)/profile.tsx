import { View, FlatList, TouchableOpacity, Image, RefreshControl } from "react-native";
import React, { useState } from "react";
import * as appwrite from 'lib/appwrite'
import { Models } from 'react-native-appwrite';
import { SafeAreaView } from "react-native-safe-area-context";
import { EmptyState, SearchInput, VideoCard, InfoBox } from "components";
import { useAppwrite } from "lib/hooks";
import { icons } from "constants/index";
import { router } from "expo-router";
import { useGlobalContext } from "context/GlobalProvider";
import { UsersType } from "lib/types";

const profile = () => {  
  const { user, setUser, setLoggedIn } : {
    user : Models.Document & UsersType, 
    setUser : (user : Models.Document) => void, 
    setLoggedIn : (bool : boolean) => void,
  } = useGlobalContext();  

  const [refreshing, setRefreshing] = useState(false)

  const {data: posts, refetch} = useAppwrite(
    () => appwrite.getUserPosts(user.$id)
  );

  const onRefresh = async () => {
    setRefreshing(true)
    await refetch();
    setRefreshing(false)
  }

  const logout = async () => {
    router.replace('/sign-in')

    const session = await appwrite.logout();
    setUser(null);
    setLoggedIn(false);
  }
 
  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList 
        data={posts}
        keyExtractor={(item) => item.$id.toString()}
        renderItem={({item}) => <VideoCard post={item} user={user} />}
        keyboardShouldPersistTaps='handled'

        ListHeaderComponent={() => (
          <View className="w-full justify-center items-center mt-6 mb-12 px-4">
            <TouchableOpacity 
              className="w-full items-end mb-10"
              onPress={logout}
            >
              <Image
                source={icons.logout}
                resizeMode="contain"
                className="w-6 h-6"

              />
            </TouchableOpacity>

            <View 
              className="w-16 h-16 border border-secondary rounded-lg 
                justify-center items-center"
              
            >
              <Image
                source={{uri: user?.avatar}}
                className="w-[90%] h-[90%] rounded-lg"
                resizeMode="cover"
              />
            </View>

            <InfoBox 
              title={user?.username}
              containerStyle="mt-5"
              titleStyles='text-lg'
            />

            <View 
              className="mt-5 flex-row"
            >
              <InfoBox 
                title={posts.length || 0}
                containerStyle="mr-10"
                titleStyles='text-xl'
                subtitle='Posts'
              />

              <InfoBox 
                title={'2.8k'}
                subtitle='Followers'
                titleStyles='text-xl'
              />

            </View>
          </View>
        )}

        ListEmptyComponent={() => (
          <EmptyState 
            title="No videos found"
            description="No videos found for this search query"
          />
        )}

        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
      />
    </SafeAreaView>
  );
};

export default profile;
