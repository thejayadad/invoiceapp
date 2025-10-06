// components/invoice/Toolbar.tsx
"use client"; // allows client-side interop (for the PDF button import)

import Link from "next/link";
import { Eye, Pencil } from "lucide-react";
import dynamic from "next/dynamic";
import type { InvoiceData } from "./InvoicePDFDoc";

// Dynamically import the client-only PDF button
const PdfDownloadReactPdf = dynamic(() => import("./PdfDownloadReactPdf.client"), {
  ssr: false,
});

type Props = {
  invoiceId: string;
  mode: "preview" | "edit";
  pdfData: InvoiceData;
};

export default function Toolbar({ invoiceId, mode, pdfData }: Props) {
  const base = `/invoices/${invoiceId}`;
  const previewHref = `${base}?mode=preview`;
  const editHref = `${base}?mode=edit`;
  const isPreview = mode === "preview";

  return (
    <div
      style={{
        width: "100%",
        borderBottom: "1px solid #e5e7eb",
        backgroundColor: "#fff",
        padding: "8px 12px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      {/* Left section: Preview/Edit buttons */}
      <div style={{ display: "flex", gap: 8 }}>
        <Link
          href={previewHref}
          style={{
            textDecoration: "none",
            padding: "6px 12px",
            borderRadius: 6,
            backgroundColor: isPreview ? "#2563eb" : "#f3f4f6",
            color: isPreview ? "#fff" : "#111",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Eye size={16} style={{ marginRight: 6 }} />
          Preview
        </Link>

        <Link
          href={editHref}
          style={{
            textDecoration: "none",
            padding: "6px 12px",
            borderRadius: 6,
            backgroundColor: !isPreview ? "#2563eb" : "#f3f4f6",
            color: !isPreview ? "#fff" : "#111",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Pencil size={16} style={{ marginRight: 6 }} />
          Edit
        </Link>
      </div>

      {/* Right section: PDF download */}
      <PdfDownloadReactPdf data={pdfData} filename={`invoice-${invoiceId}.pdf`} />
    </div>
  );
}
