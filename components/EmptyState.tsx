import { View, Text, Image } from 'react-native'
import {images} from '../constants'
import React from 'react'
import CustomButton from './CustomButton'
import { router } from 'expo-router'

const EmptyState = ({title, description}) => {
  return (
    <View className='justify-center items-center px-4'>
      <Image 
        source={images.empty}
        className='w-[270px] h-[217px]'
        resizeMode='contain' 
      />
      
      <Text className="text-xl text-center font-psemibold text-white mt-2">
        {title}
      </Text>
      
      <Text className="font-pmedium text-sm text-gray-100">
        {description}
      </Text>

      <CustomButton 
        title="Upload Video"
        handlePress={() => router.push('/create')}
        containerStyles='w-full my-5'        
      />
    </View>
  )
}

export default EmptyState