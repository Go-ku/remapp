"use client";

import { PDFDownloadLink } from "@react-pdf/renderer";
import { Button } from "@/components/ui/button";
import { ReceiptPDF } from "../pdf/ReceiptPDF";

export function DownloadReceiptButton({ invoice }) {
  return (
    <PDFDownloadLink
      document={<ReceiptPDF invoice={invoice} />}
      fileName={`RECEIPT-${invoice.invoiceNumber}.pdf`}
    >
      {({ loading }) => (
        <Button variant="secondary" size="sm" disabled={loading}>
          {loading ? "Preparing..." : "Download Receipt"}
        </Button>
      )}
    </PDFDownloadLink>
  );
}
