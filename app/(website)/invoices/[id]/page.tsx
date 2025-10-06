// app/invoices/[id]/page.tsx

import InvoiceEditor from "@/_components/InvoiceEditor.client";
import { InvoiceData } from "@/_components/InvoicePDFDoc";

// export const dynamic = "force-dynamic";
// export const revalidate = 0;

async function getInvoice(id: string): Promise<InvoiceData> {
  return {
    id,
    title: "Invoice",
    from: { name: "IndyDevLab", email: "hello@indylab.dev", address: "6202 Old W Blvd, Phoenix, AZ", phone: "702-555-0179" },
    billTo: { name: "Client Name", email: "", address: "", phone: "" },
    number: "INV0001",
    date: new Date().toISOString().slice(0, 10),
    status: "Draft",
    items: [
      { id: "i1", description: "Design work", rate: 120, qty: 10 },
      { id: "i2", description: "Development", rate: 140, qty: 20 },
    ],
    notes: "",
    taxPercent: 0,
    currency: "USD",
    brand: { name: "Invoice Simple Clone" },
  };
}

export default async function InvoicePage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { mode?: "preview" | "edit" };
}) {
  const initialData = await getInvoice(params.id);
const mode = searchParams.mode === "preview" ? "preview" : "edit";
return <InvoiceEditor initialData={initialData} mode={mode} />;

}
