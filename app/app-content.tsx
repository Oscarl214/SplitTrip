'use client';

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import "./globals.css";
import { useAuth } from "./provider/authContext";
import { supabase } from "./utils/supabase";


const AppContent = () => {

    const router = useRouter();
 
    const {contextsession,loading:sessionLoading,setContextSession}=useAuth()
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

          // Check if user profile exists and has a name
          const { data: existingProfile, error: profileCheckError } = await supabase
            .from("profiles")
            .select("id, email, name")
            .eq("id", userId)
            .single();

          if (profileCheckError && profileCheckError.code !== 'PGRST116') {
            console.error("Error checking profile:", profileCheckError);
            return;
          }

          // If profile doesn't exist or doesn't have a name, redirect to profile setup
          if (!existingProfile || !existingProfile.name) {
            console.log("User needs to complete profile setup");
            router.replace("/profile-setup");
            return;
          }

          // Update session context with the name (only if different)
          if (contextsession?.name !== existingProfile.name) {
            setContextSession({
              id: userId,
              email: userEmail,
              name: existingProfile.name
            });
          }

          // Update any invited memberships to active status
          const { error: updateMembershipError } = await supabase
            .from('group_members')
            .update({ 
              profile_id: userId, 
              status: 'active',
              joined_at: new Date().toISOString()
            })
            .eq('email', userEmail)
            .is('profile_id', null);
            
          if (updateMembershipError) {
            console.error('Error updating invited membership:', updateMembershipError);
          }
  
          // Get all groups the user is associated with
          console.log("Checking groups for user ID:", userId);
          
          // 1. Get groups the user created
          const { data: createdGroups, error: createdGroupsError } = await supabase
            .from("groups")
            .select("id")
            .eq("created_by", userId);

          if (createdGroupsError) {
            console.error("Error checking created groups:", createdGroupsError);
            return;
          }

          // 2. Get groups the user is a member of (but didn't create)
          const { data: memberGroups, error: memberGroupsError } = await supabase
            .from("group_members")
            .select("group_id")
            .or(`profile_id.eq.${userId},email.eq.${userEmail}`);

          if (memberGroupsError) {
            console.error("Error checking member groups:", memberGroupsError);
            return;
          }

          // 3. Combine both lists (avoid duplicates)
          const allGroupIds = new Set();
          
          // Add created groups
          if (createdGroups) {
            createdGroups.forEach(group => allGroupIds.add(group.id));
          }
          
          // Add member groups
          if (memberGroups) {
            memberGroups.forEach(member => allGroupIds.add(member.group_id));
          }

          const totalGroups = Array.from(allGroupIds);
          console.log("Found total groups:", totalGroups);
          console.log("Created groups:", createdGroups?.length || 0);
          console.log("Member groups:", memberGroups?.length || 0);
  
          // Check cached active group from AsyncStorage
  
          //This is to check if the user has logged in so they dont have to re log in w magic link
          //kinda annoying in dev mode
          // AsyncStorage.removeItem("activeGroup")
          const groupStr = await AsyncStorage.getItem("activeGroup");
  
          if (groupStr) {
            const activeGroup = JSON.parse(groupStr);
            const now = Date.now();
            const twentyFourHours = 24 * 60 * 60 * 1000;
  
            const isValidGroup = totalGroups.includes(activeGroup.id);
  
            if (
              activeGroup.createdAt &&
              now - activeGroup.createdAt < twentyFourHours &&
              isValidGroup
            ) {
              console.log("Using cached active group, routing to main app");
              router.replace("/(tabs)");
              return;
            } else {
              await AsyncStorage.removeItem("activeGroup"); 
              console.log("Cached active group expired or invalid, removed.");
            }
          }
  
          // No cached or expired active group, route based on total group count
          if (totalGroups.length === 0) {
            console.log("No groups found, routing to /creategroup");
            router.replace("/creategroup");
          } else if (totalGroups.length === 1) {
            const groupId = totalGroups[0];
            console.log(`One group found, routing to main app with group=${groupId}`);
            
            // Store the active group for the app to use
            await AsyncStorage.setItem("activeGroup", JSON.stringify({
              id: groupId,
              createdAt: Date.now()
            }));
            
            router.replace("/(tabs)");
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
    }, [sessionLoading, router]);
  
  console.log('AppContent rendering');
  
  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>


    <ActivityIndicator size="large" />
   
      </SafeAreaView>
    );
  }
  
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Welcome! Session loaded successfully.</Text>
    </View>
  );
}

export default AppContent
