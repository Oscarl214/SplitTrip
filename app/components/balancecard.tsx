import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Text, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
interface BalanceCardProps {
    amount: number
  }


const BalanceCard = ({amount}: BalanceCardProps) => {

    const isNegative= amount<0

    const formattedAmount = Math.abs(amount).toFixed(2)
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
          ${formattedAmount}
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
