import { makeRedirectUri } from "expo-auth-session";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as Linking from "expo-linking";
import { useEffect, useState } from "react";
import { Alert, Button, TextInput, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from "./provider/authContext";
import { supabase } from "./utils/supabase";
// WebBrowser.maybeCompleteAuthSession(); // required for web only
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { LoginPageStyles } from "./styles/loginstyles";
const redirectTo = makeRedirectUri({
  scheme: 'splittrip',
  path: '/',
});

console.log({redirectTo})

//Function that creates the token & session based off the url once magic link is clicked on by user



//IF we decide to add any other login methods: giothub, google, etc. 
// const performOAuth = async () => {
//   const { data, error } = await supabase.auth.signInWithOAuth({
//     provider: "github",
//     options: {
//       redirectTo,
//       skipBrowserRedirect: true,
//     },
//   });
//   if (error) throw error;

//   const res = await WebBrowser.openAuthSessionAsync(
//     data?.url ?? "",
//     redirectTo
//   );

//   if (res.type === "success") {
//     const { url } = res;
//     await createSessionFromUrl(url);
//   }
// };





export default function Login() {
  const {setContextSession, contextsession}=useAuth()
  const [email,setEmail]=useState('');

  const router = useRouter();

  // Handle redirect when user is already authenticated
  useEffect(() => {
    if (contextsession) {
      router.replace('/app-content');
    }
  }, [contextsession, router]);
 


  //function that sends magic link to email that is provided by user
  const sendMagicLink = async () => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: redirectTo,
      },
    });
  
    
    if (error) {
      Alert.alert('Login Error', error.message);
    } else {
      Alert.alert('Check your email', 'We sent you a magic link!');
    }
  };

  const clearSession = async () => {
    await supabase.auth.signOut();
    setContextSession(null);
    Alert.alert('Session Cleared', 'All authentication data has been cleared');
  };


  const url = Linking.useLinkingURL()

  console.log({url})

  const createSessionFromUrl = useCallback(async (url: string) => {
  
    const { params, errorCode } = QueryParams.getQueryParams(url);
  
  
    console.log("token", params)
    if (errorCode) throw new Error(errorCode);
    const { access_token, refresh_token } = params;
  
    if (!access_token) return;
  
    const { data, error } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });
    if (error) throw error;
  
    console.log("session", data.session)
  
    if (!data.session || !data.session.user) {
      console.error('Invalid session data');
      return;
    }
    
    setContextSession({
      id: data.session.user.id, 
      email: data.session.user.email ?? 'no-email@example.com'
    });
    
    // Navigate to app-content after successful login
    router.replace('/app-content');
    return data.session;
  }, [setContextSession, router]);

  // Use useEffect to handle URL processing instead of conditional hook call
  useEffect(() => {
    if (url) {
      createSessionFromUrl(url);
    }
  }, [url, createSessionFromUrl]);

  const inputstyles=LoginPageStyles()

  return (
 
        <LinearGradient
          colors={['#2b5876', '#4e4376']}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          <SafeAreaView className="flex-1 justify-center items-center gap-4 p-4">
        <View style={{ width: '100%', maxWidth: 300 }}>

          <TextInput
            placeholder="Enter your email"
            placeholderTextColor="#666"
            value={email}
            onChangeText={setEmail}
            style={inputstyles.input}
            keyboardType="email-address"
            autoCapitalize="none" />

        </View>
        <Button onPress={sendMagicLink} title="Send Magic Link" />
        <Button onPress={clearSession} title="Clear Session (Debug)" color="red" />
      </SafeAreaView>
       </LinearGradient>
    
  );
}