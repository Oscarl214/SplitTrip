import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BalanceCard from '../components/balancecard';
import { ExpenseType } from '../components/expenseform';
import ExpensesDropDown from '../components/expensesdropdown';
import GroupHeader from '../components/groupheader';
import { fetchExpenseTypes } from '../utils/expenseTypes';
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

interface ExpenseItem {
  id: number | null,
  name: string | null,
  created_by: string | null,
  created_at: string | null, 
  description: string | null,
  total_amount: number | null,
  paid_by: string | null,
  type_id: string | null,
  expense_date: string | null,
  expense_types?: ExpenseType,
  profiles?: {
    name: string | null,
    email: string | null
  }
}

const Index = () => {
  const router = useRouter();
  
  const [ groupinfo, setGroupInfo]=useState<GroupInfo | null>(null);
const [groupData,setGroupData]=useState<GroupData | null>(null)
const [members, setMembers] = useState<GroupMember[]>([]);;
const [loading, setLoading]= useState(true);

const [expenses,SetExpenses]=useState<ExpenseItem[]>([])
const [expenseTypes, setExpenseTypes] = useState<ExpenseType[]>([])

useFocusEffect(
  React.useCallback(() => {
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
  }, [])
);

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


      try {
        const loadingState=JSON.stringify(false)  // Use the new loading state
        const membersState=JSON.stringify(members || [])  // Use the newly fetched members
        const groupDataState=JSON.stringify(data)  // Use the newly fetched group data
        await AsyncStorage.setItem('loading', loadingState)
 await AsyncStorage.setItem('members', membersState)
 await AsyncStorage.setItem('groupData', groupDataState )

      }catch(error){
console.log("error saving State", error)
      }
      console.log('Group data loaded:', data);
      console.log('Members loaded:', members);
    } catch (error) {
      console.error('Error in fetchGroupData:', error);
    }
  };
 
  fetchGroupData();
}, [groupinfo]); // Run when groupinfo changes

// Fetch expense types on component mount
useEffect(() => {
  const loadExpenseTypes = async () => {
    try {
      const types = await fetchExpenseTypes();
      setExpenseTypes(types);
    } catch (error) {
      console.error('Error loading expense types:', error);
    }
  };

  loadExpenseTypes();
}, []);

useEffect(() => {
  const fetchExpenses = async () => {
    console.log('fetchExpenses called, groupinfo:', groupinfo);
    
    if (!groupinfo?.id) {
      console.log('No groupinfo or group ID available yet');
      return;
    }

    try {
      const groupId = groupinfo.id;
      console.log('Fetching expenses for group ID:', groupId);

      const {data, error: ExpensesError} = await supabase
        .from("expenses")
        .select(`
          *,
          expense_types!expenses_type_id_fkey(name, icon, color),
          profiles!expenses_created_by_fkey(name, email)
        `)
        .eq('group_id', groupId);

      if(ExpensesError){
        console.error("Error fetching expenses:", ExpensesError);
        return;
      }

      console.log("Expenses data:", data);
      console.log("Number of expenses found:", data?.length || 0);
      

      
      SetExpenses(data || []);
    } catch(error){
      console.error('Error in fetchExpenses:', error);
    }
  };

  // Only call fetchExpenses if groupinfo exists
  if (groupinfo?.id) {
    fetchExpenses();
  }
}, [groupinfo]);
  return (
    <SafeAreaView className='flex flex-col p-4 h-full bg-white'>
      <GroupHeader loading={loading} members={members} groupData={groupData} />  {/* Pass in title of group created and the amount of members as props once I have that data*/}
      <View className='flex flex-row justify-between items-center mt-6'>
        <Text className='text-bold text-xl'>Your Balance</Text>
        <Pressable 
          className="flex flex-row items-center justify-center text-blue-500" 
          onPress={() => router.push('/(tabs)/settle')}
        >
          <Text className="text-blue-500 mr-1 text-sm font-medium">Settle Up</Text>
          <Ionicons name="arrow-forward-outline" size={14} color='blue' /> 
        </Pressable>
      </View>
        <BalanceCard amount={-24.50}/>
        <View className='flex flex-row justify-between mt-8'>
          <Text className='text-2xl font-bold'>Recent Expenses</Text>
          <Pressable 
            className="flex flex-row " 
         
            onPress={() => router.push('/(tabs)/add-expense')}
          >
          <Ionicons name="add-outline" size={24} color='black' style={{ marginRight: 4 }} />
          <Text className='text-xl font-medium text-blue-500'>Add Expense</Text>
          </Pressable>
        </View>
        <ExpensesDropDown expenses={expenses}  />
        {/* <Expenses/> */}
    </SafeAreaView>
  );
}

export default Index;
