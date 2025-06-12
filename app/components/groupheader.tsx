import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const GroupHeader = () => {
  return (
    <SafeAreaView className='flex items-center flex-row justify-between'>
      <Text className='text-2xl font-bold'>Title Goes Here</Text>
      <View className='flex flex-row items-center text-gray-500'>
      <Ionicons name="people-outline" size={24} color='gray' className='mr-1'/>
      <Text>Members people</Text>
      </View>
    </SafeAreaView>
  )
}

export default GroupHeader