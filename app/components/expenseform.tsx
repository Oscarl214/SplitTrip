import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

const ExpenseForm = () => {
    const router = useRouter();

    const onBack = () => {
        router.back();
    };

    return (
        <ScrollView className="flex  bg-white">
            <View className="p-4">
                <View className="flex-row items-center mb-6">
                    <TouchableOpacity onPress={onBack} className="p-2 mr-2">
                        <Ionicons name="arrow-back" size={20} color="#000" />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold">Add Expense</Text>
                </View>

                <View className="space-y-6">
                    <View>
                        <Text className="text-sm font-medium text-gray-700 mb-1">
                            Description
                        </Text>
                        <TextInput
                            className="w-full p-3 border border-gray-300 rounded-lg"
                            placeholder="What was this expense for?"
                        />
                    </View>

                    <View>
                        <Text className="text-sm font-medium text-gray-700 mb-1">
                            Amount
                        </Text>
                        <View className="relative">
                            <Text className="absolute left-3 top-3 text-gray-500">$</Text>
                            <TextInput
                                className="w-full p-3 pl-8 border border-gray-300 rounded-lg"
                                placeholder="0.00"
                                keyboardType="numeric"
                            />
                        </View>
                    </View>

                    <View>
                        <Text className="text-sm font-medium text-gray-700 mb-1">
                            Paid by
                        </Text>
                        <View className="border border-gray-300 rounded-lg bg-white p-3">
                            <TextInput
                                className="w-full"
                                placeholder="Select payer"
                            />
                        </View>
                    </View>

                    <View>
                        <Text className="text-sm font-medium text-gray-700 mb-1">
                            Date
                        </Text>
                        <View className="relative">
                            <TextInput
                                className="w-full p-3 border border-gray-300 rounded-lg"
                                placeholder="Select date"
                            />
                            <View className="absolute right-3 top-3">
                                <Ionicons name="calendar" size={20} color="#9CA3AF" />
                            </View>
                        </View>
                    </View>

                    <View>
                        <Text className="text-sm font-medium text-gray-700 mb-1">
                            Split between
                        </Text>
                        <View className="space-y-2 p-3 border border-gray-300 rounded-lg">
                            {['You', 'Michael', 'Emma', 'John', 'Sarah'].map((person) => (
                                <TouchableOpacity
                                    key={person}
                                    className="flex-row items-center"
                                >
                                    <View className="w-4 h-4 border border-gray-300 rounded mr-2" />
                                    <Text>{person}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <TouchableOpacity
                        className="w-full bg-blue-500 py-3 rounded-lg mt-4"
                    >
                        <Text className="text-white text-center font-medium">
                            Add Expense
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

export default ExpenseForm;
