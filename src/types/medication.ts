export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  prescribedDate: string;
  refillDate?: string;
  instructions?: string;
  prescriber?: string;
  pillsRemaining?: number;
  totalPills?: number;
}

export type MedicationFormData = Omit<Medication, 'id'>;
