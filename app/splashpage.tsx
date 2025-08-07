import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import {  } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
export default function SplashPage () {
  return (
    <View className='flex-1  justify-center bg-black items-center p-4'>
      <Text><Entypo name="location-pin" size={57} color="red" /></Text>
      <Text className='text-3xl'>SPLIT TRIP</Text>
    </View>
  )
}

