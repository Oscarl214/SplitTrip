'use client';

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import "./globals.css";
import { supabase } from "./utils/supabase";

import { ActivityIndicator, Text } from 'react-native';
import { useAuth } from "./provider/authContext";


const AppContent = () => {

    const router = useRouter();
 
    const {contextsession,loading:sessionLoading}=useAuth()
    const [navigationLoading, setNavigationLoading] = useState(false);
  
    const isLoading = sessionLoading || navigationLoading;
  
  
    useEffect(() => {
      if (!contextsession) {
        console.log("No session found");
        return;
      }
  
  
      if(sessionLoading){
        return
      }
  
  
      const checkAuth = async () => {
        // Small delay to ensure Stack is mounted
        await new Promise(resolve => setTimeout(resolve, 100));

        setNavigationLoading(true);
        try {

          const userId = contextsession.id;
          const userEmail = contextsession.email;

          // First, verify the user still exists in the auth.users table
          const { data: { user }, error: userError } = await supabase.auth.getUser();
          
          if (userError || !user) {
            console.log("User no longer exists in auth, signing out");
            await supabase.auth.signOut();
            router.replace("/login");
            return;
          }

          // Upsert profile (insert or update if exists)
          const { error: upsertError } = await supabase
            .from("profiles")
            .upsert([{ id: userId, email: userEmail }], {
              onConflict: 'id'
            });
          
          if (upsertError) {
            console.error("Error upserting profile:", upsertError);
            // If it's a foreign key constraint error, the user doesn't exist in auth.users
            if (upsertError.code === '23503') {
              console.log("User doesn't exist in auth.users, signing out");
              // Clear any cached data
              await AsyncStorage.removeItem("activeGroup");
              await supabase.auth.signOut();
              router.replace("/login");
              return;
            }
            return;
          }
  
          // Get group memberships
          const { data: memberships, error: membershipError } = await supabase
            .from("group_members")
            .select("group_id")
            .eq("profile_id", userId);
  
          if (membershipError) {
            console.error("Error checking memberships:", membershipError);
            return;
          }
  
          // Check cached active group from AsyncStorage
  
          //This is to check if the user has logged in so they dont have to re log in w magic link
          //kinda annoying in dev mode
          // AsyncStorage.removeItem("activeGroup")
          const groupStr = await AsyncStorage.getItem("activeGroup");
  
          if (groupStr) {
            const activeGroup = JSON.parse(groupStr);
            const now = Date.now();
            const twentyFourHours = 24 * 60 * 60 * 1000;
  
            const isValidGroup =
              memberships && memberships.some((m) => m.group_id === activeGroup.id);
  
            if (
              activeGroup.createdAt &&
              now - activeGroup.createdAt < twentyFourHours &&
              isValidGroup
            ) {
              console.log("Using cached active group, routing to /(tabs)");
              router.replace("/(tabs)");
              return;
            } else {
              await AsyncStorage.removeItem("activeGroup"); 
              console.log("Cached active group expired or invalid, removed.");
            }
          }
  
          // No cached or expired active group, route based on group membership count
          if (!memberships || memberships.length === 0) {
            console.log("No groups found, routing to /creategroup");
            router.replace("/creategroup");
          } else if (memberships.length === 1) {
            const groupId = memberships[0].group_id;
            console.log(`One group found, routing to /submitgroupid with group=${groupId}`);
            router.replace(`/submitgroupid/${groupId}`);
          } else {
            console.log("Multiple groups found, routing to /selectgroup");
            router.replace("/selectgroup");
          }
        } catch (err) {
          console.error("Unexpected error in auth check:", err);
        } finally {
         console.log("Successful routing user")
         setNavigationLoading(false);
        }
      };
  
      checkAuth();
    }, [contextsession, router]);
  
  console.log('AppContent rendering');
  
  if (isLoading) {
    return <ActivityIndicator size="large" />;
  }
  
  return <Text>Welcome! Session loaded successfully.</Text>;
}

export default AppContent
