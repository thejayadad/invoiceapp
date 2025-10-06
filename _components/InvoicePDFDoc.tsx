// _components/InvoicePDFDoc.tsx
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

export type InvoiceItem = { id: string; description: string; rate: number; qty: number };
export type Party = { name: string; email?: string; address?: string; phone?: string };
export type InvoiceData = {
  id: string;
  title: string;
  logoUrl?: string;
  from: Party;
  billTo: Party;
  number: string;
  date: string; // yyyy-mm-dd
  status: "Draft" | "Sent" | "Paid" | "Overdue";
  items: InvoiceItem[];
  notes?: string;
  taxPercent?: number;
  currency?: string; // e.g., "USD"
  brand?: { name?: string };
};

const styles = StyleSheet.create({
  page: { paddingTop: 36, paddingBottom: 36, paddingHorizontal: 40, fontSize: 11, color: "#111" },
  row: { flexDirection: "row" }, spaceBetween: { justifyContent: "space-between" },
  header: { marginBottom: 16 }, h1: { fontSize: 18, fontWeight: 700, marginBottom: 6 },
  small: { fontSize: 10, color: "#555" }, card: { border: "1px solid #e5e7eb", padding: 10, borderRadius: 4 },
  label: { fontSize: 9, color: "#6b7280", marginBottom: 2 }, sectionTitle: { fontSize: 12, fontWeight: 700, marginTop: 14, marginBottom: 6 },
  divider: { height: 1, backgroundColor: "#e5e7eb", marginVertical: 10 },
  tableHeader: { flexDirection: "row", borderBottom: "1px solid #e5e7eb", paddingBottom: 6 },
  thDesc: { flexGrow: 1, fontWeight: 700 }, thNum: { width: 80, textAlign: "right", fontWeight: 700 },
  rowItem: { flexDirection: "row", paddingVertical: 6, borderBottom: "1px solid #f3f4f6" },
  tdDesc: { flexGrow: 1 }, tdNum: { width: 80, textAlign: "right" },
  totals: { marginTop: 10, marginLeft: "auto", width: 220 },
  totalsRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 4 },
  notes: { marginTop: 12 }, footer: { position: "absolute", bottom: 24, left: 40, right: 40, textAlign: "center", fontSize: 9, color: "#9ca3af" },
});

export default function InvoicePDFDoc({ data }: { data: InvoiceData }) {
  const currency = data.currency || "USD";
  const subtotal = data.items.reduce((acc: number, it: InvoiceItem) => acc + it.qty * it.rate, 0);
  const tax = data.taxPercent ? subtotal * (data.taxPercent / 100) : 0;
  const total = subtotal + tax;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={[styles.header, styles.row, styles.spaceBetween]}>
          <View>
            <Text style={styles.h1}>{data.title || "Invoice"}</Text>
            {!!data.brand?.name && <Text style={styles.small}>{data.brand.name}</Text>}
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.small}>Status: {data.status}</Text>
            <Text style={styles.small}>Invoice #: {data.number}</Text>
            <Text style={styles.small}>Date: {data.date}</Text>
          </View>
        </View>

        <View style={[styles.row, styles.spaceBetween, { gap: 12 }]}>
          <View style={[styles.card, { flex: 1 }]}>
            <Text style={styles.label}>From</Text>
            <Text>{data.from.name}</Text>
            {!!data.from.email && <Text>{data.from.email}</Text>}
            {!!data.from.address && <Text>{data.from.address}</Text>}
            {!!data.from.phone && <Text>{data.from.phone}</Text>}
          </View>
          <View style={[styles.card, { flex: 1 }]}>
            <Text style={styles.label}>Bill To</Text>
            <Text>{data.billTo.name}</Text>
            {!!data.billTo.email && <Text>{data.billTo.email}</Text>}
            {!!data.billTo.address && <Text>{data.billTo.address}</Text>}
            {!!data.billTo.phone && <Text>{data.billTo.phone}</Text>}
          </View>
        </View>

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Items</Text>
        <View style={styles.tableHeader}>
          <Text style={styles.thDesc}>Description</Text>
          <Text style={styles.thNum}>Rate</Text>
          <Text style={styles.thNum}>Qty</Text>
          <Text style={styles.thNum}>Amount</Text>
        </View>

        {data.items.map((it) => {
          const amount = it.qty * it.rate;
          return (
            <View key={it.id} style={styles.rowItem}>
              <Text style={styles.tdDesc}>{it.description || "-"}</Text>
              <Text style={styles.tdNum}>{new Intl.NumberFormat("en-US", { style: "currency", currency }).format(it.rate)}</Text>
              <Text style={styles.tdNum}>{it.qty}</Text>
              <Text style={styles.tdNum}>{new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount)}</Text>
            </View>
          );
        })}

        <View style={styles.totals}>
          <View style={styles.totalsRow}>
            <Text>Subtotal</Text>
            <Text>{new Intl.NumberFormat("en-US", { style: "currency", currency }).format(subtotal)}</Text>
          </View>
          {!!data.taxPercent && (
            <View style={styles.totalsRow}>
              <Text>Tax ({data.taxPercent}%)</Text>
              <Text>{new Intl.NumberFormat("en-US", { style: "currency", currency }).format(tax)}</Text>
            </View>
          )}
          <View style={[styles.totalsRow, { fontWeight: 700 }]}>
            <Text>Total</Text>
            <Text>{new Intl.NumberFormat("en-US", { style: "currency", currency }).format(total)}</Text>
          </View>
        </View>

        {!!data.notes && (
          <>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text style={styles.notes}>{data.notes}</Text>
          </>
        )}

        <Text style={styles.footer}>Thank you for your business.</Text>
      </Page>
    </Document>
  );
}
