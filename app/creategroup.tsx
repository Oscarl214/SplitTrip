
import { Feather } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View , Alert} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from './utils/supabase'

import { useSession } from './hooks/session';

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
  const [step, setStep] = useState(1)
  const [groupName, setGroupName] = useState('')
  const [groupType, setGroupType] = useState('')
  const [currency, setCurrency] = useState('USD')
  const [description, setDescription] = useState('')
  const [members, setMembers] = useState<Member[]>([])
  const [newMemberEmail, setNewMemberEmail] = useState('')


  const {id,email}= useSession()


  const addMember = () => {
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

  const onComplete= async ( groupname: string ,description: string | undefined, createdby:  )=>{

try {

const {email, error}=await supabase.from()

//   }
  const handleSubmit = () => {
    if (step < 3) {
        if(groupName===''){
            Alert.alert("Must Submit a Group Name to go to Next Step")
            return
        }
      setStep(step + 1)
    } else {
    //   onComplete()  //my function to send data to back end

   


    if(members.length===0){
        Alert.alert('Must submit at least one email')
        return;
    }
      router.replace('/')
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
            style={[styles.navButton, styles.primaryButton, { marginLeft: step > 1 ? 8 : 0 }]}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={[styles.navButtonText, { color: '#fff', marginRight: step === 3 ? 0 : 8 }]}> 
                {step === 2 ? 'Create Group' : 'Next'}
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
