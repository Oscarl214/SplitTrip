import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BalanceCard from '../components/balancecard';
import Expenses from '../components/expenses';
import GroupHeader from '../components/groupheader';

const Index = () => {
  const router = useRouter();
  
  return (
    <SafeAreaView className='flex flex-col p-4 h-full bg-white'>
      <GroupHeader />  {/* Pass in title of group created and the amount of members as props once I have that data*/}
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
        <Expenses/>
    </SafeAreaView>
  );
}

export default Index;
