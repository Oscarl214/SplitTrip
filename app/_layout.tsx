'use client'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import './globals.css';
import { Router, useRouter } from 'expo-router';
export default function RootLayout() {
  const [Loading, setLoading] = useState(true);
  
  const router=useRouter();

  useEffect(() => {
    AsyncStorage.removeItem('group')
    AsyncStorage.getItem('').then((groupStr) => {
      if (groupStr) {
        const group = JSON.parse(groupStr);
        const now = Date.now();
        const twentyFourHours = 24 * 60 * 60 * 1000;
        if (group.createdAt && now - group.createdAt < twentyFourHours) {
         
          router.navigate('/(tabs)')
        } else {
         
        router.navigate('/submitgroupid')
        }
      } else {
        
        router.navigate('/creategroup')
      }
      setLoading(false);
    });
  }, []);

  if (Loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false, 
      }}
      initialRouteName={'creategroup'}
    />
  );
}
