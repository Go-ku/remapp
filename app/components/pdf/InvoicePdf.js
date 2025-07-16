import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 12 },
  section: { marginBottom: 10 },
  heading: { fontSize: 18, marginBottom: 10 },
  label: { fontWeight: "bold" },
});

export function InvoicePDF({ invoice }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.heading}>Rental Invoice</Text>
        </View>

        <View style={styles.section}>
          <Text>
            <Text style={styles.label}>Invoice #:</Text> {invoice.invoiceNumber}
          </Text>
          <Text>
            <Text style={styles.label}>Date:</Text>{" "}
            {new Date(invoice.issuedAt).toDateString()}
          </Text>
          <Text>
            <Text style={styles.label}>Due Date:</Text>{" "}
            {new Date(invoice.dueDate).toDateString()}
          </Text>
        </View>

        <View style={styles.section}>
          <Text>
            <Text style={styles.label}>Tenant:</Text> {invoice.tenant.name}
          </Text>
          <Text>
            <Text style={styles.label}>Property:</Text> {invoice.property.name}
          </Text>
          <Text>
            <Text style={styles.label}>Amount:</Text> ZMW{" "}
            {invoice.amount.toFixed(2)}
          </Text>
          <Text>
            <Text style={styles.label}>Status:</Text> {invoice.status}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
