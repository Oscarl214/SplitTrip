import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import React, { useState } from 'react'
import { Text, View } from 'react-native'

import { useFocusEffect } from 'expo-router'
import { useAuth } from '../provider/authContext'
import { supabase } from '../utils/supabase'
interface BalanceCardProps {

    groupData: GroupData | null;
  }

  interface GroupData {
    id: string | null,
    name: string | null,
  created_by: string | null,
  created_at: string | null, 
  description: string | null,
  }


  interface Balance {
    balance: 'string' | null
  }

  interface IndividualBalance {
    name: string;
    amount: number; // Positive = they owe you, Negative = you owe them
  }
  
  interface BalanceBreakdown {
    youOwe: IndividualBalance[]; // People you owe money to
    owesYou: IndividualBalance[]; // People who owe you money
  }

const BalanceCard = ({groupData}: BalanceCardProps) => {

const {contextsession}=useAuth()
const [userBalance,setUserBalance]=useState('')
const [individualBalances, setIndividualBalances] = useState<BalanceBreakdown>({
  youOwe: [],
  owesYou: []
});

useFocusEffect(
  React.useCallback(() => {
    console.log("BalanceCard useFocusEffect triggered");
    console.log("groupData:", groupData);
    console.log("contextsession:", contextsession);
    
    if(!contextsession?.id || !groupData?.id) {
      console.log("Missing required data - contextsession or groupData");
      return;
    }
    
    const fetchUsersBalance = async () => {
      try {
        console.log("Starting fetchUsersBalance");
        console.log("group_id:", groupData?.id);
        console.log("user_id:", contextsession?.id);
        
        // Use the auth ID directly as the profile ID
        console.log("Using auth ID as profile ID:", contextsession?.id)
        const profileId = contextsession?.id
        
        // First, let's check if there are any records in group_balances for this user/group
        const {data: allBalances, error: allBalancesError} = await supabase
        .from('group_balances')
        .select('*')
        .eq('group_id', groupData?.id)
        .eq('user_id', profileId)
        
        console.log("All balances for this user/group:", allBalances)
        console.log("All balances error:", allBalancesError)
        
        const {data:myBalance, error:Balanceerror}= await supabase
        .from('group_balances')
        .select('balance')
        .eq('group_id', groupData?.id)
        .eq('user_id', profileId)
        .maybeSingle() 
        
        if(Balanceerror){
          console.error("Error Fetching Full Balance:", Balanceerror)
          console.log("This might mean no balance record exists for this user/group")
          setUserBalance('0.00') // Set default balance instead of returning
          return
        }
        
        console.log("users total balance", myBalance)
        console.log("Balance value:", myBalance?.balance)
        console.log("Balance type:", typeof myBalance?.balance)
        
        if(myBalance && myBalance.balance !== null && myBalance.balance !== undefined) {
          console.log("Setting balance to:", myBalance.balance)
          setUserBalance(myBalance.balance.toString())
        } else {
          console.log("No balance data found or balance is null/undefined - setting to 0.00");
          setUserBalance('0.00')
        }
        
      }catch(error){
        console.error("Error Getting Balance:", error)
        setUserBalance('0.00') // Set default balance on error
      }
    }
    


    
    const calculateIndividualBalances = async (myExpenses: any[], allParticipants: any[]) => {
      const balances: { [key: string]: { name: string; amount: number } } = {}; // personId -> {name, amount}
      
      // Process each expense
      for (const myExpense of myExpenses) {
        const expense = myExpense.expenses;
        const expenseParticipants = allParticipants.filter(p => p.expense_id === expense.id);
        
        // Find your record for this expense (check both profile_id and user_email)
        const myRecord = expenseParticipants.find(p => 
          p.profile_id === contextsession?.id || p.user_email === contextsession?.email
        );
        
        if (!myRecord) return; // Skip if you weren't actually a participant
        
        // Check who paid for this expense
        console.log("  DEBUG: expense.paid_by =", expense.paid_by);
        console.log("  DEBUG: contextsession?.id =", contextsession?.id);
        console.log("  DEBUG: Are they equal?", expense.paid_by === contextsession?.id);
        
        // paid_by contains group member ID, we need to find the corresponding profile_id
        const payerGroupMember = allParticipants.find(p => p.id === expense.paid_by);
        const payerProfileId = payerGroupMember?.profile_id;
        console.log("  DEBUG: payerGroupMember =", payerGroupMember);
        console.log("  DEBUG: payerProfileId =", payerProfileId);
        console.log("  DEBUG: expense details:", {
          id: expense.id,
          description: expense.description,
          total_amount: expense.total_amount,
          paid_by: expense.paid_by
        });
        console.log("  DEBUG: my record for this expense:", {
          amount_owed: myRecord.amount_owed,
          amount_paid: myRecord.amount_paid,
          profile_id: myRecord.profile_id,
          user_email: myRecord.user_email
        });
        
        // Check if there's a data inconsistency
        if (myRecord.amount_paid > 0 && payerProfileId !== contextsession?.id) {
          console.log("  ⚠️ DATA INCONSISTENCY: You have amount_paid > 0 but you're not the payer!");
          console.log(`  ⚠️ amount_paid: ${myRecord.amount_paid}, paid_by: ${expense.paid_by}, payerProfileId: ${payerProfileId}, your_id: ${contextsession?.id}`);
        }
        
        if (payerProfileId === contextsession?.id) {
          // You paid - everyone else owes you their share
          console.log("  ✅ I paid - everyone owes me their share");
          expenseParticipants.forEach(participant => {
            console.log(`  DEBUG: Checking participant: profile_id=${participant.profile_id}, user_email=${participant.user_email}`);
            console.log(`  DEBUG: My ID: ${contextsession?.id}, My email: ${contextsession?.email}`);
            
            if (participant.profile_id === contextsession?.id || participant.user_email === contextsession?.email) {
              console.log("  ✅ Skipping myself - I'm the payer");
              return; // Skip yourself
            }
            
            const personKey = participant.profile_id || participant.user_email;
            const personName = participant.profiles?.name || participant.user_email;
            
            if (!balances[personKey]) {
              balances[personKey] = { name: personName, amount: 0 };
            }
            balances[personKey].amount += participant.amount_owed;
            console.log(`  ✅ ${personName} owes me: ${participant.amount_owed}`);
          });
        } else {
          // Someone else paid - you owe them your share
          console.log("  ✅ Someone else paid - I owe them my share");
          
          // Additional check: Make sure we're not processing an expense where you actually paid
          if (payerProfileId === contextsession?.id) {
            console.log("  ⚠️ ERROR: This should have been caught earlier - you actually paid for this expense!");
            return;
          }
          
          // Try to find the payer by profile_id first, then by user_email
          let payerRecord = expenseParticipants.find(p => p.profile_id === payerProfileId);
          if (!payerRecord) {
            // If not found by profile_id, try to find by user_email or other means
            console.log("  DEBUG: Payer not found in participants, fetching payer info from database");
            
            // Fetch the payer's profile information from the database
            const { data: payerProfile, error: payerError } = await supabase
              .from('profiles')
              .select('name, email')
              .eq('id', payerProfileId)
              .single();
            
            if (payerProfile && !payerError) {
              payerRecord = {
                profile_id: payerProfileId,
                user_email: payerProfile.email,
                profiles: { name: payerProfile.name, email: payerProfile.email }
              };
              console.log("  ✅ Found payer profile:", payerProfile);
            } else {
              console.log("  ❌ Could not fetch payer profile:", payerError);
              
              // Try to find the payer in the participants to get their email
              const payerInParticipants = allParticipants.find(p => p.profile_id === payerProfileId);
              if (payerInParticipants && payerInParticipants.user_email) {
                payerRecord = {
                  profile_id: payerProfileId,
                  user_email: payerInParticipants.user_email,
                  profiles: { name: payerInParticipants.profiles?.name || payerInParticipants.user_email, email: payerInParticipants.user_email }
                };
                console.log("  ✅ Found payer in participants:", payerInParticipants.user_email);
              } else {
                // Try to find by user_email field as well
                const payerByEmail = allParticipants.find(p => p.user_email && p.user_email.includes(expense.paid_by.substring(0, 8)));
                if (payerByEmail && payerByEmail.user_email) {
                  payerRecord = {
                    profile_id: payerProfileId,
                    user_email: payerByEmail.user_email,
                    profiles: { name: payerByEmail.profiles?.name || payerByEmail.user_email, email: payerByEmail.user_email }
                  };
                  console.log("  ✅ Found payer by email match:", payerByEmail.user_email);
                } else {
                  // Last resort: try to get email from auth users table or use a more readable format
                  payerRecord = {
                    profile_id: payerProfileId,
                    user_email: `User ${expense.paid_by.substring(0, 8)}...`, // Show first 8 chars of ID
                    profiles: null
                  };
                  console.log("  ⚠️ Using fallback display name");
                }
              }
            }
          }
          
          if (payerRecord) {
            const payerKey = payerRecord.profile_id || payerRecord.user_email;
            const payerName = payerRecord.profiles?.name || payerRecord.user_email || `User ${expense.paid_by.substring(0, 8)}...`;
            
            // Double-check: Don't create a balance record if the payer is yourself
            console.log(`  🔍 Payer check: payerKey=${payerKey}, myID=${contextsession?.id}, myEmail=${contextsession?.email}`);
            console.log(`  🔍 PayerKey === My ID: ${payerKey === contextsession?.id}`);
            console.log(`  🔍 PayerKey === My email: ${payerKey === contextsession?.email}`);
            
            if (payerKey === contextsession?.id || payerKey === contextsession?.email) {
              console.log("  ⚠️ Skipping - payer is myself, shouldn't owe myself");
              return;
            }
            
            if (!balances[payerKey]) {
              balances[payerKey] = { name: payerName, amount: 0 };
            }
            balances[payerKey].amount -= myRecord.amount_owed;
            console.log(`  ✅ I owe ${payerName}: ${myRecord.amount_owed}`);
          } else {
            console.log("  ❌ Could not find payer record");
          }
        }
      }
      
      console.log("\n=== Final balances ===");
      console.log("All balances:", balances);
      
      // Clean up: Remove any self-references from balances
      const cleanedBalances = { ...balances };
      console.log("  🧹 Cleaning up self-references...");
      console.log(`  🧹 My ID: ${contextsession?.id}`);
      console.log(`  🧹 My email: ${contextsession?.email}`);
      
      Object.keys(cleanedBalances).forEach(key => {
        console.log(`  🧹 Checking key: ${key}`);
        console.log(`  🧹 Key === My ID: ${key === contextsession?.id}`);
        console.log(`  🧹 Key === My email: ${key === contextsession?.email}`);
        
        if (key === contextsession?.id || key === contextsession?.email) {
          console.log(`  🧹 Removing self-reference: ${key}`);
          delete cleanedBalances[key];
        }
      });
      
      // Convert to arrays and filter out zero balances
      const youOwe = Object.values(cleanedBalances).filter(b => b.amount < 0);
      const owesYou = Object.values(cleanedBalances).filter(b => b.amount > 0);
      
      console.log("You owe:", youOwe);
      console.log("Owes you:", owesYou);
      
      // Debug: Show the math
      console.log("=== Balance Math ===");
      Object.entries(cleanedBalances).forEach(([key, balance]) => {
        console.log(`${balance.name}: ${balance.amount > 0 ? 'owes you' : 'you owe'} $${Math.abs(balance.amount).toFixed(2)}`);
      });
      
      return { youOwe, owesYou };
    }

    const fetchIndividualBalances = async () => {
      try {
        // Step 1: Get all expenses in your group where you participated
        // Check both by profile_id (for authenticated users) and user_email (for invited users)
        const {data: myExpenses, error: myExpensesError} = await supabase
          .from("expense_participants")
          .select(`
            *,
            expenses!inner(
              id,
              paid_by,
              total_amount,
              group_id,
              description
            )
          `)
          .or(`profile_id.eq.${contextsession.id},user_email.eq.${contextsession.email}`)
          .eq("expenses.group_id", groupData.id);
    
        if (myExpensesError) {
          console.error("Error fetching my expenses:", myExpensesError);
          return;
        }
    
        console.log("My expenses:", myExpenses);
        console.log("Number of my expenses:", myExpenses?.length || 0);
        
        // Debug: Show who paid for each expense
        myExpenses.forEach((expense, index) => {
          console.log(`Expense ${index + 1}:`, {
            description: expense.expenses?.description,
            total_amount: expense.expenses?.total_amount,
            paid_by: expense.expenses?.paid_by,
            my_amount_owed: expense.amount_owed,
            my_amount_paid: expense.amount_paid
          });
        });
    
        // Step 2: For each expense, get ALL participants (not just you)
        const expenseIds = myExpenses.map(exp => exp.expense_id);
        
        const {data: allParticipants, error: participantsError} = await supabase
          .from("expense_participants")
          .select(`
            *,
            profiles(name, email)
          `)
          .in("expense_id", expenseIds);
    
        if (participantsError) {
          console.error("Error fetching participants:", participantsError);
          return;
        }
    
        console.log("All participants:", allParticipants);
    
        // Step 3: Process the data to calculate individual balances
        const individualBalances = await calculateIndividualBalances(myExpenses, allParticipants);
        if (individualBalances) {
          setIndividualBalances(individualBalances);
        } else {
          setIndividualBalances({ youOwe: [], owesYou: [] });
        }
        
      } catch (error) {
        console.error("Error in fetchIndividualBalances:", error);
      }
    }
    
    fetchUsersBalance();
    fetchIndividualBalances();

  }, [contextsession?.id, groupData?.id])
)


  const balanceNumber = Number(userBalance);
  const isNegative = balanceNumber < 0;
  const formattedAmount = Math.abs(balanceNumber).toFixed(2);
  return (
    <LinearGradient
    colors={['#89ffdd', '#ffffff']}
    style={{
        paddingVertical: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    }}
>
  <View className='py-4  rounded-lg border-gray-200 shadow-sm'>
    <View className='flex item-center flex-row '>
      {isNegative ? (
        <Ionicons name='arrow-up-outline' size={54} color='green'/>
      ) : (
        <Ionicons name='arrow-down-outline' size={54} color='red'/>
      )}
      <View className='flex flex-col justify-center items-center ml-4'>
        <Text className='text-xl text-black'>
          {isNegative ? 'You owe': ' You are owed'}
        </Text>
        <Text className={`text-4xl font-bold ${isNegative ? 'text-red-500' : 'text-green-500'}`}>
          ${formattedAmount}
        </Text>
      </View>
    </View>
    <View className='px-3 mt-3'>
      {/* People who owe you */}
      {individualBalances.owesYou.map((person, index) => (
        <View key={index} className='flex flex-row justify-between mb-2'>
          <Text className='text-gray-500 text-xl'>{person.name} Owes You</Text>
          <Text className='font-medium text-xl'>${Math.abs(person.amount).toFixed(2)}</Text>
      </View>
      ))}
      
      {/* People you owe */}
      {individualBalances.youOwe.map((person, index) => (
        <View key={index} className='flex flex-row justify-between mb-2'>
          <Text className='text-gray-500 text-xl'>You Owe {person.name}</Text>
          <Text className='font-medium text-xl'>${Math.abs(person.amount).toFixed(2)}</Text>
      </View>
      ))}
      
      {/* Show message if no individual balances */}
      {individualBalances.owesYou.length === 0 && individualBalances.youOwe.length === 0 && (
        <Text className='text-gray-500 text-center text-lg'>No individual balances</Text>
      )}
    </View>
  </View>
  </LinearGradient>
  )
}

export default BalanceCard
