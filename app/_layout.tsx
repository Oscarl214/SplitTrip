'use client';

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import "./globals.css";
import { supabase } from "./utils/supabase";

function RootLayout() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      // Small delay to ensure Stack is mounted
      await new Promise(resolve => setTimeout(resolve, 100));
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          // console.log("No session found, redirecting to /auth");
          router.replace("/auth");
          return;
        }

        const userId = session.user.id;
        const userEmail = session.user.email;

        // Upsert profile (insert or update if exists)
        const { error: upsertError } = await supabase
          .from("profiles")
          .upsert([{ id: userId, email: userEmail }], {
            onConflict: 'id'
          });
        
        if (upsertError) {
          console.error("Error upserting profile:", upsertError);
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
          console.log("No groups found, redirecting to /creategroup");

          router.replace('/creategroup')
       
          // router.replace("/404")
        } else if (memberships.length === 1) {
          const groupId = memberships[0].group_id;
          console.log(`One group found, redirecting to /submitgroupid with group=${groupId}`);
          router.replace({
            pathname: "/submitgroupid/[id]",
            params: { id: groupId },
          });

          //go directly to the app to show the group info as needed 
        } else {
          console.log("Multiple groups found, redirecting to /selectgroup");
          router.replace("/selectgroup");
        }
      } catch (err) {
        console.error("Unexpected error in auth check:", err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return <Stack screenOptions={{ headerShown: false }} 
  />;
}

export default RootLayout;
