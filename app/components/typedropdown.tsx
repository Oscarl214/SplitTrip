import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface ExpenseType {
  id: string;
  name: string;
  icon: string;
  color: string;
  description?: string;
}

interface TypeDropdownProps {
  types: ExpenseType[];
  selectedType: ExpenseType | null;
  setSelectedType: (type: ExpenseType | null) => void;
  setShowDropdown: (value: boolean) => void;
}

const TypeDropdown = ({ types, selectedType, setSelectedType, setShowDropdown }: TypeDropdownProps) => {
  return (
    <View>
      {types.map((type) => (
        <TouchableOpacity
          key={type.id}
          onPress={() => {
            setSelectedType(type);
            setShowDropdown(false);
          }}
          className="p-3 border-b border-gray-100"
        >
          <Text>{type.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default TypeDropdown;