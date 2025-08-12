import { makeRedirectUri } from "expo-auth-session";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { Button } from "react-native";
import { supabase } from "./utils/supabase";
import {TextInput,Alert, View } from "react-native";
import { useLinkingURL } from "expo-linking";
import { useState } from "react";
// WebBrowser.maybeCompleteAuthSession(); // required for web only
const redirectTo = makeRedirectUri({
  scheme: 'splittrip',
  path: '',
});

console.log({redirectTo})
const createSessionFromUrl = async (url: string) => {
  const { params, errorCode } = QueryParams.getQueryParams(url);

  if (errorCode) throw new Error(errorCode);
  const { access_token, refresh_token } = params;

  if (!access_token) return;

  const { data, error } = await supabase.auth.setSession({
    access_token,
    refresh_token,
  });
  if (error) throw error;

  console.log("session", data.session)
  return data.session;
};

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





export default function Auth() {
  const [email,setEmail]=useState('');
 

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


  const url = Linking.useLinkingURL()

  console.log({url})
  if (url) createSessionFromUrl(url);

  return (
    <>
      <View className="flex-1 justify-center items-center gap-4 p-4">
      <TextInput
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        className="w-full border px-4 py-2 rounded-md"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Button onPress={sendMagicLink} title="Send Magic Link" />
      </View>
    </>
  );
}