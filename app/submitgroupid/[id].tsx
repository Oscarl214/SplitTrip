import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, Button, TextInput } from 'react-native';

export default function SubmitGroupIdPage() {
  const params = useLocalSearchParams();
  const rawGroupId = params.id;
  const groupId = Array.isArray(rawGroupId) ? rawGroupId[0] : rawGroupId ?? "";
  

  const [groupIdInput, setGroupIdInput] = useState(groupId);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    console.log('Group ID from route:', groupId);
  }, [groupId]);

  const handleSubmit = async () => {
    if (groupIdInput.trim() === "") {
      setError("Please enter a group ID.");
      return;
    }

    // TODO: Optionally validate the groupIdInput against DB here

    await AsyncStorage.setItem(
      "activeGroup",
      JSON.stringify({ id: groupIdInput.trim(), createdAt: Date.now() })
    );

    router.replace("/(tabs)");
  };

  return (
    <View className="flex-1 justify-center items-center p-4">
      <Text className="text-xl font-bold mb-4">Join a Group</Text>
      <TextInput
        className="w-full p-3 border border-gray-300 rounded-lg mb-2"
        placeholder="Group ID"
        value={groupIdInput}
        onChangeText={setGroupIdInput}
      />
      {error ? <Text className="text-red-500 mb-2">{error}</Text> : null}
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
}
