import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { icons } from "../constants";
import { styled, withExpoSnack  } from "nativewind";

const StyledView = styled(View)

type FormFieldProps = {
  title?: string;
  value?: string;
  placeholder?: string;
  handleTextChange?: (text: string) => void;
  otherStyles?: string;  
  keyboardType?: string  
}

const FormField = ({
  title,
  value,
  placeholder,
  handleTextChange,
  otherStyles,
  keyboardType
} : FormFieldProps) => {
  const [showpass, setShowpass] = useState(false);
  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-gray-100 text-pmedium">{title}</Text>
      <StyledView
        className="border-2 border-black-200 w-full h-16 px-4
       bg-black-100 rounded-2xl focus:border-secondary items-center flex-row"                   
      >
        <TextInput
          className="flex-1 font-psemibold text-base text-white min-w-[50px]"                           
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7b7b8b"
          onChangeText={handleTextChange}          
          secureTextEntry={title === "Password" && !showpass}          
          numberOfLines={1}
        />

        {title === "Password" ? (
          <TouchableOpacity onPress={() => setShowpass(!showpass)}>
            <Image
              source={!showpass ? icons.eye : icons.eyeHide}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        ) : null}
      </StyledView>
    </View>
  );
};

export default FormField;
