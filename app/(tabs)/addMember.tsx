import { AntDesign } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '../provider/authContext'
import { supabase } from '../utils/supabase'

interface GroupInfo {
    id: 'string',
    createdAt: 'string'
  }


const addMember = () => {

    const router=useRouter()
const {contextsession}=useAuth()
   const [newMemberEmail,setNewMemberEmail]=useState('')
 const [ groupinfo, setGroupInfo]=useState<GroupInfo | null>(null);

   if(newMemberEmail===contextsession?.email) {
    Alert.alert("Cannot submit your own email")
    setNewMemberEmail('')
   return
   }

   const value=  AsyncStorage.getItem("activeGroup")

   useEffect(()=>{


       const getGroupData = async () => {
           const value = await AsyncStorage.getItem("activeGroup")
           if(value !== null){
               const parsedValue = JSON.parse(value)
               setGroupInfo(parsedValue)
               console.log("Group Data", parsedValue)
            }
        }
        
        getGroupData()
        
    }, [])

   const addMember= async ()=>{
    const groupId = groupinfo?.id;
    if (!groupId) {
      Alert.alert('Error', 'No group selected');
      return;
    }
    if (!newMemberEmail) {
      Alert.alert('Error', 'Please enter an email address');
      return;
    }
    
    try {
    const {data:members, error}=await supabase
    .from("group_members")
    .insert(
        {
            group_id: groupId,
            email: newMemberEmail,
            profile_id: null,
            role: 'member', 
            joined_at: new Date().toISOString(),
            status: 'invited',
            invited_at: new Date().toISOString(),
        }
    )

    if(error){
        console.error("Error adding newest member to group:", error);
        Alert.alert('Error', 'Failed to add member. Please try again.');
    } else {
        Alert.alert('Success', 'Member invited successfully!');
        setNewMemberEmail('');
        router.push('/group');
    }
   }catch(error){
    console.error('Unexpected error:', error);
    Alert.alert('Error', 'An unexpected error occurred. Please try again.');
   }
}


  return (
    <SafeAreaView className="flex-1 bg-white">
           <View className="p-4">
           <View className="flex-row items-center mb-6">
          <TouchableOpacity onPress={() => router.push('/group')} className="p-2 mr-2">
          <AntDesign name="arrowleft" size={24} color="black" />
          </TouchableOpacity>
        </View>
      <Text className='text-2xl font-bold mb-5 px-3'>Invite a New Member!</Text>
     
      <TextInput
            placeholder="Enter invite email"
            placeholderTextColor="#666"
            value={newMemberEmail}
            onChangeText={setNewMemberEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none" />
           </View>
           <View className='px-4'>
           <TouchableOpacity 
             onPress={addMember}
             className="bg-blue-500 px-6 py-3 rounded-lg items-center">
            <Text  className="text-white font-medium text-center">Invite a Member</Text>
           </TouchableOpacity>

           </View>

          
    </SafeAreaView>
  )
}

export default addMember

const styles=StyleSheet.create({
    input: {
        height: 60,
        borderWidth: 2,
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingVertical: 16,
        fontSize: 17,
        backgroundColor: 'white',
        fontWeight: "500" as const,
        borderColor: '#ddd',
        color: '#000000',
        textAlign: 'left' as const,
      },
      button: {
        width: 54,
        height: 45,
      }
  })