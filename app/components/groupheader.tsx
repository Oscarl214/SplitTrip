import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import AsyncStorage, { useAsyncStorage } from '@react-native-async-storage/async-storage';
import { supabase } from '../utils/supabase';
import GroupHeaderSkeleton from './UI/groupHeaderSkeleton';
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


const GroupHeader = () => {
const [ groupinfo, setGroupInfo]=useState<GroupInfo | null>(null);
const [groupData,setGroupData]=useState<GroupData | null>(null)
const [members, setMembers] = useState<any[]>([]);;
const [loading, setLoading]= useState(true);


useEffect(() => {
  const fetchGroupInfo = async () => {
    try {
      const value = await AsyncStorage.getItem("activeGroup");
      if (value !== null) {
        console.log("Group Info", value);
        const parsedValue = JSON.parse(value);
        setGroupInfo(parsedValue);
      }
    } catch (e) {
      console.error("error fetching group Info", e);
    }
  };
  
  fetchGroupInfo();
}, []);
useEffect(() => {
  if (!groupinfo?.id) {
    console.log('No groupinfo or group ID available yet');
    return;
  }

  const fetchGroupData = async () => {
    try {
      const groupId = groupinfo.id;
      console.log('Fetching group with ID:', groupId);

      // Fetch group data
      const { data, error: groupError } = await supabase
        .from('groups')
        .select('*')
        .eq('id', groupId)
        .single();

      // Fetch members
      const { data: members, error: membersError } = await supabase
        .from("group_members")
        .select('*')
        .eq('group_id', groupId)
        .eq('status', 'active');

      if (groupError || membersError) {
        console.error('Error fetching data:', groupError || membersError);
        return;
      }

      setTimeout(()=>{

        setLoading(false)
        setGroupData(data);
        setMembers(members || []);
      },2000)
      console.log('Group data loaded:', data);
      console.log('Members loaded:', members);
    } catch (error) {
      console.error('Error in fetchGroupData:', error);
    }
  };
 
  fetchGroupData();
}, [groupinfo]); // Run when groupinfo changes

   if(loading){
    return <GroupHeaderSkeleton/>
   }

  return (
    <View className='flex items-center flex-row justify-between'>
      <View className='flex flex-row justify-start'>
      <Text className='text-2xl font-bold'>{`${groupData?.name}`}</Text>

      </View>
      <View className='flex flex-col'>

      <View className='flex flex-row items-center text-gray-500'>
        <Ionicons name="people-outline" size={24} color='gray' style={{ marginRight: 4 }}/>
        <Text>{`Active Members ${members?.length}`}</Text>
      </View>
      </View>
      
    </View>
  )
}

export default GroupHeader