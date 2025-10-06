// components/invoice/PdfDownloadReactPdf.client.tsx
"use client";

import { useMemo } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Download } from "lucide-react";
import InvoicePDFDoc, { InvoiceData } from "./InvoicePDFDoc";

export default function PdfDownloadReactPdf({
  data,
  filename = "invoice.pdf",
}: {
  data: InvoiceData;
  filename?: string;
}) {
  // Stabilize the document object (avoid re-renders)
  const doc = useMemo(() => <InvoicePDFDoc data={data} />, [data]);

  return (
    <PDFDownloadLink document={doc} fileName={filename}>
      {({ loading }) => (
        <button
          type="button"
          disabled={loading}
          title="Download PDF"
          aria-busy={loading}
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#2563eb",
            color: "#fff",
            padding: "6px 12px",
            border: "none",
            borderRadius: 6,
            fontSize: 14,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
          }}
        >
          <Download size={16} style={{ marginRight: 6 }} />
          {loading ? "Building…" : "Download PDF"}
        </button>
      )}
    </PDFDownloadLink>
  );
}
