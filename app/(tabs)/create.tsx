import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomButton, FormField } from "components";
import { useState } from "react";
import { VideosType } from 'lib/types'
import { Video, ResizeMode } from "expo-av";
import { icons } from "constants/index";
import * as DocumentPicker from 'expo-document-picker'
import * as ImagePicker from 'expo-image-picker'
import { router } from "expo-router";
import * as appwrite from 'lib/appwrite'
import { useGlobalContext } from "context/GlobalProvider";
import { UsersType } from "lib/types";
import { Models } from "react-native-appwrite";

const Create = () => {
  const { user } : { user : Models.Document & UsersType } = useGlobalContext(); 
  
  const [uploading, setUploading] = useState(false)

  const [form, setForm] = useState<VideosType>({
    title: "",     
    video: null,
    thumbnail: null,
    prompt: "",
  })

  const openPicker = async (selectType : string) => {
    let result : ImagePicker.ImagePickerResult;
  
    result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: selectType === 'image' ? ImagePicker.MediaTypeOptions.Images
      : ImagePicker.MediaTypeOptions.Videos,
      aspect: [4,3],
      quality: 1
    })
    

    if(!result.canceled){
      if(selectType === 'image'){
        setForm({...form, thumbnail: result.assets[0]})
      }else{
        setForm({...form, video: result.assets[0]})
      }
    }
  }

  const submit = async () => {
    if(!form.title || !form.video || !form.thumbnail || !form.prompt){
      return Alert.alert("Error", "All fields are required")
    }

    setUploading(true)

    try{
      await appwrite.createVideo({
        ...form, creator: {$id: user.$id}
      })

      Alert.alert("Success", "Video uploaded successfully")

      router.push('/home')
    }catch(err){
      console.log(err) 
      Alert.alert("Error You SHIT", err.message)           
    }finally{
      setForm({
        title: "",     
        video: null,
        thumbnail: null,
        prompt: "",
      })
      setUploading(false)
    }
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6" keyboardShouldPersistTaps='handled'>

        <Text className="text-2xl text-white font-psemibold">Uplaod Video</Text>

        <FormField 
          title="Video Title"
          value={form.title}
          placeholder="Give your video a catchy title!"
          handleTextChange={(e) => setForm({...form, title: e})}
          otherStyles="mt-10"
        />

        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Upload Video
          </Text>

          <TouchableOpacity onPress={() => openPicker('video')}>
            {form.video ? (
              <Video 
                source={{uri: form.video.uri}}
                className="w-full h-64 rounded-2xl"                
                resizeMode={ResizeMode.COVER}                
              />
            ) : (
              <View 
                className="w-full h-40 px-4 bg-black-100 
                rounded-2xl justify-center items-center">
                  <View className="w-14 h-14 border border-dashed border-secondary-100 justify-center items-center">
                    <Image  
                      source={icons.upload}
                      resizeMode="contain"
                      className="w-1/2 h-1/2"
                    />
                  </View>
              </View>
            )
            }
          </TouchableOpacity>
        </View>

        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
           Thumbnail Image
          </Text>
          <TouchableOpacity onPress={() => openPicker('image')}>
            {form.thumbnail ? (
              <Image 
                source={{uri: form.thumbnail.uri}}
                resizeMode="cover"
                className="w-full h-64 rounded-2xl"
              />
            ) : (
              <View 
                className="w-full h-16 px-4 bg-black-100 
                rounded-2xl justify-center items-center border-2 border-black-200
                flex-row space-x-2">
                  <Image  
                    source={icons.upload}
                    resizeMode="contain"
                    className="w-5 h-5"
                  />
                  <Text className="text-sm text-gray-100 font-pmedium"> 
                    Choose a File
                  </Text>
              </View>
            )
            }
          </TouchableOpacity>
        </View>

        <FormField 
          title="AI prompt"
          value={form.prompt}
          placeholder="The Prompt you used to create this video"
          handleTextChange={(e) => setForm({...form, prompt: e})}
          otherStyles="mt-7"
        />

        <CustomButton 
          title="Submit & Publish"
          handlePress={submit}
          containerStyles="mt-7"
          isLoading={uploading}
        />
      </ScrollView>      
    </SafeAreaView>
  );
};

export default Create;
