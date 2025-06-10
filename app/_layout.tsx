import { Stack } from "expo-router";
import './globals.css';
import SafeArea from "./safearea";
import { StatusBar, View } from "react-native";
export default function RootLayout() {

  return  (  
   
    // <StatusBar hidden={true} />
    <Stack
    screenOptions={{
      headerShown: false, 
      
    }}
    />
  
);
}
