import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import DropDownList from './dropdownList';
import TypeDropdown from './typedropdown';


export interface ExpenseType {
    id: string;
    name: string;
    icon: string;
    color: string;
    description?: string;
  }
  
  export const EXPENSE_TYPES: ExpenseType[] = [
    {
      id: 'food',
      name: 'Food & Dining',
      icon: 'silverware-fork-knife',
      color: '#EAB308',
      description: 'Restaurants, groceries, food delivery'
    },
    {
      id: 'transportation',
      name: 'Transportation',
      icon: 'car',
      color: '#3B82F6',
      description: 'Gas, flights, taxis, public transport'
    },
    {
      id: 'accommodation',
      name: 'Accommodation',
      icon: 'bed',
      color: '#8B5CF6',
      description: 'Hotels, Airbnb, hostels'
    },
    {
      id: 'entertainment',
      name: 'Entertainment',
      icon: 'movie',
      color: '#F59E0B',
      description: 'Movies, shows, activities'
    },
    {
      id: 'shopping',
      name: 'Shopping',
      icon: 'shopping',
      color: '#22C55E',
      description: 'Souvenirs, clothes, gifts'
    },
    {
      id: 'utilities',
      name: 'Utilities',
      icon: 'lightning-bolt',
      color: '#EF4444',
      description: 'Electricity, water, internet'
    },
    {
      id: 'other',
      name: 'Other',
      icon: 'dots-horizontal',
      color: '#6B7280',
      description: 'Miscellaneous expenses'
    }
  ];
  
  interface ExpenseFormData {
    description: string;
    amount: number;
    payer: GroupMember | null;
    selectedDate: Date | undefined;
    participants: GroupMember[];
    groupId: number | null;
    type: ExpenseType | null; 
  }

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
  
  
  interface GroupHeaderProps {
    loading: boolean;
    members: GroupMember[];
    groupData: GroupData | null;
  }



const ExpenseForm = () => {

//Grpup data states
const [groupData,setGroupData]=useState<GroupData | null>(null)
const [members, setMembers] = useState<GroupMember[]>([]);;
const [loading, setLoading]= useState(true);

    const router = useRouter();
    const onBack = () => {
        router.back();
    };

    //Users Input States
    const [description,setDescription]=useState('')
    const [amount,setAmount]=useState('')
    const [payer,setPayer]=useState<GroupMember | null>(null)
    const [participants,setParticipents]=useState<GroupMember[]>([])

    //States pertaining to the Date Section
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [showCalendar,setShowCalendar]=useState(false)
    const [mode, setMode] = useState<'date' | 'time' | 'datetime'>('date');

    //State pertaining to the drop list for Selecting Payer
    const [showdroplist,setDropList]=useState(false);


    //State Pertaining to Expense Type:

    const [selectedType, setSelectedType] = useState<ExpenseType | null>(null);
const [showTypeDropdown, setShowTypeDropdown] = useState(false);
//my Use effect that runs on mount to load in the group data
    useEffect(()=>{

        const setState=async () =>{
        try{

           const loadingData = await AsyncStorage.getItem('loading');
           const membersData= await AsyncStorage.getItem('members');
           const groupData=await AsyncStorage.getItem('groupData')
           
           
       if(loadingData !== null){
        const loadingState=JSON.parse(loadingData)
        setLoading(loadingState)
    }
    if(membersData !== null){
        const membersState=JSON.parse(membersData)
        setMembers(membersState)
    }
    if(groupData !== null){
        const groupDataState=JSON.parse(groupData)
        setGroupData(groupDataState)
    }


  
        }catch(error){
            console.error("error fetching State")
        }
    }
  
    setState();
    }, [])

    // Render function for each member item
    const renderMember = ({ item }: { item: GroupMember }) => {
        
        const isSelected = participants.some(p => p.id === item.id);

        return (
        <TouchableOpacity 
            onPress={()=>onPartcipantSelection({item})}
            className={`flex-row items-center justify-between p-3 border-b border-gray-100 ${isSelected ? 'bg-[#008000]' : 'bg-white'}`}
        >
            <View className="flex-1">
                <Text className="font-medium">{item.profiles?.name || item.email}</Text>
                {item.status === 'invited' && (
                    <Text className="text-xs text-orange-500 font-medium">Invited</Text>
                )}
            </View>
            {isSelected ? <AntDesign name="checkcircleo" color="#008000" size={24} /> : <Feather name="circle" color="#000" size={24} /> }
        </TouchableOpacity>
        )
    }
  
      // Key extractor function - returns unique key for each item
      const keyExtractor = (item: GroupMember) => item.id?.toString() || item.email;


          //function that sets the value to true if User clicks on the drop down button
    const showList=()=>{
        setDropList(true)
        return
    }

    //Function that ensures a numeric value is inputted into the amount section
      const onAmountChange=(text: any)=>{
        if(!isNaN(text)){
            setAmount(text)
        }
        return
      }


      //Function that shows the Date Picker Calendar once User clicks on Calendar Button
      const showDatepicker = () => {
        setShowCalendar(true)
      };

//Function that sets the user selected date to the state and sets the show calendar to false
      const onDateChange = (event: any, selectedDate?: Date) => {
        const currentDate = selectedDate;
        setShowCalendar(false)
        setSelectedDate(currentDate);
        return
      };
    
//Function that checks participants array based on Users selection of member

const onPartcipantSelection=({ item }: { item: GroupMember })=>{

    //I need to check against the parcipant array to check if selected member exist
    //to remove if selected or //add if not
    const isSelected = participants.some(p => p.id === item.id)

    if(isSelected){
        setParticipents(participants.filter(p => p.id !== item.id));
    }else {
        setParticipents([...participants, item]);
    }

return
}

const onSubmit = () => {
    // Get all the form values
    const formData = {
        description: description,           // string - expense description
        amount: parseFloat(amount),         // number - expense amount (converted from string)
        payer: payer,                      // GroupMember | null - who paid
        selectedDate: selectedDate,         // Date | undefined - when the expense occurred
        participants: participants,        // GroupMember[] - who to split between
        groupId: groupData?.id,   
        type: selectedType         // number | null - which group this expense belongs to
    };

    // TODO: Add your logic here
    // Examples of what you might want to do:
    
    // 1. Validation
    // - Check if description is not empty
    // - Check if amount is greater than 0
    // - Check if payer is selected
    // - Check if at least one participant is selected
    // - Check if date is selected
    
    if(!description){
        Alert.alert("no description Provided")
    }
    // 2. Data processing
    // - Calculate split amounts per participant
    // - Format date for database storage
    // - Prepare data for API call
    
    // 3. API call
    // - Submit expense to your backend/database
    // - Handle success/error responses
    
    // 4. Navigation
    // - Navigate back to previous screen on success
    // - Show error message on failure
    
    console.log('Form data:', formData);
};
    return (
        <ScrollView className="flex-1 bg-white">
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
    Category
  </Text>
  <View className="border border-gray-300 rounded-lg bg-white p-3">
    {!showTypeDropdown ? (
      <TouchableOpacity onPress={() => setShowTypeDropdown(true)}>
        <Text>
          {!selectedType ? "Select a category" : selectedType.name}
        </Text>
      </TouchableOpacity>
    ) : (
      <TypeDropdown 
        types={EXPENSE_TYPES} 
        selectedType={selectedType} 
        setSelectedType={setSelectedType} 
        setShowDropdown={setShowTypeDropdown} 
      />
    )}
  </View>
</View>
                    <View>
                        <Text className="text-sm font-medium text-gray-700 mb-1">
                            Description
                        </Text>
                        <TextInput
                            className="w-full p-3 border border-gray-300 rounded-lg"
                            placeholder="What was this expense for?"
                            value={description}
                            onChangeText={setDescription}
                            autoCapitalize="none" 
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
                                value={amount}
                                onChangeText={onAmountChange}
                            
                            />
                        </View>
                    </View>

                    <View>
                        <Text className="text-sm font-medium text-gray-700 mb-1">
                            Paid by
                        </Text>
                        <View className="border border-gray-300 rounded-lg bg-white p-3">
                            
                            { (!showdroplist) ?   <TouchableOpacity onPress={showList}>

                              <Text>  {(!payer) ? "Select a Group Member" : (payer.profiles?.name || payer.email) }</Text>
                                </TouchableOpacity>  :  
                                
                                 <DropDownList members={members} payer={payer} setPayer={setPayer} setDropList={setDropList} /> 
                            }

                        </View>
                    </View>

                    <View>
                        <Text className="text-sm font-medium text-gray-700 mb-1">
                            Date
                        </Text>
                        <View className="relative mb-2">
                            <View className='flex flex-row justify-between'>
                                <Text>{(!selectedDate) ? 'Pick a Date!' : selectedDate.toLocaleDateString()}</Text>
                                <TouchableOpacity onPress={showDatepicker}>
                                    <FontAwesome name="calendar" color="#FFA500" size={24} />
                                </TouchableOpacity>
                            </View>
                            {showCalendar && (
                                <DateTimePicker 
                                    testID="dateTimePicker"
                                    value={selectedDate || new Date()}
                                    mode={mode}
                                    is24Hour={true}
                                    onChange={onDateChange}
                                />
                            )}
                        </View>
                    </View>

                    <View>
                        <Text className="text-sm font-medium text-gray-700 mb-1">
                            Split between
                        </Text>
                        <View style={styles.flatListContainer}>
                        <FlatList 
  data={members}
  renderItem={renderMember}
  keyExtractor={keyExtractor}
  showsVerticalScrollIndicator={false}
  ItemSeparatorComponent={() => <View style={{ height: 1 }} />}
  />
                        </View>
                    </View>

                    <TouchableOpacity
                        className="w-full bg-blue-500 py-3 rounded-lg mt-4"
                        onPress={onSubmit}
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



const styles = StyleSheet.create({
    flatListContainer: {
      height: 400, 
      borderRadius: 1
    },
  }) 