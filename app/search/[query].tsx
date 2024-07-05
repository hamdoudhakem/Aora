import { View, Text, FlatList, } from "react-native";
import React, {useEffect, useState} from "react";
import * as appwrite from 'lib/appwrite'
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { EmptyState, SearchInput, VideoCard } from "components";
import { useAppwrite } from "lib/hooks";

const search = () => {
  const { query }= useLocalSearchParams();  
  const { data: posts, refetch } = useAppwrite(
    () => appwrite.searchPosts(query as string)
  );  
  
  useEffect(() => {
    refetch()
  }, [query])

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList 
        data={posts}
        keyExtractor={(item) => item.$id.toString()}
        renderItem={({item}) => <VideoCard post={item} />}
        keyboardShouldPersistTaps='handled'

        ListHeaderComponent={() => (
        <View className="my-6 px-4">

          <Text className="font-pmedium text-sm text-gray-100">
            Search Results
          </Text>

          <Text className="text-2xl font-psemibold text-white">
            {query}
          </Text>

          <View className="mt-6 mb-8">
            <SearchInput initialQuery={query as string}/>
          </View>         
        </View>
        )}

        ListEmptyComponent={() => (
          <EmptyState 
            title="No videos found"
            description="No videos found for this search query"
          />
        )}

      />
    </SafeAreaView>
  );
};

export default search;
