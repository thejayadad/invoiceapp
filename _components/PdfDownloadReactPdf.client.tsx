"use client";

import { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { FileDown } from "lucide-react";
import InvoicePDFDoc, { InvoiceData } from "./InvoicePDFDoc";

export default function PdfDownloadReactPdf({
  data,
  filename,
}: {
  data: InvoiceData;
  filename: string;
}) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    try {
      setLoading(true);

      // 1️⃣ Generate a PDF Blob from the InvoicePDFDoc
      const blob = await pdf(<InvoicePDFDoc data={data} />).toBlob();

      // 2️⃣ Create a temporary object URL and trigger download
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();

      // 3️⃣ Cleanup
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Failed to generate PDF. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={loading}
      style={{
        padding: "6px 12px",
        borderRadius: 6,
        backgroundColor: loading ? "#9ca3af" : "#10b981",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        border: "none",
        cursor: loading ? "not-allowed" : "pointer",
      }}
    >
      <FileDown size={16} style={{ marginRight: 6 }} />
      {loading ? "Generating..." : "Download PDF"}
    </button>
  );
}
