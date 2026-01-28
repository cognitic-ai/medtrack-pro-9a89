import { useState, useCallback } from "react";
import { ScrollView, View, Text, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import * as AC from "@bacons/apple-colors";
import { SymbolView } from "expo-symbols";
import { getMedications, deleteMedication } from "@/utils/storage";
import { Medication } from "@/types/medication";

export default function IndexRoute() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const router = useRouter();

  const loadMedications = useCallback(async () => {
    const meds = await getMedications();
    setMedications(meds);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadMedications();
    }, [loadMedications])
  );

  const handleDelete = (id: string) => {
    Alert.alert(
      "Delete Medication",
      "Are you sure you want to delete this medication?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteMedication(id);
            loadMedications();
          },
        },
      ]
    );
  };

  const getDaysUntilRefill = (refillDate?: string) => {
    if (!refillDate) return null;
    const today = new Date();
    const refill = new Date(refillDate);
    const diff = Math.ceil((refill.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={{
        flex: 1,
      }}
    >
      <View style={{ padding: 16, gap: 12 }}>
        {medications.length === 0 ? (
          <View style={{ alignItems: "center", paddingVertical: 60, gap: 12 }}>
            <SymbolView
              name="pills.fill"
              size={64}
              tintColor={AC.secondaryLabel}
            />
            <Text
              style={{
                fontSize: 17,
                color: AC.secondaryLabel,
                textAlign: "center",
              }}
            >
              No medications added yet
            </Text>
            <Pressable
              onPress={() => router.push("/(index)/add-medication")}
              style={({ pressed }) => ({
                backgroundColor: AC.systemBlue,
                paddingHorizontal: 24,
                paddingVertical: 12,
                borderRadius: 12,
                borderCurve: "continuous",
                opacity: pressed ? 0.7 : 1,
              })}
            >
              <Text style={{ color: "white", fontSize: 17, fontWeight: "600" }}>
                Add Medication
              </Text>
            </Pressable>
          </View>
        ) : (
          <>
            {medications.map((med) => {
              const daysUntilRefill = getDaysUntilRefill(med.refillDate);
              const pillsPercentage = med.totalPills && med.pillsRemaining
                ? (med.pillsRemaining / med.totalPills) * 100
                : null;

              return (
                <Pressable
                  key={med.id}
                  onPress={() => router.push({
                    pathname: "/(index)/add-medication",
                    params: { id: med.id }
                  })}
                  onLongPress={() => handleDelete(med.id)}
                  style={({ pressed }) => ({
                    backgroundColor: process.env.EXPO_OS === "ios"
                      ? AC.secondarySystemGroupedBackground
                      : "#f5f5f5",
                    padding: 16,
                    borderRadius: 12,
                    borderCurve: "continuous",
                    opacity: pressed ? 0.7 : 1,
                    gap: 8,
                    ...process.env.EXPO_OS !== "ios" && {
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    },
                  })}
                >
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 20,
                          fontWeight: "600",
                          color: AC.label,
                        }}
                      >
                        {med.name}
                      </Text>
                      <Text
                        style={{
                          fontSize: 15,
                          color: AC.secondaryLabel,
                          marginTop: 2,
                        }}
                      >
                        {med.dosage} • {med.frequency}
                      </Text>
                    </View>
                    {daysUntilRefill !== null && (
                      <View
                        style={{
                          backgroundColor: daysUntilRefill <= 7 ? AC.systemOrange : AC.systemBlue,
                          paddingHorizontal: 10,
                          paddingVertical: 4,
                          borderRadius: 8,
                          borderCurve: "continuous",
                        }}
                      >
                        <Text
                          style={{
                            color: "white",
                            fontSize: 12,
                            fontWeight: "600",
                            fontVariant: "tabular-nums",
                          }}
                        >
                          {daysUntilRefill}d
                        </Text>
                      </View>
                    )}
                  </View>

                  {med.prescriber && (
                    <Text
                      style={{
                        fontSize: 14,
                        color: AC.tertiaryLabel,
                      }}
                    >
                      Dr. {med.prescriber}
                    </Text>
                  )}

                  {pillsPercentage !== null && (
                    <View style={{ gap: 4 }}>
                      <View
                        style={{
                          height: 6,
                          backgroundColor: AC.tertiarySystemFill,
                          borderRadius: 3,
                          overflow: "hidden",
                        }}
                      >
                        <View
                          style={{
                            height: "100%",
                            width: `${pillsPercentage}%`,
                            backgroundColor:
                              pillsPercentage <= 20
                                ? AC.systemRed
                                : pillsPercentage <= 40
                                ? AC.systemOrange
                                : AC.systemGreen,
                          }}
                        />
                      </View>
                      <Text
                        style={{
                          fontSize: 12,
                          color: AC.secondaryLabel,
                          fontVariant: "tabular-nums",
                        }}
                      >
                        {med.pillsRemaining} of {med.totalPills} pills remaining
                      </Text>
                    </View>
                  )}

                  {med.instructions && (
                    <Text
                      style={{
                        fontSize: 14,
                        color: AC.secondaryLabel,
                        marginTop: 4,
                      }}
                    >
                      {med.instructions}
                    </Text>
                  )}
                </Pressable>
              );
            })}

            <Pressable
              onPress={() => router.push("/(index)/add-medication")}
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
                Add Medication
              </Text>
            </Pressable>
          </>
        )}
      </View>
    </ScrollView>
  );
}
