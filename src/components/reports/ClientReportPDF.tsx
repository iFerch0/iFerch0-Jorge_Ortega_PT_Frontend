"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { Assessment } from "@/lib/data/mock-assessments";

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 30,
    fontFamily: "Helvetica",
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#111827",
    paddingBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#111827", // Tailwind gray-900
  },
  section: {
    margin: 10,
    padding: 10,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "bold",
    color: "#374151", // Tailwind gray-700
  },
  text: {
    fontSize: 12,
    marginBottom: 5,
    color: "#4B5563", // Tailwind gray-600
  },
  table: {
    display: "flex",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    marginTop: 10,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableCol: {
    width: "25%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCell: {
    margin: "auto",
    marginTop: 5,
    marginBottom: 5,
    fontSize: 10,
  },
  tableHeader: {
    backgroundColor: "#F3F4F6", // Tailwind gray-100
    fontWeight: "bold",
  },
});

interface ClientReportPDFProps {
  clientName: string;
  clientEmail: string;
  goal: string;
  assessments: Assessment[];
}

// Create Document Component
export const ClientReportPDF = ({
  clientName,
  clientEmail,
  goal,
  assessments,
}: ClientReportPDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View>
            <Text style={styles.logo}>GymProfile Pro</Text>
            <Text style={{ fontSize: 10, color: "#6B7280" }}>Entrenamiento Personalizado</Text>
        </View>
        <Text style={{ fontSize: 10, color: "#9CA3AF" }}>{new Date().toLocaleDateString()}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Perfil del Cliente</Text>
        <Text style={styles.text}>Nombre: {clientName}</Text>
        <Text style={styles.text}>Email: {clientEmail}</Text>
        <Text style={styles.text}>Objetivo: {goal}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Historial de Evaluaciones</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={{ ...styles.tableCol, ...styles.tableHeader }}>
              <Text style={styles.tableCell}>Fecha</Text>
            </View>
            <View style={{ ...styles.tableCol, ...styles.tableHeader }}>
              <Text style={styles.tableCell}>Peso (kg)</Text>
            </View>
            <View style={{ ...styles.tableCol, ...styles.tableHeader }}>
              <Text style={styles.tableCell}>% Grasa</Text>
            </View>
            <View style={{ ...styles.tableCol, ...styles.tableHeader }}>
              <Text style={styles.tableCell}>% Músculo</Text>
            </View>
          </View>
           {assessments.map((assessment) => (
            <View style={styles.tableRow} key={assessment.id}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                  {new Date(assessment.date).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{assessment.weight}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                    {assessment.bodyFatPercentage ? `${assessment.bodyFatPercentage}%` : "-"}
                </Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>
                    {assessment.muscleMassPercentage ? `${assessment.muscleMassPercentage}%` : "-"}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.title}>Notas y Recomendaciones</Text>
        <Text style={styles.text}>
            Continúa con el excelente trabajo. Recuerda mantener la consistencia en tu alimentación y descanso.
        </Text>
      </View>
      
      <Text style={{ position: "absolute", bottom: 30, left: 30, right: 30, textAlign: "center", fontSize: 10, color: "#9CA3AF" }}>
        Generado automáticamente por GymProfile Pro
      </Text>
    </Page>
  </Document>
);
