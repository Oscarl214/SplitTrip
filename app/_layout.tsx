'use client'
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { supabase } from "./utils/supabase";

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.replace('/auth');
        return;
      }

      const userId = session.user.id;
      const userEmail = session.user.email;

      // Ensure profile exists in db to decide to 
      //1. input into db to then->
      const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error checking profile:', profileError);
        return;
      }

      if (!existingProfile) {
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([{ id: userId, email: userEmail }]);

        if (insertError) {
          console.error('Error inserting profile:', insertError);
          return;
        }
      }

      // Check for all groups login user is apart of
      
      const { data: memberships, error: membershipError } = await supabase
        .from('group_members')
        .select('group_id')
        .eq('profile_id', userId);

      if (membershipError) {
        console.error('Error checking memberships:', membershipError);
        return;
      }

      // first check the local storage to ensure user can access app if they happened to have already gone through this process
      //active for 24 hours
      const groupStr = await AsyncStorage.getItem('activeGroup');

      if (groupStr) {
        const activeGroup = JSON.parse(groupStr);
        const now = Date.now();
        const twentyFourHours = 24 * 60 * 60 * 1000;

        // If active group cache is fresh and still valid, send them into the app
        if (activeGroup.createdAt && now - activeGroup.createdAt < twentyFourHours) {
          router.replace('/(tabs)');
          return;
        }
      }

      // No active cached group or expired - route based on groups count
      if (!memberships || memberships.length === 0) {
        // No groups → send to create group
        router.replace('/creategroup');
      } else if (memberships.length === 1) {
        // One group → send to submitgroupid with that group id 
        const groupId = memberships[0].group_id;
        router.replace(`/submitgroupid?group=${groupId}`);
      } else {
        // Multiple groups → send to group selection page
        router.replace('/selectgroup' as any);
      }
    }; 

    checkAuth();
  }, []);

  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}
