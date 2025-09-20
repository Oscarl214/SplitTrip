import { View, Text , StyleSheet} from 'react-native'
import React from 'react'
import SkeletonText from './skeletonText'
const MemberListSkeleton = () => {
  return (
    <View style={styles.container}>
    <View style={styles.textContainer}>

      <SkeletonText width='75%' height={18}/>

      <SkeletonText width='75%' height={18}/>


        <SkeletonText width='25%' height={14}/>
    </View>
    </View>
  )
}

export default MemberListSkeleton 

  const styles=StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 8,
    backgroundColor: "#fff",
    borderRadius: 8,
  
  },
  textContainer: {
      flexDirection: "column",
      padding: 8,
      gap: 4,
  },
})