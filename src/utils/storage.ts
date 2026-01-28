import AsyncStorage from '@react-native-async-storage/async-storage';
import { Medication } from '@/types/medication';

const MEDICATIONS_KEY = '@medications';

export async function getMedications(): Promise<Medication[]> {
  try {
    const data = await AsyncStorage.getItem(MEDICATIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading medications:', error);
    return [];
  }
}

export async function saveMedications(medications: Medication[]): Promise<void> {
  try {
    await AsyncStorage.setItem(MEDICATIONS_KEY, JSON.stringify(medications));
  } catch (error) {
    console.error('Error saving medications:', error);
  }
}

export async function addMedication(medication: Medication): Promise<void> {
  const medications = await getMedications();
  medications.push(medication);
  await saveMedications(medications);
}

export async function updateMedication(medication: Medication): Promise<void> {
  const medications = await getMedications();
  const index = medications.findIndex(m => m.id === medication.id);
  if (index !== -1) {
    medications[index] = medication;
    await saveMedications(medications);
  }
}

export async function deleteMedication(id: string): Promise<void> {
  const medications = await getMedications();
  const filtered = medications.filter(m => m.id !== id);
  await saveMedications(filtered);
}
