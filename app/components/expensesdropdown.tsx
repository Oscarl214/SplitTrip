import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, Text, View } from 'react-native';

interface ExpenseType {
  name: string;
  icon: string;
  color: string;
}

interface ExpenseItem {
  id: number | null,
  name: string | null,
  created_by: string | null,
  created_at: string | null, 
  description: string | null,
  total_amount: number | null,
  paid_by: string | null,
  type_id: string | null,
  expense_date: string | null,
  expense_types?: ExpenseType,
  profiles?: {
    name: string | null,
    email: string | null
  }
}

interface ExpensesDropDownProps {
  expenses: ExpenseItem[]
}

const ExpensesDropDown = ({expenses}: ExpensesDropDownProps) => {
    console.log('ExpensesDropDown received expenses:', expenses);
    console.log('Number of expenses:', expenses?.length || 0);

    // Import static types as fallback
    const { EXPENSE_TYPES } = require('../components/expenseform');

    const getExpenseTypeInfo = (typeId: string | null, expenseTypes: any) => {
        // First try the joined data
        if (expenseTypes && expenseTypes.name) {
            return expenseTypes;
        }
        
        // Fallback to static types
        if (typeId) {
            const staticType = EXPENSE_TYPES.find((type: any) => type.id === typeId);
            if (staticType) return staticType;
        }
        
        return { name: 'Other', icon: 'receipt', color: '#6B7280' };
    };

    const renderExpense = ({item}: {item: ExpenseItem}) => {
        // Debug logging to see what type data we're getting
        console.log('Expense item:', item);
        console.log('Type ID:', item.type_id);
        console.log('Expense types data:', item.expense_types);
        
        const formatDate = (dateString: string | null) => {
            if (!dateString) return 'Unknown date';
            try {
                const date = new Date(dateString);
                return date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                });
            } catch (error) {
                return 'Invalid date';
            }
        };

        const formatDateTime = (dateString: string | null) => {
            if (!dateString) return 'Unknown time';
            try {
                const date = new Date(dateString);
                return date.toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
            } catch (error) {
                return 'Invalid date';
            }
        };

        const getUserDisplayName = () => {
            if (item.profiles?.name) {
                return item.profiles.name;
            }
            if (item.profiles?.email) {
                return item.profiles.email;
            }
            return 'Unknown user';
        };

        const typeInfo = getExpenseTypeInfo(item.type_id, item.expense_types);
        console.log('Final type info:', typeInfo);

        return (
            <View
                key={item.id}
                className="flex-row items-center p-3 border-b border-gray-100"
            >
                <View className="p-2 bg-gray-100 rounded-full mr-3">
                    <MaterialCommunityIcons 
                        name={typeInfo.icon as any} 
                        size={20} 
                        color={typeInfo.color} 
                    />
                </View>
                <View className="flex-1">
                    <Text className="font-medium">{item.description || 'No description'}</Text>
                    <Text className="text-sm text-gray-500">
                        {typeInfo.name} · {formatDate(item.expense_date)}
                    </Text>
                    <Text className="text-xs text-gray-400">
                        Logged by: {getUserDisplayName()} at {formatDateTime(item.created_at)}
                    </Text>
                </View>
                <Text className="font-medium">${item.total_amount?.toFixed(2) || '0.00'}</Text>
            </View>
        );
    }

    const keyExtractor = (item: ExpenseItem) => item.id?.toString() || 'unknown';

    if (!expenses || expenses.length === 0) {
        return (
            <View className="p-4">
                <Text className="text-gray-500 text-center">No expenses yet</Text>
            </View>
        );
    }

    return (
        <View>
            <FlatList 
                data={expenses}
                renderItem={renderExpense}
                keyExtractor={keyExtractor}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => <View style={{ height: 1 }} />}
            />
        </View>
    )
}

export default ExpensesDropDown