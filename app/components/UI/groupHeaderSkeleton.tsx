import { View, Text , StyleSheet} from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import SkeletonText from "../UI/skeletonText";
const GroupHeaderSkeleton = () => {
  return (
    <View style={styles.container}>
 
    <View style={styles.textContainer}>
    <SkeletonText width="70%" height={24} />

    </View>
    <View className='flex flex-col'>

    <View style={styles.textContainer}>
      <Ionicons name="people-outline" size={24} color='gray' style={{ marginRight: 4 }}/>
   
      <SkeletonText width="70%" height={24} />
    </View>
    </View>
    
  </View>
  )
}

export default GroupHeaderSkeleton

const styles = StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 16,
      backgroundColor: "#fff",
      borderRadius: 8,
    
    },
    textContainer: {
        flexDirection: "row",
        justifyContent: "flex-start",
    },
  });