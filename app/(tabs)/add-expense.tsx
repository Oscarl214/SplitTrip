import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import ExpenseForm from '../components/expenseform'
import { SafeAreaView } from 'react-native-safe-area-context'
const AddExpense = () => {
  return (
    <SafeAreaView className='flex flex-col p-4 h-full bg-white'>
      <ExpenseForm/>
    </SafeAreaView>
  )
}

export default AddExpense

