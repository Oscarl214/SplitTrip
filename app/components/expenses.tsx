import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

const Expenses = () => {
    const expenses = [
        {
          id: 1,
          title: 'Dinner at Tapas Bar',
          amount: 120.0,
          paidBy: 'Michael',
          date: 'Today',
          icon: 'silverware-fork-knife',
          iconColor: '#EAB308', // yellow-500
        },
        {
          id: 2,
          title: 'Hotel Room',
          amount: 350.0,
          paidBy: 'You',
          date: 'Yesterday',
          icon: 'bed',
          iconColor: '#3B82F6', // blue-500
        },
        {
          id: 3,
          title: 'Souvenirs',
          amount: 45.0,
          paidBy: 'Emma',
          date: 'Yesterday',
          icon: 'shopping',
          iconColor: '#22C55E', // green-500
        },
    ];

    return (
        <View className="mt-2 text-xl">
            {expenses.map((expense) => (
                <View
                    key={expense.id}
                    className="flex-row items-center p-3 border-b border-gray-100"
                >
                    <View className="p-2 bg-gray-100 rounded-full mr-3">
                        <MaterialCommunityIcons 
                            name={expense.icon as any} 
                            size={20} 
                            color={expense.iconColor} 
                        />
                    </View>
                    <View className="flex-1">
                        <Text className="font-medium">{expense.title}</Text>
                        <Text className="text-sm text-gray-500">
                            {expense.paidBy} paid · {expense.date}
                        </Text>
                    </View>
                    <Text className="font-medium">${expense.amount.toFixed(2)}</Text>
                </View>
            ))}
        </View>
    );
};

export default Expenses;
