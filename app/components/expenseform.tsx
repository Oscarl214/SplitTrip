import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View, FlatList , StyleSheet} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

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

const ExpenseForm = () => {

    const [groupData,setGroupData]=useState<GroupData | null>(null)
const [members, setMembers] = useState<GroupMember[]>([]);;
const [loading, setLoading]= useState(true);

    const router = useRouter();
    const onBack = () => {
        router.back();
    };

    const [description,setDescription]=useState('')
    const [amount,setAmount]=useState('')
    const [payer,setPayer]=useState('')
    const [participants,setParticipents]=useState('')


    const [showdroplist,setDropList]=useState(false);

    
    useEffect(()=>{

        const setState=async () =>{
        try{

           const loadingData = await AsyncStorage.getItem('loading');
           const membersData= await AsyncStorage.getItem('members');
           const groupData=await AsyncStorage.getItem('groupData')
           
           
       if(loadingData !== null){
        const loadingState=JSON.parse(loadingData)
        setLoading(loadingState)
    }
    if(membersData !== null){
        const membersState=JSON.parse(membersData)
        setMembers(membersState)
    }
    if(groupData !== null){
        const groupDataState=JSON.parse(groupData)
        setGroupData(groupDataState)
    }


  
        }catch(error){
            console.error("error fetching State")
        }
    }
  
    setState();
    }, [])

    // Render function for each member item
    const renderMember = ({ item }: { item: GroupMember }) => (
        <View className="flex-row items-center justify-between p-3 border-b border-gray-100">
          <View className="flex-1">
            <Text className="font-medium">{item.profiles?.name || item.email}</Text>
            {item.status === 'invited' && (
              <Text className="text-xs text-orange-500 font-medium">Invited</Text>
            )}
          </View>
        </View>
      );
  
      // Key extractor function - returns unique key for each item
      const keyExtractor = (item: GroupMember) => item.id?.toString() || item.email;



    return (
        <ScrollView className="flex  bg-white">
            <View className="p-4">
                <View className="flex-row items-center mb-6">
                    <TouchableOpacity onPress={onBack} className="p-2 mr-2">
                        <Ionicons name="arrow-back" size={20} color="#000" />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold">Add Expense</Text>
                </View>

                <View className="space-y-6">
                    <View>
                        <Text className="text-sm font-medium text-gray-700 mb-1">
                            Description
                        </Text>
                        <TextInput
                            className="w-full p-3 border border-gray-300 rounded-lg"
                            placeholder="What was this expense for?"
                            value={description}
                            onChangeText={setDescription}
                            autoCapitalize="none" 
                        />
                    </View>

                    <View>
                        <Text className="text-sm font-medium text-gray-700 mb-1">
                            Amount
                        </Text>
                        <View className="relative">
                            <Text className="absolute left-3 top-3 text-gray-500">$</Text>
                            <TextInput
                                className="w-full p-3 pl-8 border border-gray-300 rounded-lg"
                                placeholder="0.00"
                                keyboardType="numeric"
                                value={amount}
                                onChangeText={setAmount}
                            
                            />
                        </View>
                    </View>

                    <View>
                        <Text className="text-sm font-medium text-gray-700 mb-1">
                            Paid by
                        </Text>
                        <View className="border border-gray-300 rounded-lg bg-white p-3">
                            <TextInput
                                className="w-full"
                                placeholder="Select payer"
                                value={payer}
                                onChangeText={setPayer}
                                autoCapitalize="none" 
                            />
                        </View>
                    </View>

                    <View>
                        <Text className="text-sm font-medium text-gray-700 mb-1">
                            Date
                        </Text>
                        <View className="relative">
                            <TextInput
                                className="w-full p-3 border border-gray-300 rounded-lg"
                                placeholder="Select date"
                            />
                            <View className="absolute right-3 top-3">
                                <Ionicons name="calendar" size={20} color="#9CA3AF" />
                            </View>
                        </View>
                    </View>

                    <View>
                        <Text className="text-sm font-medium text-gray-700 mb-1">
                            Split between
                        </Text>
                        <View style={styles.flatListContainer}>
                        <FlatList 
  data={members}
  renderItem={renderMember}
  keyExtractor={keyExtractor}
  showsVerticalScrollIndicator={false}
  ItemSeparatorComponent={() => <View style={{ height: 1 }} />}
  />
                        </View>
                    </View>

                    <TouchableOpacity
                        className="w-full bg-blue-500 py-3 rounded-lg mt-4"
                    >
                        <Text className="text-white text-center font-medium">
                            Add Expense
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

export default ExpenseForm;



const styles = StyleSheet.create({
    flatListContainer: {
      height: 400, 
      borderRadius: 1
    },
  }) 