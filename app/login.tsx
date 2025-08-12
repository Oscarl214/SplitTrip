// 'use client';
// import * as Linking from 'expo-linking';
// import { useRouter } from 'expo-router';
// import { useEffect, useState } from 'react';
// import { Alert, Button, TextInput, View } from 'react-native';
// import { supabase } from './utils/supabase';

// export default function LoginScreen() {
//   const [email, setEmail] = useState('');
//   const router = useRouter();

//   const handleLogin = async () => {
//     const { error } = await supabase.auth.signInWithOtp({
//       email,
//       options: {
//         shouldCreateUser: true,
//         emailRedirectTo: 'splittrip://',
//       },
//     }); 

//     if (error) {
//       Alert.alert('Login Error', error.message);
//     } else {
//       Alert.alert('Check your email', 'We sent you a magic link!');
//     }
//   };


//   useEffect(() => {
//     const handleDeepLink = async ({ url }: Linking.EventType) => {
//       console.log('Received deep link:', url);
      
//       // Check if the URL contains an access token or code
//       if (url.includes('access_token') || url.includes('code=')) {
//         const { error } = await supabase.auth.exchangeCodeForSession(url);
//         if (error) {
//           console.error('Error exchanging code:', error.message);
//           Alert.alert('Authentication Error', error.message);
//         } else {
//           console.log('User is signed in!');
//           router.replace('/');
//         }
//       }
//     };
  
//     const sub = Linking.addEventListener('url', handleDeepLink);
//     return () => sub.remove();
//   }, []);
  

//   return (
//     <View className="flex-1 justify-center items-center gap-4 p-4">
//       <TextInput
//         placeholder="Enter your email"
//         value={email}
//         onChangeText={setEmail}
//         className="w-full border px-4 py-2 rounded-md"
//         keyboardType="email-address"
//         autoCapitalize="none"
//       />
//       <Button title="Send Magic Link" onPress={handleLogin} />
//     </View>
//   );
// }
