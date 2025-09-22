import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
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

interface GroupMember {
  id:number | null,
  group_id: number | null,
  profile_id: number | null,
  joined_at: number | null,
  email: string,
  role: string | null,
  status: 'active' | 'invited' | null,
  invited_at: string | null,
  profiles?: {
    name: string | null
  }
}


interface GroupHeaderProps {
  loading: boolean;
  members: GroupMember[];
  groupData: GroupData | null;
}

const GroupHeader = ({loading, members, groupData}: GroupHeaderProps) => {


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