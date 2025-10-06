// components/invoice/pdf/InvoicePDFDoc.tsx
import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";

// (Optional) Register a font (you can swap to your own)
// Font.register({
//   family: "Inter",
//   src: "https://fonts.gstatic.com/s/inter/v12/UcCO3Fwr0cG4Oy3w.ttf",
// });

export type InvoiceItem = { name: string; qty: number; price: number };
export type InvoiceData = {
  id: string;
  customer: { name: string; address?: string; email?: string };
  items: InvoiceItem[];
  issueDate?: string; // ISO string
  dueDate?: string;   // ISO string
  notes?: string;
  brand?: { name?: string };
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 36,
    paddingHorizontal: 40,
    fontSize: 11,
    color: "#111111",
    // fontFamily: "Inter", // if registered
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  title: { fontSize: 18, fontWeight: 700 },
  small: { fontSize: 10, color: "#555555" },
  section: { marginTop: 12, marginBottom: 6 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottom: "1px solid #e5e7eb",
    paddingBottom: 6,
    marginTop: 8,
  },
  th: { flexGrow: 1, fontWeight: 700 },
  thRight: { width: 80, textAlign: "right", fontWeight: 700 },
  tr: {
    flexDirection: "row",
    paddingTop: 6,
    paddingBottom: 6,
    borderBottom: "1px solid #f1f5f9",
  },
  td: { flexGrow: 1 },
  tdRight: { width: 80, textAlign: "right" },
  totalRow: { marginTop: 8, flexDirection: "row", justifyContent: "flex-end" },
  totalLabel: { marginRight: 12, fontWeight: 700 },
  totalValue: { width: 100, textAlign: "right", fontWeight: 700 },
  notes: { marginTop: 10, color: "#444444" },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 40,
    right: 40,
    textAlign: "center",
    color: "#9ca3af",
    fontSize: 9,
  },
});

export default function InvoicePDFDoc({ data }: { data: InvoiceData }) {
  const subtotal = data.items.reduce((acc, it) => acc + it.qty * it.price, 0);
  const total = subtotal; // extend with tax/discounts later

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>{data.brand?.name || "Your Company"}</Text>
            <Text style={styles.small}>Invoice #{data.id}</Text>
            {data.issueDate && <Text style={styles.small}>Issued: {data.issueDate}</Text>}
            {data.dueDate && <Text style={styles.small}>Due: {data.dueDate}</Text>}
          </View>
          <View>
            <Text style={{ fontSize: 12, fontWeight: 700 }}>Bill To</Text>
            <Text>{data.customer.name}</Text>
            {data.customer.address && <Text>{data.customer.address}</Text>}
            {data.customer.email && <Text>{data.customer.email}</Text>}
          </View>
        </View>

        {/* Items */}
        <View style={styles.section}>
          <View style={styles.tableHeader}>
            <Text style={styles.th}>Item</Text>
            <Text style={styles.thRight}>Qty</Text>
            <Text style={styles.thRight}>Price</Text>
          </View>

          {data.items.map((it, idx) => (
            <View key={idx} style={styles.tr}>
              <Text style={styles.td}>{it.name}</Text>
              <Text style={styles.tdRight}>{it.qty}</Text>
              <Text style={styles.tdRight}>${it.price.toFixed(2)}</Text>
            </View>
          ))}

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>${subtotal.toFixed(2)}</Text>
          </View>
          {/* Add tax/discount/fees here if needed and update total */}
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
          </View>
        </View>

        {/* Notes */}
        {data.notes && (
          <View style={styles.section}>
            <Text style={{ fontWeight: 700, marginBottom: 4 }}>Notes</Text>
            <Text style={styles.notes}>{data.notes}</Text>
          </View>
        )}

        {/* Footer */}
        <Text style={styles.footer}>Thank you for your business.</Text>
      </Page>
    </Document>
  );
}
