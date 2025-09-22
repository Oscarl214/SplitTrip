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


interface GroupData {
    id: number | null,
    name: 'string',
  description: number | null,
  }


const ChangeGroupInfo = () => {
    const router=useRouter()
const {contextsession}=useAuth();

const [groupInfo,setGroupInfo]=useState<GroupInfo | null>(null);

const [groupname,setGroupName]=useState('')
const [description,setDescription]=useState('')

useEffect(()=>{

    const fetchGroupInfo= async ()=>{

        try {

        const value= await AsyncStorage.getItem("activeGroup")

        if(value !== null){
            const parsedValue=JSON.parse(value)
            setGroupInfo(parsedValue)
        }
    }catch(e){
        console.error("error fetching group Info", e);
    }
}


    fetchGroupInfo()

}, [])

const updateGroupInfo= async () =>{
    const groupId = groupInfo?.id;

    if(!groupId){
        Alert.alert('Error', 'No group selected');
        return;
    }
   
    if(!groupname && !description){
        Alert.alert('Error', 'Please provide a name or description to update');
    }

    // Build update object with only non-empty fields
    const updateData: any = {};
    if(groupname.trim()) updateData.name = groupname;
    if(description.trim()) updateData.description = description;
    
    try {
        const { error}= await supabase
        .from("groups")
        .update(updateData)
        .eq('id', groupId)

        if(error){
            console.error('Error updating group Information', error)
            Alert.alert('Error', 'Failed to update GroupInfo. Please try again.');
        }else {
            Alert.alert('Success', 'Group Updated Successfully');
setGroupName('');
setDescription('');
            setTimeout(() => {
                router.push('/');
              }, 500);
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
        </View>
    <Text className='text-2xl font-bold mb-5 px-3'>Change Group Info!</Text>
    <View style={styles.formContainer}>
    <TextInput
            placeholder="Enter new Group Name"
            placeholderTextColor="EX: Grand Teton National Park"
            value={groupname}
            onChangeText={setGroupName}
            style={styles.input}
            autoCapitalize="none" />
             <TextInput
            placeholder="National Park with friends.."
            placeholderTextColor="#666"
            value={description}
            onChangeText={setDescription}
            style={styles.input}
            autoCapitalize="none" />
               <View className='px-4'>

 <TouchableOpacity 
             onPress={updateGroupInfo}
             className="bg-blue-500 px-6 py-8 rounded-lg items-center">
            <Text  className="text-white font-medium text-center">Update Group Info</Text>
          </TouchableOpacity>
                 </View>
           </View>
           
    </SafeAreaView>
 
  )
}

export default ChangeGroupInfo

const styles=StyleSheet.create({
    formContainer: {
        flex: 1,
        flexDirection: 'column',
        gap: 8
    },
    input: {
        height: 60,
        borderWidth: 1,
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