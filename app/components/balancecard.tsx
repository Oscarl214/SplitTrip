import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useEffect, useState } from 'react'
import { Text, View } from 'react-native'

import { useAuth } from '../provider/authContext'
import { supabase } from '../utils/supabase'
interface BalanceCardProps {

    groupData: GroupData | null;
  }

  interface GroupData {
    id: string | null,
    name: string | null,
  created_by: string | null,
  created_at: string | null, 
  description: string | null,
  }


  interface Balance {
    balance: 'string' | null
  }
const BalanceCard = ({groupData}: BalanceCardProps) => {

const {contextsession}=useAuth()
const [userBalance,setUserBalance]=useState('')


  useEffect(()=>{
    console.log("BalanceCard useEffect triggered");
    console.log("groupData:", groupData);
    console.log("contextsession:", contextsession);

    if(!contextsession?.id || !groupData?.id) {
      console.log("Missing required data - contextsession or groupData");
      return;
    }

    const fetchUsersBalance=async ()=>{
    try {
      console.log("Starting fetchUsersBalance");
      console.log("group_id:", groupData?.id);
      console.log("user_id:", contextsession?.id);

      // Use the auth ID directly as the profile ID
      console.log("Using auth ID as profile ID:", contextsession?.id)
      const profileId = contextsession?.id

      // First, let's check if there are any records in group_balances for this user/group
      const {data: allBalances, error: allBalancesError} = await supabase
        .from('group_balances')
        .select('*')
        .eq('group_id', groupData?.id)
        .eq('user_id', profileId)
      
      console.log("All balances for this user/group:", allBalances)
      console.log("All balances error:", allBalancesError)

      const {data:myBalance, error:Balanceerror}= await supabase
      .from('group_balances')
      .select('balance')
      .eq('group_id', groupData?.id)
      .eq('user_id', profileId)
      .single()

if(Balanceerror){
  console.error("Error Fetching Full Balance:", Balanceerror)
  console.log("This might mean no balance record exists for this user/group")
  return
}

console.log("users total balance", myBalance)
console.log("Balance value:", myBalance?.balance)
console.log("Balance type:", typeof myBalance?.balance)

if(myBalance && myBalance.balance !== null && myBalance.balance !== undefined) {
  console.log("Setting balance to:", myBalance.balance)
  setUserBalance(myBalance.balance.toString())
} else {
  console.log("No balance data found or balance is null/undefined");
  setUserBalance('0.00')
}

    }catch(error){
      console.error("Error Getting Balance:", error)
  }

  }

  fetchUsersBalance()

  }, [contextsession?.id, groupData?.id])


  const isNegative= Number(userBalance)<0;

    const formattedAmount = Math.abs(Number(userBalance)).toFixed(2)
  return (
    <LinearGradient
    colors={['#89ffdd', '#ffffff']}
    style={{
        paddingVertical: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    }}
>
  <View className='py-4  rounded-lg border-gray-200 shadow-sm'>
    <View className='flex item-center flex-row '>
      {isNegative ? (
        <Ionicons name='arrow-up-outline' size={54} color='green'/>
      ) : (
        <Ionicons name='arrow-down-outline' size={54} color='red'/>
      )}
      <View className='flex flex-col justify-center items-center ml-4'>
        <Text className='text-xl text-black'>
          {isNegative ? 'You owe': ' You are owed'}
        </Text>
        <Text className={`text-4xl font-bold ${isNegative ? 'text-red-500' : 'text-green-500'}`}>
   
          ${userBalance}
        </Text>
      </View>
    </View>
    <View className='px-3 mt-3'>
      <View className='flex flex-row justify-between'>
        <Text className='text-gray-500 text-xl'>Oscar Owes You</Text>
        <Text className='font-medium text-xl'>$40.50</Text>
      </View>
      <View className='flex flex-row justify-between text-xl'>
        <Text className='text-gray-500 mb-4 text-xl'>You Owe Jenda </Text>
        <Text className='font-medium text-xl'>$45.50</Text>
      </View>
    </View>
  </View>
  </LinearGradient>
  )
}

export default BalanceCard
