
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from './utils/supabase';

import { useAuth } from './provider/authContext';

interface CreateGroupViewProps {
  onBack: () => void
  onComplete: () => void
}
interface Member {
  email: string
  id: number
}

const CreateGroup = ({
  onBack
}: CreateGroupViewProps) => {
  const router = useRouter();
  const { contextsession } = useAuth();
  const [step, setStep] = useState(1)
  const [groupName, setGroupName] = useState('')
  const [groupType, setGroupType] = useState('')
  const [currency, setCurrency] = useState('USD')
  const [description, setDescription] = useState('')
  const [members, setMembers] = useState<Member[]>([])
  const [newMemberEmail, setNewMemberEmail] = useState('')
  const [isCreating, setIsCreating] = useState(false)


 


  const addMember = () => {

    if(newMemberEmail===contextsession?.email){

    Alert.alert("Cannot submit your own email")
     setNewMemberEmail('')
    return
    }
    if (newMemberEmail && !members.some((m) => m.email === newMemberEmail)) {
      setMembers([
        ...members,
        {
          email: newMemberEmail,
          id: Date.now(),
        },
      ])
      setNewMemberEmail('')
    }
  }
  const removeMember = (id: number) => {
    setMembers(members.filter((m) => m.id !== id))
  }

  const onComplete = async () => {
    if (!contextsession) {
      Alert.alert('Error', 'You must be logged in to create a group');
      return;
    }

    setIsCreating(true);

    try {
      // Create group for the current user
      
      // Step 1: Create the group first
      const { data: groupData, error: groupError } = await supabase
        .from('groups')
        .insert({
          name: groupName,
          description: description || null,
          created_by: contextsession.id,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (groupError) {
        console.error('Error creating group:', groupError);
        console.log("Error Creating Group", groupError)
        Alert.alert('Error', 'Failed to create group. Please try again.');
        return;
      }

      const groupId = groupData.id;

      // Step 2: Add the creator as the first member (admin)
      const { error: creatorError } = await supabase
        .from('group_members')
        .insert({
          group_id: groupId,
          profile_id: contextsession.id,
          email: contextsession.email,
          role: 'admin', // Creator becomes admin
          status: 'active', // Creator is immediately active
          invited_at: new Date().toISOString(), // Required field
          joined_at: new Date().toISOString()
        });

      if (creatorError) {
        console.error('Error adding creator to group:', creatorError);
        Alert.alert('Error', 'Failed to add you to the group.');
        return;
      }

      // Step 3: Add all invited members (as regular members)


      if (members.length > 0) {
        const memberInserts = members.map(member => ({
          group_id: groupId,
          email: member.email,
          profile_id: null,
          role: 'member', // Invited users start as regular members
          joined_at: new Date().toISOString(),
          status: 'invited',
          invited_at: new Date().toISOString(),
        }));

        const {data:groupmembers, error: membersError } = await supabase
          .from('group_members')
          .insert(memberInserts);



        if (membersError) {
          console.error('Error adding members to group:', membersError);
          Alert.alert('Warning', 'Group created but some members could not be added.');
        }
      }

      // Navigate immediately after successful group creation
      // The app-content.tsx will handle routing to the appropriate screen
      router.replace('/');

    } catch (error) {
      console.error('Unexpected error:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsCreating(false);
    }
  }

  const handleSubmit = async () => {
    if (step < 2) {
        if(groupName===''){
            Alert.alert("Must Submit a Group Name to go to Next Step")
            return
        }
      setStep(step + 1)
    } else {
      // Final step - create the group
      if (members.length === 0) {
        Alert.alert('Must submit at least one email')
        return;
      }
      
      await onComplete();
    }
  }
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <SafeAreaView  style={styles.section} >
            <View style={styles.inputGroup} >
              <Text style={styles.label}>Group Name</Text>
              <TextInput
                value={groupName}
                onChangeText={setGroupName}
                style={styles.input}
                placeholder="e.g., Summer Trip 2024"
              />
            </View>
            {/* <View style={styles.inputGroup}>
              <Text style={styles.label}>Type of Group</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={groupType}
                  onValueChange={setGroupType}
                  style={styles.picker}
                >
                  <Picker.Item label="Select a type" value="" />
                  <Picker.Item label="Trip" value="trip" />
                  <Picker.Item label="Household" value="household" />
                  <Picker.Item label="Couple" value="couple" />
                  <Picker.Item label="Event" value="event" />
                  <Picker.Item label="Other" value="other" />
                </Picker>
              </View>
            </View> */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Description (optional)</Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                style={[styles.input, { height: 80 }]}
                placeholder="Add some details about your group"
                multiline
                numberOfLines={3}
              />
            </View>
          </SafeAreaView>
        )

     
      // case 2:
      //   return (
      //     <SafeAreaView style={styles.section}>
      //       <View style={styles.inputGroup}>
      //         <Text style={styles.label}>Default Currency</Text>
      //         <View style={styles.pickerWrapper}>
      //           <Picker
      //             selectedValue={currency}
      //             onValueChange={setCurrency}
      //             style={styles.picker}
      //           >
      //             <Picker.Item label="USD ($)" value="USD" />
      //             <Picker.Item label="EUR (€)" value="EUR" />
      //             <Picker.Item label="GBP (£)" value="GBP" />
      //             <Picker.Item label="JPY (¥)" value="JPY" />
      //             <Picker.Item label="AUD ($)" value="AUD" />
      //             <Picker.Item label="CAD ($)" value="CAD" />
      //           </Picker>
      //         </View>
      //       </View>
      //       <View style={{ paddingTop: 16 }}>
      //         <Text style={styles.infoText}>
      //           This will be the default currency for all expenses in this group. Members can still enter expenses in other currencies, which will be converted automatically.
      //         </Text>
      //       </View>
      //     </SafeAreaView>
      //   )
      case 2:
        return (
          <SafeAreaView style={styles.section}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Add Members</Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TextInput
                  value={newMemberEmail}
                  onChangeText={setNewMemberEmail}
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Enter email address"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  onPress={addMember}
                  style={styles.addButton}
                >
                  <Feather name="plus" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ marginTop: 12 }}>
              {members.map((member) => (
                <View
                  key={member.id}
                  style={styles.memberRow}
                >
                  <Text>{member.email}</Text>
                  <TouchableOpacity
                    onPress={() => removeMember(member.id)}
                  >
                    <Feather name="x" size={20} color="#888" />
                  </TouchableOpacity>
                </View>
              ))}
              {members.length === 0 && (
                <Text style={styles.infoText}>
                  No members added yet. You can add them later too.
                </Text>
              )}
            </View>
          </SafeAreaView>
        )
    }
  }
  return (
    <SafeAreaView>


    
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          {/* <Feather name="arrow-left" size={20} /> */}
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create New Group</Text>
      </View>
      <View style={styles.progressRow}>
        {[1, 2].map((i) => (
          <View key={i} style={[styles.progressStep, i < 2 && { flex: 1 }]}> 
            <View
              style={[
                styles.progressCircle,
                i <= step ? styles.progressCircleActive : styles.progressCircleInactive,
              ]}
            >
              <Text style={{ color: i <= step ? '#fff' : '#888' }}>{i}</Text>
            </View>
            {i < 2 && (
              <View
                style={[
                  styles.progressBar,
                  i < step ? styles.progressBarActive : styles.progressBarInactive,
                ]}
              />
            )}
          </View>
        ))}
      </View>
      <View>
        {renderStep()}
        <View style={styles.buttonRow}>
          {step > 1 && (
            <TouchableOpacity
              onPress={() => setStep(step - 1)}
              style={[styles.navButton, { marginRight: 8 }]}
            >
              <Text style={styles.navButtonText}>Back</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isCreating}
            style={[styles.navButton, styles.primaryButton, { marginLeft: step > 1 ? 8 : 0, opacity: isCreating ? 0.6 : 1 }]}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={[styles.navButtonText, { color: '#fff', marginRight: step === 2 ? 0 : 8 }]}> 
                {step === 2 ? (isCreating ? 'Creating...' : 'Create Group') : 'Next'}
              </Text>
              {step !== 2 && <Feather name="chevron-right" size={20} color="#fff" />}
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  progressStep: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressCircleActive: {
    backgroundColor: '#3b82f6',
  },
  progressCircleInactive: {
    backgroundColor: '#e5e7eb',
  },
  progressBar: {
    height: 4,
    flex: 1,
    marginHorizontal: 8,
    borderRadius: 2,
  },
  progressBarActive: {
    backgroundColor: '#3b82f6',
  },
  progressBarInactive: {
    backgroundColor: '#e5e7eb',
  },
  section: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    color: '#374151',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  picker: {
    height: 48,
    width: '100%',
  },
  infoText: {
    fontSize: 14,
    color: '#6b7280',
  },
  addButton: {
    backgroundColor: '#3b82f6',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 32,
  },
  navButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e5e7eb',
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
  },
})

export default CreateGroup
