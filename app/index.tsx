import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from './provider/authContext';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function Index() {
  const { contextsession, loading } = useAuth();



  if (loading) {
    return (
      <SafeAreaView>

      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
      </SafeAreaView>
    );
  }

  if (!contextsession) {
 
    return <Redirect href="/login" />;
  }

  return <Redirect href="/app-content" />;
}
