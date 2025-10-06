"use client";

import { useMemo, useState } from "react";
import type { InvoiceData, InvoiceItem, Party } from "@/_components/InvoicePDFDoc";
import Toolbar from "./Toolbar.server";

function currency(n: number, ccy = "USD") {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: ccy }).format(n || 0);
}

export default function InvoiceEditor({
  initialData,
  mode,
}: {
  initialData: InvoiceData;
  mode: "preview" | "edit";
}) {
  const [data, setData] = useState<InvoiceData>(initialData);

  const subtotal = useMemo(
    () =>
      data.items.reduce(
        (acc: number, it: InvoiceItem) => acc + (Number(it.qty) || 0) * (Number(it.rate) || 0),
        0
      ),
    [data.items]
  );
  const tax = useMemo(
    () => (data.taxPercent ? subtotal * (Number(data.taxPercent) / 100) : 0),
    [subtotal, data.taxPercent]
  );
  const total = subtotal + tax;
  const ccy = data.currency || "USD";

  // === update helpers ===
  const update = <K extends keyof InvoiceData>(key: K, val: InvoiceData[K]) =>
    setData((prev) => ({ ...prev, [key]: val }));

  const updateParty = (side: "from" | "billTo", patch: Partial<Party>) =>
    setData((prev) => ({ ...prev, [side]: { ...prev[side], ...patch } }));

  const updateItem = (id: string, patch: Partial<InvoiceItem>) =>
    setData((prev) => ({
      ...prev,
      items: prev.items.map((it) => (it.id === id ? { ...it, ...patch } : it)),
    }));

  const addItem = () =>
    setData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        { id: crypto.randomUUID(), description: "", rate: 0, qty: 1 },
      ],
    }));

  const removeItem = (id: string) =>
    setData((prev) => ({
      ...prev,
      items: prev.items.filter((it) => it.id !== id),
    }));

  // === UI ===
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb" }}>
      <Toolbar invoiceId={data.id} mode={mode} pdfData={data} />

      <div
        style={{
          margin: "24px auto",
          maxWidth: 1100,
          display: "grid",
          gridTemplateColumns: "1fr 320px",
          gap: 16,
        }}
      >
        <main
          style={{
            backgroundColor: "#fff",
            padding: 24,
            borderRadius: 8,
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            color: "#111",
          }}
        >
          {/* === TITLE & LOGO === */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 160px",
              gap: 12,
              marginBottom: 12,
            }}
          >
            <div>
              <label style={{ fontSize: 12, color: "#6b7280" }}>Invoice Title</label>
              {mode === "edit" ? (
                <input
                  value={data.title}
                  onChange={(e) => update("title", e.target.value)}
                  placeholder="Invoice"
                  style={{
                    width: "100%",
                    padding: 8,
                    border: "1px solid #e5e7eb",
                    borderRadius: 6,
                  }}
                />
              ) : (
                <h1 style={{ fontSize: 22, fontWeight: 700 }}>{data.title}</h1>
              )}
            </div>
            <div>
              <label style={{ fontSize: 12, color: "#6b7280" }}>Logo URL</label>
              {mode === "edit" ? (
                <input
                  value={data.logoUrl || ""}
                  onChange={(e) => update("logoUrl", e.target.value)}
                  placeholder="https://…/logo.png"
                  style={{
                    width: "100%",
                    padding: 8,
                    border: "1px solid #e5e7eb",
                    borderRadius: 6,
                  }}
                />
              ) : (
                data.logoUrl && <img src={data.logoUrl} alt="logo" width={120} />
              )}
            </div>
          </div>

          {/* === FROM / BILL TO === */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginBottom: 12,
            }}
          >
            {(["from", "billTo"] as const).map((side) => {
              const party = data[side];
              return (
                <div key={side} style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: 12 }}>
                  <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 6 }}>
                    {side === "from" ? "From" : "Bill To"}
                  </div>
                  {mode === "edit" ? (
                    <>
                      {["name", "email", "address", "phone"].map((field) => (
                        <input
                          key={field}
                          value={(party as any)[field] || ""}
                          onChange={(e) =>
                            updateParty(side, { [field]: e.target.value } as any)
                          }
                          placeholder={field[0].toUpperCase() + field.slice(1)}
                          style={{
                            width: "100%",
                            padding: 8,
                            border: "1px solid #e5e7eb",
                            borderRadius: 6,
                            marginBottom: 6,
                          }}
                        />
                      ))}
                    </>
                  ) : (
                    <div>
                      <div style={{ fontWeight: 600 }}>{party.name}</div>
                      {party.email && <div>{party.email}</div>}
                      {party.address && <div>{party.address}</div>}
                      {party.phone && <div>{party.phone}</div>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* === LINE ITEMS === */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>Line Items</div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
                  <th style={{ textAlign: "left" }}>Description</th>
                  <th style={{ textAlign: "right", width: 120 }}>Rate</th>
                  <th style={{ textAlign: "right", width: 80 }}>Qty</th>
                  <th style={{ textAlign: "right", width: 130 }}>Amount</th>
                  {mode === "edit" && <th style={{ width: 40 }} />}
                </tr>
              </thead>
              <tbody>
                {data.items.map((it) => {
                  const amount = (it.qty || 0) * (it.rate || 0);
                  return (
                    <tr key={it.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                      {mode === "edit" ? (
                        <>
                          <td>
                            <input
                              value={it.description}
                              onChange={(e) =>
                                updateItem(it.id, { description: e.target.value })
                              }
                              placeholder="Description"
                              style={{
                                width: "100%",
                                padding: 8,
                                border: "1px solid #e5e7eb",
                                borderRadius: 6,
                              }}
                            />
                          </td>
                          <td style={{ textAlign: "right" }}>
                            <input
                              type="number"
                              value={it.rate}
                              onChange={(e) =>
                                updateItem(it.id, { rate: Number(e.target.value) || 0 })
                              }
                              style={{
                                width: "100%",
                                padding: 8,
                                border: "1px solid #e5e7eb",
                                borderRadius: 6,
                                textAlign: "right",
                              }}
                            />
                          </td>
                          <td style={{ textAlign: "right" }}>
                            <input
                              type="number"
                              value={it.qty}
                              onChange={(e) =>
                                updateItem(it.id, { qty: Number(e.target.value) || 0 })
                              }
                              style={{
                                width: "100%",
                                padding: 8,
                                border: "1px solid #e5e7eb",
                                borderRadius: 6,
                                textAlign: "right",
                              }}
                            />
                          </td>
                          <td style={{ textAlign: "right" }}>{currency(amount, ccy)}</td>
                          <td style={{ textAlign: "center" }}>
                            <button
                              type="button"
                              onClick={() => removeItem(it.id)}
                              style={{
                                padding: "6px 10px",
                                borderRadius: 6,
                                border: "1px solid #fca5a5",
                                background: "#fee2e2",
                                color: "#b91c1c",
                                cursor: "pointer",
                              }}
                            >
                              ✕
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td>{it.description}</td>
                          <td style={{ textAlign: "right" }}>{currency(it.rate, ccy)}</td>
                          <td style={{ textAlign: "right" }}>{it.qty}</td>
                          <td style={{ textAlign: "right" }}>{currency(amount, ccy)}</td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {mode === "edit" && (
              <button
                type="button"
                onClick={addItem}
                style={{
                  marginTop: 8,
                  padding: "8px 12px",
                  borderRadius: 6,
                  border: "1px solid #e5e7eb",
                  background: "#f9fafb",
                  cursor: "pointer",
                }}
              >
                + Add Line
              </button>
            )}
          </div>

          {/* === TOTALS === */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 12 }}>
            <div />
            <div
              style={{
                border: "1px solid #e5e7eb",
                borderRadius: 8,
                padding: 12,
              }}
            >
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", rowGap: 6 }}>
                <div>Subtotal</div>
                <div style={{ textAlign: "right" }}>{currency(subtotal, ccy)}</div>

                <div>Tax ({data.taxPercent || 0}%)</div>
                <div style={{ textAlign: "right" }}>{currency(tax, ccy)}</div>

                <div style={{ fontWeight: 700 }}>Total</div>
                <div style={{ textAlign: "right", fontWeight: 700 }}>
                  {currency(total, ccy)}
                </div>
              </div>
            </div>
          </div>

          {/* === NOTES === */}
          <div style={{ marginTop: 12 }}>
            <label style={{ fontSize: 12, color: "#6b7280" }}>Notes</label>
            {mode === "edit" ? (
              <textarea
                value={data.notes || ""}
                onChange={(e) => update("notes", e.target.value)}
                rows={4}
                placeholder="Notes to customer"
                style={{
                  width: "100%",
                  padding: 10,
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                }}
              />
            ) : (
              <p style={{ whiteSpace: "pre-wrap", marginTop: 6 }}>
                {data.notes || "—"}
              </p>
            )}
          </div>
        </main>

        {/* === SIDE PANEL === */}
        <aside
          style={{
            backgroundColor: "#fff",
            padding: 12,
            borderRadius: 8,
            boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            display: "grid",
            gap: 12,
            height: "fit-content",
          }}
        >
          <Section title="Preview via Email" />
          <Section title="Payments (Stripe / PayPal)" />
          <Section title="Templates / Colors" />
          <Section title="Automated Reminders" />
        </aside>
      </div>
    </div>
  );
}

function Section({ title }: { title: string }) {
  return (
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 8, padding: 12 }}>
      <div style={{ fontWeight: 700, marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 12, color: "#6b7280" }}>Placeholder (wire later)</div>
    </div>
  );
}
