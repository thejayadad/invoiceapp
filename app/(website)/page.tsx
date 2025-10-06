"use client";

import Toolbar from "@/_components/Toolbar.server";


export default function HomePage() {
  return (
    <div>
      <Toolbar
        invoiceId="demo"
        mode="edit"
        pdfData={{
          id: "demo",
          title: "Demo Invoice",
          from: { name: "", email: "", address: "", phone: "" },
          billTo: { name: "", email: "", address: "", phone: "" },
          number: "",
          date: "",
          status: "Draft",
          items: [],
          notes: "",
          taxPercent: 0,
          currency: "USD",
          brand: { name: "Demo" },
        }}
      />
      <div>Welcome to your Invoice app</div>
    </div>
  );
}
