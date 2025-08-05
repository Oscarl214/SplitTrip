import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import {  } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
const SplashPage = () => {
  return (
    <View className='flex-1  justify-center items-center p-4'>


      <Text><Entypo name="location-pin" size={57} color="red" /></Text>
      <Text className='text-3xl'>SPLIT TRIP</Text>

    </View>
  )
}

export default SplashPage

const styles = StyleSheet.create({})