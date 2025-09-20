import { View, Text , TextInput, StyleSheet} from 'react-native'
import { TouchableOpacity

 } from 'react-native'
 import { AntDesign } from '@expo/vector-icons'
import React, {useState} from 'react'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
const addMember = () => {

    const router=useRouter()

    const [email,setEmail]=useState('')
  return (
    <SafeAreaView className="flex-1 bg-white">
           <View className="p-4">
           <View className="flex-row items-center mb-6">
          <TouchableOpacity onPress={() => router.push('/group')} className="p-2 mr-2">
          <AntDesign name="arrowleft" size={24} color="black" />
          </TouchableOpacity>
        </View>
      <Text className='text-2xl font-bold mb-5 px-3'>Invite a New Member!</Text>
     
      <TextInput
            placeholder="Enter your email"
            placeholderTextColor="#666"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none" />
           </View>
    </SafeAreaView>
  )
}

export default addMember

const styles=StyleSheet.create({
    input: {
        height: 60,
        borderWidth: 2,
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingVertical: 16,
        fontSize: 17,
        backgroundColor: 'white',
        fontWeight: "500" as const,
        borderColor: '#ddd',
        color: '#000000',
        textAlign: 'left' as const,
      },
  })