import { useRouter } from 'expo-router'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Feather from '@expo/vector-icons/Feather';
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from '@expo/vector-icons/AntDesign';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const Group = () => {
  const router = useRouter()
  const members = [
    {
      id: 1,
      name: 'You',
      email: 'you@example.com',
    },
    {
      id: 2,
      name: 'Michael',
      email: 'michael@example.com',
    },
    {
      id: 3,
      name: 'Emma',
      email: 'emma@example.com',
    },
    {
      id: 4,
      name: 'John',
      email: 'john@example.com',
    },
    {
      id: 5,
      name: 'Sarah',
      email: 'sarah@example.com',
    },
  ]

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="p-4">
        <View className="flex-row items-center mb-6">
          <TouchableOpacity onPress={() => router.back()} className="p-2 mr-2">
          <AntDesign name="arrowleft" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-xl font-bold">Barcelona Trip</Text>
        </View>

        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-medium">Group Members</Text>
          <TouchableOpacity className="flex-row items-center">
          <Feather name="user-plus" size={24} color="black" />
            <Text className="text-blue-500 ml-1">Invite</Text>
          </TouchableOpacity>
        </View>

        <View className="space-y-3">
          {members.map((member) => (
            <View
              key={member.id}
              className="flex-row items-center justify-between p-3 border-b border-gray-100"
            >
              <View>
                <Text className="font-medium">{member.name}</Text>
                <Text className="text-sm text-gray-500">{member.email}</Text>
              </View>
              {member.name !== 'You' && (
                <TouchableOpacity className="text-gray-400">
                  <FontAwesome5 name="bell" size={24} color="black" />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        <View className="mt-8">
          <Text className="text-lg font-medium mb-4">Group Settings</Text>
          <View className="space-y-3 gap-4">
            <TouchableOpacity className="w-full flex-row items-center justify-between p-4 border border-gray-200 rounded-lg">
              <Text className="font-medium">Reminders</Text>
              <AntDesign name="arrowleft" size={24} color="black" style={{ transform: [{ rotate: '180deg' }] }} />

            </TouchableOpacity>
            <TouchableOpacity className="w-full flex-row items-center justify-between p-4 border border-gray-200 rounded-lg">
              <Text className="font-medium">Currency</Text>
              <Text className="text-gray-500">USD ($)</Text>
            </TouchableOpacity>
            <TouchableOpacity className="w-full flex-row items-center justify-between p-4 border border-gray-200 rounded-lg">
              <Text className="font-medium">Group Name</Text>
              
              <AntDesign name="arrowleft" size={24} color="black" style={{ transform: [{ rotate: '180deg' }] }} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Group

const styles = StyleSheet.create({}) 