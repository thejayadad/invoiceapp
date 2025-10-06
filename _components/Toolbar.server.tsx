"use client";

import Link from "next/link";
import { Eye, Pencil } from "lucide-react";
import dynamic from "next/dynamic";
import type { InvoiceData } from "./InvoicePDFDoc";

// ✅ Dynamically import the PDF download button so it never runs on SSR
const PdfDownloadReactPdf = dynamic(
  () => import("./PdfDownloadReactPdf.client"),
  { ssr: false } // ✅ prevents it from being included in server render
);

export default function Toolbar({
  invoiceId,
  mode,
  pdfData,
}: {
  invoiceId: string;
  mode: "preview" | "edit";
  pdfData: InvoiceData;
}) {
  const base = `/invoices/${invoiceId}`;
  const isPreview = mode === "preview";

  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "#fff",
        borderBottom: "1px solid #e5e7eb",
        padding: "8px 12px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      {/* Left side: mode toggle */}
      <div style={{ display: "flex", gap: 8 }}>
        <Link
          href={`${base}?mode=preview`}
          style={{
            textDecoration: "none",
            padding: "6px 12px",
            borderRadius: 6,
            backgroundColor: isPreview ? "#2563eb" : "#f3f4f6",
            color: isPreview ? "#fff" : "#111",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Eye size={16} style={{ marginRight: 6 }} /> Preview
        </Link>

        <Link
          href={`${base}?mode=edit`}
          style={{
            textDecoration: "none",
            padding: "6px 12px",
            borderRadius: 6,
            backgroundColor: !isPreview ? "#2563eb" : "#f3f4f6",
            color: !isPreview ? "#fff" : "#111",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Pencil size={16} style={{ marginRight: 6 }} /> Edit
        </Link>
      </div>

      {/* Right side: PDF Download */}
      <PdfDownloadReactPdf data={pdfData} filename={`invoice-${invoiceId}.pdf`} />
    </div>
  );
}
