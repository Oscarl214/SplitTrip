import { FontAwesome5 } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../provider/authContext';
import { supabase } from '../utils/supabase';
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

const Group = () => {
  const router = useRouter()
  const {setContextSession,contextsession}=useAuth()
    const [ groupinfo, setGroupInfo]=useState<GroupInfo | null>(null);
    const [groupData,setGroupData]=useState<GroupData | null>(null)
    const [members, setMembers] = useState<GroupMember[]>([]);;
    const [loading, setLoading]= useState(true);


    const clearSession = async () => {
      await supabase.auth.signOut();
      setContextSession(null);
      alert('Session Cleared , All authentication data has been cleared');
    };


    // Render function for each member item
    const renderMember = ({ item }: { item: GroupMember }) => (
      <View className="flex-row items-center justify-between p-3 border-b border-gray-100">
        <View className="flex-1">
          <Text className="font-medium">{item.profiles?.name || item.email}</Text>
          <Text className="text-sm text-gray-500">{item.email}</Text>
          {item.status === 'invited' && (
            <Text className="text-xs text-orange-500 font-medium">Invited</Text>
          )}
        </View>
        {item.status === 'active' && item.profiles?.name !== 'oscar' && (
          <TouchableOpacity className="text-gray-400">
            <FontAwesome5 name="bell" size={24} color="black" />
          </TouchableOpacity>
        )}
      </View>
    );

    // Key extractor function - returns unique key for each item
    const keyExtractor = (item: GroupMember) => item.id?.toString() || item.email;
    
    
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
    
          // Fetch members with profile names (including invited members)
          const { data: members, error: membersError } = await supabase
            .from("group_members")
            .select(`
              *,
              profiles(name)
            `)
            .eq('group_id', groupId)
            .in('status', ['active', 'invited']);
    
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
    
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="p-4">
        <View className="flex-row items-center mb-6">
          <TouchableOpacity onPress={() => router.back()} className="p-2 mr-2">
          <AntDesign name="arrowleft" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-xl font-bold">{groupData?.name}</Text>
        </View>

        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-medium">Group Members</Text>
          <TouchableOpacity className="flex-row items-center">
          <Feather name="user-plus" size={24} color="black" />
            <Text className="text-blue-500 ml-1">Invite</Text>
          </TouchableOpacity>
        </View>

        <FlatList 
          data={members}
          renderItem={renderMember}
          keyExtractor={keyExtractor}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 1 }} />}
        />

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
            <TouchableOpacity onPress={clearSession} className='bg-red text-black'>
            <Text>Reset Session (DEBUG)</Text>
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