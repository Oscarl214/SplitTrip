import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";

export default function SubmitGroupId() {
  const [groupId, setGroupId] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    if (groupId.trim() === "") {
      setError("Please enter a group ID.");
      return;
    }
    // Replace this with your actual group fetch logic
    await AsyncStorage.setItem(
      "group",
      JSON.stringify({ id: groupId, createdAt: Date.now() })
    );
    router.replace("/(tabs)");
  };

  return (
    <View className="flex-1 justify-center items-center p-4">
      <Text className="text-xl font-bold mb-4">Enter Group ID</Text>
      <TextInput
        className="w-full p-3 border border-gray-300 rounded-lg mb-2"
        placeholder="Group ID"
        value={groupId}
        onChangeText={setGroupId}
      />
      {error ? <Text className="text-red-500 mb-2">{error}</Text> : null}
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
} 