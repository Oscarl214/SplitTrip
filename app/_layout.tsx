'use client'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import './globals.css';

import { supabase } from "./utils/supabase";
export default function RootLayout() {
  const [Loading, setLoading] = useState(true);


  const router=useRouter();  

  useEffect(() => {

    const checkAuth= async ()=> {

    const {data: {session}}= await supabase.auth.getSession()


  
if (session) {
  router.replace('/creategroup')
    }else if(!session){
      router.replace('/auth')
    }


    const groupStr = await AsyncStorage.getItem('group');
    if (groupStr) {
      const group = JSON.parse(groupStr);
      const now = Date.now();
      const twentyFourHours = 24 * 60 * 60 * 1000;

      if (group.createdAt && now - group.createdAt < twentyFourHours) {
        router.replace('/(tabs)');
      } else {
        router.replace('/submitgroupid');
      }
    } else {
      router.replace('/creategroup');
    }
  };

checkAuth()
  }, []);



  return (
   
    <Stack
      screenOptions={{
        headerShown: false, 
      }}/>
    );
  }
