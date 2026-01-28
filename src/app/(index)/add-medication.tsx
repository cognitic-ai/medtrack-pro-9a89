import { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Pressable,
  Platform,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as AC from "@bacons/apple-colors";
import DateTimePicker from "@react-native-community/datetimepicker";
import { getMedications, addMedication, updateMedication } from "@/utils/storage";
import { Medication } from "@/types/medication";

export default function AddMedicationRoute() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [prescribedDate, setPrescribedDate] = useState(new Date());
  const [refillDate, setRefillDate] = useState<Date | undefined>(undefined);
  const [instructions, setInstructions] = useState("");
  const [prescriber, setPrescriber] = useState("");
  const [pillsRemaining, setPillsRemaining] = useState("");
  const [totalPills, setTotalPills] = useState("");

  const [showPrescribedDatePicker, setShowPrescribedDatePicker] = useState(false);
  const [showRefillDatePicker, setShowRefillDatePicker] = useState(false);

  useEffect(() => {
    if (id) {
      loadMedication();
    }
  }, [id]);

  const loadMedication = async () => {
    if (!id) return;
    const meds = await getMedications();
    const med = meds.find((m) => m.id === id);
    if (med) {
      setName(med.name);
      setDosage(med.dosage);
      setFrequency(med.frequency);
      setPrescribedDate(new Date(med.prescribedDate));
      if (med.refillDate) setRefillDate(new Date(med.refillDate));
      setInstructions(med.instructions || "");
      setPrescriber(med.prescriber || "");
      setPillsRemaining(med.pillsRemaining?.toString() || "");
      setTotalPills(med.totalPills?.toString() || "");
    }
  };

  const handleSave = async () => {
    if (!name || !dosage || !frequency) {
      alert("Please fill in required fields");
      return;
    }

    const medication: Medication = {
      id: id || Date.now().toString(),
      name,
      dosage,
      frequency,
      prescribedDate: prescribedDate.toISOString(),
      refillDate: refillDate?.toISOString(),
      instructions: instructions || undefined,
      prescriber: prescriber || undefined,
      pillsRemaining: pillsRemaining ? parseInt(pillsRemaining) : undefined,
      totalPills: totalPills ? parseInt(totalPills) : undefined,
    };

    if (id) {
      await updateMedication(medication);
    } else {
      await addMedication(medication);
    }

    router.back();
  };

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{ flex: 1 }}
      keyboardDismissMode="interactive"
    >
      <View style={{ padding: 16, gap: 20 }}>
        <View style={{ gap: 8 }}>
          <Text style={{ fontSize: 13, fontWeight: "600", color: AC.secondaryLabel }}>
            MEDICATION NAME *
          </Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="e.g. Lisinopril"
            placeholderTextColor={AC.placeholderText}
            style={{
              backgroundColor: process.env.EXPO_OS === "ios"
                ? AC.secondarySystemGroupedBackground
                : "#f5f5f5",
              padding: 12,
              borderRadius: 10,
              borderCurve: "continuous",
              fontSize: 17,
              color: AC.label,
            }}
          />
        </View>

        <View style={{ gap: 8 }}>
          <Text style={{ fontSize: 13, fontWeight: "600", color: AC.secondaryLabel }}>
            DOSAGE *
          </Text>
          <TextInput
            value={dosage}
            onChangeText={setDosage}
            placeholder="e.g. 10mg"
            placeholderTextColor={AC.placeholderText}
            style={{
              backgroundColor: process.env.EXPO_OS === "ios"
                ? AC.secondarySystemGroupedBackground
                : "#f5f5f5",
              padding: 12,
              borderRadius: 10,
              borderCurve: "continuous",
              fontSize: 17,
              color: AC.label,
            }}
          />
        </View>

        <View style={{ gap: 8 }}>
          <Text style={{ fontSize: 13, fontWeight: "600", color: AC.secondaryLabel }}>
            FREQUENCY *
          </Text>
          <TextInput
            value={frequency}
            onChangeText={setFrequency}
            placeholder="e.g. Once daily"
            placeholderTextColor={AC.placeholderText}
            style={{
              backgroundColor: process.env.EXPO_OS === "ios"
                ? AC.secondarySystemGroupedBackground
                : "#f5f5f5",
              padding: 12,
              borderRadius: 10,
              borderCurve: "continuous",
              fontSize: 17,
              color: AC.label,
            }}
          />
        </View>

        <View style={{ gap: 8 }}>
          <Text style={{ fontSize: 13, fontWeight: "600", color: AC.secondaryLabel }}>
            PRESCRIBED DATE
          </Text>
          <Pressable
            onPress={() => setShowPrescribedDatePicker(true)}
            style={{
              backgroundColor: process.env.EXPO_OS === "ios"
                ? AC.secondarySystemGroupedBackground
                : "#f5f5f5",
              padding: 12,
              borderRadius: 10,
              borderCurve: "continuous",
            }}
          >
            <Text style={{ fontSize: 17, color: AC.label }}>
              {prescribedDate.toLocaleDateString()}
            </Text>
          </Pressable>
          {showPrescribedDatePicker && (
            <DateTimePicker
              value={prescribedDate}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event, date) => {
                setShowPrescribedDatePicker(Platform.OS === "ios");
                if (date) setPrescribedDate(date);
              }}
            />
          )}
        </View>

        <View style={{ gap: 8 }}>
          <Text style={{ fontSize: 13, fontWeight: "600", color: AC.secondaryLabel }}>
            REFILL DATE
          </Text>
          <Pressable
            onPress={() => setShowRefillDatePicker(true)}
            style={{
              backgroundColor: process.env.EXPO_OS === "ios"
                ? AC.secondarySystemGroupedBackground
                : "#f5f5f5",
              padding: 12,
              borderRadius: 10,
              borderCurve: "continuous",
            }}
          >
            <Text style={{ fontSize: 17, color: refillDate ? AC.label : AC.placeholderText }}>
              {refillDate ? refillDate.toLocaleDateString() : "Not set"}
            </Text>
          </Pressable>
          {showRefillDatePicker && (
            <DateTimePicker
              value={refillDate || new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event, date) => {
                setShowRefillDatePicker(Platform.OS === "ios");
                if (date) setRefillDate(date);
              }}
            />
          )}
          {refillDate && (
            <Pressable
              onPress={() => setRefillDate(undefined)}
              style={{ alignSelf: "flex-start" }}
            >
              <Text style={{ fontSize: 15, color: AC.systemRed }}>Clear</Text>
            </Pressable>
          )}
        </View>

        <View style={{ gap: 8 }}>
          <Text style={{ fontSize: 13, fontWeight: "600", color: AC.secondaryLabel }}>
            PRESCRIBER
          </Text>
          <TextInput
            value={prescriber}
            onChangeText={setPrescriber}
            placeholder="e.g. Dr. Smith"
            placeholderTextColor={AC.placeholderText}
            style={{
              backgroundColor: process.env.EXPO_OS === "ios"
                ? AC.secondarySystemGroupedBackground
                : "#f5f5f5",
              padding: 12,
              borderRadius: 10,
              borderCurve: "continuous",
              fontSize: 17,
              color: AC.label,
            }}
          />
        </View>

        <View style={{ flexDirection: "row", gap: 12 }}>
          <View style={{ flex: 1, gap: 8 }}>
            <Text style={{ fontSize: 13, fontWeight: "600", color: AC.secondaryLabel }}>
              PILLS REMAINING
            </Text>
            <TextInput
              value={pillsRemaining}
              onChangeText={setPillsRemaining}
              placeholder="0"
              placeholderTextColor={AC.placeholderText}
              keyboardType="number-pad"
              style={{
                backgroundColor: process.env.EXPO_OS === "ios"
                  ? AC.secondarySystemGroupedBackground
                  : "#f5f5f5",
                padding: 12,
                borderRadius: 10,
                borderCurve: "continuous",
                fontSize: 17,
                color: AC.label,
              }}
            />
          </View>

          <View style={{ flex: 1, gap: 8 }}>
            <Text style={{ fontSize: 13, fontWeight: "600", color: AC.secondaryLabel }}>
              TOTAL PILLS
            </Text>
            <TextInput
              value={totalPills}
              onChangeText={setTotalPills}
              placeholder="0"
              placeholderTextColor={AC.placeholderText}
              keyboardType="number-pad"
              style={{
                backgroundColor: process.env.EXPO_OS === "ios"
                  ? AC.secondarySystemGroupedBackground
                  : "#f5f5f5",
                padding: 12,
                borderRadius: 10,
                borderCurve: "continuous",
                fontSize: 17,
                color: AC.label,
              }}
            />
          </View>
        </View>

        <View style={{ gap: 8 }}>
          <Text style={{ fontSize: 13, fontWeight: "600", color: AC.secondaryLabel }}>
            INSTRUCTIONS
          </Text>
          <TextInput
            value={instructions}
            onChangeText={setInstructions}
            placeholder="e.g. Take with food"
            placeholderTextColor={AC.placeholderText}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            style={{
              backgroundColor: process.env.EXPO_OS === "ios"
                ? AC.secondarySystemGroupedBackground
                : "#f5f5f5",
              padding: 12,
              borderRadius: 10,
              borderCurve: "continuous",
              fontSize: 17,
              color: AC.label,
              minHeight: 100,
            }}
          />
        </View>

        <Pressable
          onPress={handleSave}
          style={({ pressed }) => ({
            backgroundColor: AC.systemBlue,
            padding: 16,
            borderRadius: 12,
            borderCurve: "continuous",
            alignItems: "center",
            opacity: pressed ? 0.7 : 1,
            marginTop: 8,
          })}
        >
          <Text style={{ color: "white", fontSize: 17, fontWeight: "600" }}>
            {id ? "Update" : "Save"} Medication
          </Text>
        </Pressable>

        {id && (
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => ({
              padding: 16,
              borderRadius: 12,
              borderCurve: "continuous",
              alignItems: "center",
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Text style={{ color: AC.systemRed, fontSize: 17 }}>Cancel</Text>
          </Pressable>
        )}
      </View>
    </ScrollView>
  );
}
