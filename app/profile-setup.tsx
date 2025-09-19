'use client';

import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Button, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from './provider/authContext';
import { LoginPageStyles } from './styles/loginstyles';
import { supabase } from './utils/supabase';

export default function ProfileSetup() {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { contextsession, setContextSession } = useAuth();
  const router = useRouter();

  const handleCompleteSetup = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    if (!contextsession) {
      Alert.alert('Error', 'No active session found');
      return;
    }

    setIsLoading(true);

    try {
      // Update the profile in the database with the name
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert([{ 
          id: contextsession.id, 
          email: contextsession.email,
          name: name.trim()
        }], {
          onConflict: 'id'
        });

      if (profileError) {
        console.error('Error updating profile:', profileError);
        Alert.alert('Error', 'Failed to save your name. Please try again.');
        return;
      }

      // Update the session context with the name
      setContextSession({
        ...contextsession,
        name: name.trim()
      });

      // Navigate to the main app
      router.replace('/app-content');
    } catch (error) {
      console.error('Unexpected error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyles = LoginPageStyles();

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
      <SafeAreaView className="flex-1 justify-center items-center gap-6 p-4">
        <View style={{ width: '100%', maxWidth: 300 }}>
          <Text style={{ 
            color: 'white', 
            fontSize: 24, 
            fontWeight: 'bold', 
            textAlign: 'center',
            marginBottom: 8
          }}>
            Welcome to SplitTrip!
          </Text>
          <Text style={{ 
            color: '#e0e0e0', 
            fontSize: 16, 
            textAlign: 'center',
            marginBottom: 24
          }}>
            Let's get to know you better
          </Text>

          <TextInput
            placeholder="Enter your name"
            placeholderTextColor="#666"
            value={name}
            onChangeText={setName}
            style={inputStyles.input}
            autoCapitalize="words"
            autoFocus
          />
        </View>

        <Button 
          onPress={handleCompleteSetup} 
          title={isLoading ? "Setting up..." : "Complete Setup"} 
          disabled={isLoading}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}
