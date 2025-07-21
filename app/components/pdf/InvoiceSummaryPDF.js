import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 12 },
  section: { marginBottom: 10 },
  heading: { fontSize: 18, marginBottom: 10 },
  label: { fontWeight: "bold" },
});

export function InvoiceSummaryPDF({ invoice, payments }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.heading}>Invoice Summary</Text>
          <Text>
            <Text style={styles.label}>Invoice #:</Text> {invoice.invoiceNumber}
          </Text>
          <Text>
            <Text style={styles.label}>Amount Due:</Text> ZMW {invoice.amount}
          </Text>
          <Text>
            <Text style={styles.label}>Paid:</Text> ZMW {invoice.paidAmount}
          </Text>
          <Text>
            <Text style={styles.label}>Balance:</Text> ZMW{" "}
            {invoice.amount - invoice.paidAmount}
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.heading}>Payments</Text>
          {payments.length > 0 ? (
            payments.map((p, i) => (
              <Text key={i}>
                {new Date(p.paidAt).toLocaleDateString()} – ZMW {p.amount} via{" "}
                {p.method} (#{p.receiptNumber})
              </Text>
            ))
          ) : (
            <Text>No payments recorded</Text>
          )}
        </View>
      </Page>
    </Document>
  );
}
