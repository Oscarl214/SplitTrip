import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

const GroupHeader = () => {
  return (
    <View className='flex items-center flex-row justify-between'>
      <Text className='text-2xl font-bold'>Title Goes Here</Text>
      <View className='flex flex-row items-center text-gray-500'>
        <Ionicons name="people-outline" size={24} color='gray' style={{ marginRight: 4 }}/>
        <Text>Members people</Text>
      </View>
    </View>
  )
}

export default GroupHeader