import { View, Text } from 'react-native'
import React from 'react'

type InfoBoxProps = {
    title: string |number,
    subtitle?: string,
    containerStyle?: string,
    titleStyles?: string,
}

const InfoBox = ({title, subtitle, containerStyle, titleStyles} : InfoBoxProps) => {
  return (
    <View className={containerStyle}>
      <Text className={`text-white text-center font-psemibold 
        ${titleStyles}`}>{title}</Text>
        <Text className='text-sm text-gray-100 text-center text-pregular'>{subtitle}</Text>
    </View>
  )
}

export default InfoBox