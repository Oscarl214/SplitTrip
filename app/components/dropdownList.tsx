import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

interface GroupData {
    id: number | null,
    name: 'string' | null,
  created_by: number | null,
  created_at: number | null, 
  description: number | null,
  }
  
  interface GroupMember {
    id:number | null,
    group_id: number | null,
    profile_id: number | null,
    joined_at: number | null,
    email: string,
    role: string | null,
    status: 'active' | 'invited' | null,
    invited_at: string | null,
    profiles?: {
      name: string | null
    }
  }
  
  


  
const DropDownList = ({ 
  members, 
  payer, 
  setPayer, 
  setDropList,
  types,
  selectedType,
  setSelectedType,
  setShowDropdown
}: {members: GroupMember[], payer: GroupMember | null, setDropList: (value: boolean) => void, setPayer: (payer: GroupMember | null) => void}) => {



    const selectMember=(payer: GroupMember)=>{ //this function should set the value seclected as the new payer
        
      setPayer(payer)
      setDropList(false)
      return;
    }
    const renderMember = ({ item }: { item: GroupMember }) => (
        <View className="flex-row items-center justify-between p-3 border-b border-gray-100">
          <View className="flex-1">
           <TouchableOpacity onPress={()=>selectMember(item)}>


            <Text className="font-medium">{item.profiles?.name || item.email}</Text>
            {item.status === 'invited' && (
                <Text className="text-xs text-orange-500 font-medium">Invited</Text>
            )}
          
            </TouchableOpacity>
          </View>
        </View>
      );
  
      // Key extractor function - returns unique key for each item
      const keyExtractor = (item: GroupMember) => item.id?.toString() || item.email;

  return (
    <View>
                   <FlatList 
  data={members}
  renderItem={renderMember}
  keyExtractor={keyExtractor}
  showsVerticalScrollIndicator={false}
  ItemSeparatorComponent={() => <View style={{ height: 1 }} />}
  />
    </View>
  )
}

export default DropDownList