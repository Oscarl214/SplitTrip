
import { Stack } from 'expo-router';
import { AuthProvider } from "./provider/authContext";

function RootLayout() {
  console.log('RootLayout rendering');

  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
  ) 
}

export default RootLayout;
