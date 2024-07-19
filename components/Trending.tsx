import {useState} from 'react'
import { FlatList, TouchableOpacity,Image, ImageBackground, ViewToken } from 'react-native'
import {Models} from 'react-native-appwrite'
import { VideosType } from 'lib/types'
import * as Animatable from 'react-native-animatable'
import { icons } from 'constants/index'
import { Video, ResizeMode, AVPlaybackStatusSuccess } from 'expo-av'

const zoomIn = {
  0: {
    opacity: 1,
    scale: 0.9,
  },  
  1: {
    opacity: 1,
    scale: 1.1,
  },
}
const zoomOut = {
  0: {
    opacity: 1,
    scale: 1.1,
  },  
  1: {
    opacity: 1,
    scale: 0.9,
  },
};

type TrendingItemProps = {
  activeItem : VideosType & Models.Document;
  Item : VideosType & Models.Document;
}

const TrendingItem = ({activeItem, Item} : TrendingItemProps) => {
  const [play, setPlay] = useState(false)

  return (
    <Animatable.View 
      className='mx-3'
      animation={activeItem.$id === Item.$id ? zoomIn : zoomOut}
      duration={500}
    >
      {play ? (
        <Video
          source={{uri: Item.video}}
          className='w-52 h-72 rounded-[35px] mt-3 bg-white/10 my-5'
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
          className='relative'
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
        >
          <ImageBackground
            source={{uri: Item.thumbnail}}
            className='w-52 h-72 rounded-[35px] 
              my-5 overflow-hidden shadow-lg shadow-black/40
              justify-center items-center'
          >
            <Image
              source={icons.play}
              className='w-12 h-12'
              resizeMode='contain'
            />
          </ImageBackground>

         
        </TouchableOpacity>
      )}
    </Animatable.View>
  )
}

const Trending = ({posts} : {posts: (VideosType & Models.Document)[]}) => {
  const [activeItem, setActiveItem] = useState(posts[0])

  const viewableItemsChanged = ({viewableItems, changed} : {viewableItems : ViewToken[], changed : ViewToken[]}) => {
    if(viewableItems.length > 0) {
      setActiveItem(viewableItems[0].item)
    }
  }

  return (
    <FlatList
        data={posts}
        keyExtractor={(item) => item.$id.toString()}
        renderItem={({item}) => (
          <TrendingItem activeItem = {activeItem} Item={item} />
        )}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 70,             
        }}
        contentOffset={{x: 170, y: 0}}
        horizontal
    />
  )
}

export default Trending