import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from './provider/authContext';

export default function Index() {
  const { contextsession, loading } = useAuth();

  console.log('Index component - loading:', loading, 'session:', contextsession?.id);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!contextsession) {
    console.log('No session, redirecting to login');
    return <Redirect href="/login" />;
  }

  console.log('Session exists, redirecting to app-content');
  return <Redirect href="/app-content" />;
}
