// app/invoices/[id]/page.tsx

import { InvoiceData } from "@/_components/InvoicePDFDoc";
import Toolbar from "@/_components/Toolbar.server";

// Optional: disable caching for dynamic invoice editing
// export const dynamic = "force-dynamic";
// export const revalidate = 0;

async function getInvoice(id: string): Promise<InvoiceData> {
  // Replace this with your Prisma or DB query later
  return {
    id,
    customer: {
      name: "Acme Corp",
      address: "123 Main St, Springfield, USA",
      email: "billing@acme.com",
    },
    items: [
      { name: "Design work", qty: 10, price: 120 },
      { name: "Development", qty: 20, price: 140 },
    ],
    issueDate: "2025-10-01",
    dueDate: "2025-10-15",
    notes: "Payment due within 14 days. Thank you!",
    brand: { name: "Invoice Simple Clone" },
  };
}

type PageProps = {
  params: { id: string };
  searchParams: { mode?: "preview" | "edit" };
};

export default async function InvoicePage({ params, searchParams }: PageProps) {
  const data = await getInvoice(params.id);
  const mode = searchParams.mode === "preview" ? "preview" : "edit";

  const subtotal = data.items.reduce((acc, it) => acc + it.qty * it.price, 0);
  const total = subtotal; // extend with tax/discounts later

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      {/* Toolbar with preview/edit buttons + PDF download */}
      <Toolbar invoiceId={data.id} mode={mode} pdfData={data} />

      {/* Main invoice section */}
      <main
        style={{
          margin: "24px auto",
          maxWidth: 860,
          backgroundColor: "#fff",
          padding: 24,
          borderRadius: 8,
          boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
          color: "#111",
        }}
      >
        {/* Header */}
        <header
          style={{
            marginBottom: 16,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
          }}
        >
          <h1 style={{ fontSize: 20, fontWeight: 700 }}>
            Invoice #{data.id}
          </h1>
          <div style={{ fontSize: 12, color: "#555" }}>Mode: {mode}</div>
        </header>

        {/* Conditional UI: edit vs preview */}
        {mode === "edit" ? (
          <>
            <div style={{ marginBottom: 10 }}>
              <label
                style={{ display: "block", fontSize: 12, marginBottom: 4 }}
              >
                Bill To
              </label>
              <input
                defaultValue={data.customer.name}
                readOnly
                style={{
                  width: "100%",
                  padding: "8px 10px",
                  border: "1px solid #e5e7eb",
                  borderRadius: 6,
                }}
              />
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
                  <th style={{ textAlign: "left", padding: "6px 0" }}>Item</th>
                  <th style={{ textAlign: "right", padding: "6px 0" }}>Qty</th>
                  <th style={{ textAlign: "right", padding: "6px 0" }}>Price</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((it, i) => (
                  <tr key={i}>
                    <td style={{ padding: "6px 0" }}>{it.name}</td>
                    <td
                      style={{
                        padding: "6px 0",
                        textAlign: "right",
                      }}
                    >
                      {it.qty}
                    </td>
                    <td
                      style={{
                        padding: "6px 0",
                        textAlign: "right",
                      }}
                    >
                      ${it.price}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <>
            <section style={{ marginBottom: 16 }}>
              <p style={{ marginBottom: 4 }}>
                <strong>Bill To:</strong> {data.customer.name}
              </p>
              {data.customer.address && (
                <p style={{ margin: 0, color: "#444" }}>
                  {data.customer.address}
                </p>
              )}
              {data.customer.email && (
                <p style={{ margin: 0, color: "#444" }}>
                  {data.customer.email}
                </p>
              )}
              <p style={{ marginTop: 8, fontSize: 12, color: "#555" }}>
                Issued: {data.issueDate} &nbsp;•&nbsp; Due: {data.dueDate}
              </p>
            </section>

            <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
              {data.items.map((it, i) => (
                <li
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "6px 0",
                    borderBottom: "1px solid #f1f5f9",
                  }}
                >
                  <span>{it.name}</span>
                  <span style={{ fontVariantNumeric: "tabular-nums" }}>
                    {it.qty} × ${it.price.toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>

            {/* Totals */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: 12,
                gap: 12,
                fontWeight: 700,
              }}
            >
              <span>Subtotal</span>
              <span style={{ width: 120, textAlign: "right" }}>
                ${subtotal.toFixed(2)}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: 4,
                gap: 12,
                fontWeight: 700,
              }}
            >
              <span>Total</span>
              <span style={{ width: 120, textAlign: "right" }}>
                ${total.toFixed(2)}
              </span>
            </div>

            {/* Notes */}
            {data.notes && (
              <p style={{ marginTop: 14, color: "#444" }}>
                <strong>Notes: </strong>
                {data.notes}
              </p>
            )}
          </>
        )}
      </main>
    </div>
  );
}
