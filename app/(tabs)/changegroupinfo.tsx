import { AntDesign } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '../provider/authContext'
import { supabase } from '../utils/supabase'
import { parse } from '@babel/core'

interface GroupInfo {
    id: 'string',
    createdAt: 'string'
  }


interface GroupData {
    id: number | null,
    name: 'string' | null,
  created_by: number | null,
  created_at: number | null, 
  description: number | null,
  }


const ChangeGroupInfo = () => {
    const router=useRouter()
const {contextsession}=useAuth();

const [groupInfo,setGroupInfo]=useState<GroupInfo | null>(null);

const [name,setGroupName]=useState('')
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

const updateGroupInfo= async ({name, description}: GroupData) =>{
    const groupId = groupInfo?.id;

    if(!groupId){
        Alert.alert('Error', 'No group selected');
        return;
    }

    try {
        const { error}= await supabase
        .from("groups")
        .update({
            id: groupId,
            name: name,
            description: description
        })

        if(error){
            console.error('Error updating group Information', error)
            Alert.alert('Error', 'Failed to update GroupInfo. Please try again.');
        }else {
            Alert.alert('Success', 'Grpup Updated Successfully')
            setGroupName('')
            setDescription('')
            router.push('/')
        }
    }catch(error){
        console.error('Unexpected error:', error);
        Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    }
}


  return (
    <View>
      <Text>ChangeGroupInfo</Text>
    </View>
  )
}

export default ChangeGroupInfo