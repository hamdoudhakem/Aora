import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, {useEffect, useState} from 'react'
import {Models} from 'react-native-appwrite'
import {VideosType, UsersType} from 'lib/types'
import {icons} from '../constants'
import * as appwrite from 'lib/appwrite'
import { Video, ResizeMode, AVPlaybackStatusSuccess } from 'expo-av'


const VideoCard = ({post, user, likedState} :     
    {
        post : VideosType & Models.Document,
        user : UsersType & Models.Document,
        likedState? : boolean
    }
) => {    
    const { title, thumbnail, video, creator:{username, avatar}}  = post   

    const CheckIfLiked = () => {
        return likedState ? likedState : post.liked &&         
            post.liked.find((likedUser) => likedUser.$id === user.$id) !== undefined
    }

    const [play, setPlay] = useState(false)
    const [liked, setLiked] = useState(CheckIfLiked())    

    useEffect(() => {
        setLiked(CheckIfLiked())
        console.log('I Will Check Liked again and it seems its', CheckIfLiked())
    }, [post])   
    
    return ( 
        <View className='flex-col items-center px-4 mb-14'>
            <View className='flex-row gap-3 items-start'>
                <View className='justify-center items-center flex-row flex-1'>
                    <View className='w-[46px] h-[46px] rounded-lg border 
                        border-secondary justify-center items-center p-0.5'
                    >
                        <Image source={{uri: avatar}} 
                            className='w-full h-full rounded-lg'
                            resizeMode='cover' 
                        />
                    </View>

                    <View className='justify-center flex-1 ml-3 gap-y-1'>
                    <Text className='text-white font-psemibold text-sm'
                        numberOfLines={1}>
                            {title}
                    </Text>
                    <Text className='text-xs text-gray-100 font-pregular' 
                        numberOfLines={1}>
                            {username}
                    </Text>
                    </View>
                </View>

                {!liked ?
                   <TouchableOpacity 
                        onPress={() => {
                            setLiked(true)
                            appwrite.bookmarkVideo(post)
                        }}
                    >
                        <View className='pt-2'>
                            <Image source={icons.heart2} 
                                className='w-5 h-5'
                                resizeMode='contain' 
                            />
                        </View>
                    </TouchableOpacity>
                    :                    
                    <TouchableOpacity 
                        onPress={() => {
                            setLiked(false)
                            appwrite.unBookmarkVideo(post)
                        }}
                    >
                        <View className='pt-2'>
                            <Image source={icons.heartFilled} 
                                className='w-5 h-5'
                                resizeMode='contain' 
                            />
                        </View>
                    </TouchableOpacity>
                }                
                
            </View>

            {play ? (
                <Video
                    source={{uri: video}}
                    className='w-full h-60 rounded-xl mt-3'
                    resizeMode={ResizeMode.CONTAIN}
                    useNativeControls
                    shouldPlay
                    onPlaybackStatusUpdate={(status : AVPlaybackStatusSuccess) => {
                        // Check if the status is of type AVPlaybackStatusSuccess
                        try{
                            if (status.didJustFinish) {
                            setPlay(false);
                            }
                        }catch(error){
                            console.error('an Error occured while playing video',error);
                        }          
                    }}
                />
            ) : (
                <TouchableOpacity
                    activeOpacity={.7}
                    onPress={() => setPlay(true)}
                    className='w-full h-60 rounded-xl relative 
                    justify-center items-center '
                >
                    <Image source={{uri: thumbnail}} 
                        className='w-full h-full rounded-xl mt-3'
                        resizeMode='cover' 
                    />

                    <Image source={icons.play} 
                        className='w-12 h-12 absolute'
                        resizeMode='contain'
                    />
                </TouchableOpacity>
            )}

        </View>
    )
}

export default VideoCard