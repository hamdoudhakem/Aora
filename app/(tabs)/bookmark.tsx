import { View, Text, FlatList, Image, RefreshControl } from "react-native";
import React, { useEffect, useState } from "react";
import { Models } from "react-native-appwrite";
import { UsersType, VideosType } from "lib/types";
import { useAppwrite } from "lib/hooks";
import * as appwrite from "lib/appwrite";
import { EmptyState, SearchInput, VideoCard } from "components";
import { useGlobalContext } from "context/GlobalProvider";
import { SafeAreaView } from "react-native-safe-area-context";

const BookMark = () => {    
  const { user } : { user : Models.Document & UsersType } = useGlobalContext();

  const [refreshing, setRefreshing] = useState(false)  
  const [bookmarks, setBookmarks] = useState<(Models.Document & UsersType)[]>([])  

  const {data: posts, refetch} = useAppwrite(
    () => appwrite.getUserBookmarkedVideos()
  );

  const onRefresh = async () => {
    setRefreshing(true)
    await refetch();
    setRefreshing(false)
  }

  // console.log('Fetched Data Bookmark')

  //When the posts finish Loading I assign them to the bookmarks state
  useEffect(() => {
    if(posts.length > 0){
      setBookmarks((posts[0] as UsersType).bookmarked as (Models.Document & UsersType)[]);
    }
  }, [posts])

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList 
        data={bookmarks}
        keyExtractor={(item) => item.$id.toString()}
        renderItem={({item}) => <VideoCard post={item} user={user} likedState={true}/>}
        keyboardShouldPersistTaps='handled'

        ListHeaderComponent={() => (
          <View className="my-6 px-4 space-y-6">
            <View className="justify-between items-start flex-row mb-6">           
              <View>
                <Text className="font-pbold text-3xl text-gray-100">
                  Saved Videos
                </Text>
              </View>
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

export default BookMark;
