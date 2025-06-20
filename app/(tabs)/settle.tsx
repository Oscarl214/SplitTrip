import AntDesign from '@expo/vector-icons/AntDesign';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
const Settle = () => {
  const onBack = () => {
    // Handle back navigation
  }

  return (
    <SafeAreaView className="flex-1 h-full bg-white">
      <View className="flex-row items-center p-4 mb-6">
        <TouchableOpacity onPress={onBack} className="p-2 mr-2">
          <Link href='/(tabs)'>
          <AntDesign name="leftcircleo" size={24} color="black" />
          </Link>
        </TouchableOpacity>
        <Text className="text-xl font-bold">Settle Up</Text>
      </View>

      <View className="p-4">
        <View className="border border-gray-200 rounded-lg p-4 mb-4">
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="font-medium mb-1">You owe Michael</Text>
              <Text className="text-2xl font-bold text-red-500">$170.50</Text>
            </View>
            <TouchableOpacity className="bg-blue-500 px-4 py-2 rounded-lg">
              <Text className="text-white font-medium">Pay</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="border border-gray-200 rounded-lg p-4 mb-4">
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="font-medium mb-1">Emma owes you</Text>
              <Text className="text-2xl font-bold text-green-500">$45.00</Text>
            </View>
            <View className="flex-row items-center">
              <AntDesign name="checkcircleo" size={24} color="black" />
              <Text className="text-green-500 ml-1">Paid</Text>
            </View>
          </View>
        </View>

        <Text className="text-lg font-bold mt-6 mb-4">Payment Methods</Text>
        
        <View className="space-y-2 gap-4">
          <TouchableOpacity className="flex-row justify-between items-center p-4 border border-gray-200 rounded-lg">
            <Text className="font-medium">Venmo</Text>
            <AntDesign name="rightcircleo" size={24} color="black" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row justify-between items-center p-4 border border-gray-200 rounded-lg">
            <Text className="font-medium">PayPal</Text>
            <AntDesign name="rightcircleo" size={24} color="black" />
          </TouchableOpacity>

          <TouchableOpacity className="flex-row justify-between items-center p-4 border border-gray-200 rounded-lg">
            <Text className="font-medium">Cash</Text>
            <AntDesign name="rightcircleo" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Settle 