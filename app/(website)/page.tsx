// app/invoices/[id]/page.tsx
import Toolbar from "@/_components/Toolbar.server";
import { notFound } from "next/navigation";

// Simulate SSR fetch
async function getInvoice(id: string) {
  // In real app, fetch from DB with Prisma
  return {
    id,
    customer: { name: "Acme Corp" },
    items: [
      { name: "Design work", qty: 10, price: 120 },
      { name: "Development", qty: 20, price: 140 },
    ],
  };
}

type PageProps = {
  params: { id: string };
  searchParams: { mode?: "preview" | "edit" };
};

export default async function InvoicePage({ params, searchParams }: PageProps) {
  const invoice = await getInvoice(params.id);
  if (!invoice) return notFound();

  const mode = searchParams.mode === "preview" ? "preview" : "edit";

  return (
    <div className="h-full bg-base-200">
      {/* SSR toolbar */}
      <Toolbar invoiceId={invoice.id} mode={mode} pdfData={invoice} />

      {/* The content we will capture as a PDF (give it the ID!) */}
      <main className="mx-auto max-w-6xl p-4">
        <div
          id="invoice-root"
          className="rounded-xl bg-base-100 p-6 shadow-sm"
        >
          <header className="mb-6 flex items-center justify-between">
            <h1 className="text-xl font-semibold">Invoice #{invoice.id}</h1>
            <div className="text-sm opacity-70">Mode: {mode}</div>
          </header>

          {/* Example content — replace with your real form/preview */}
          {mode === "edit" ? (
            <div className="space-y-3">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Bill To</span>
                </label>
                <input
                  defaultValue={invoice.customer.name}
                  className="input input-bordered"
                  readOnly
                />
              </div>
              <div className="overflow-x-auto">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Item</th>
                      <th className="text-right">Qty</th>
                      <th className="text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {invoice.items.map((it, i) => (
                      <tr key={i}>
                        <td>{it.name}</td>
                        <td className="text-right">{it.qty}</td>
                        <td className="text-right">${it.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="alert">
                This is just demo content—you’ll replace with real inputs.
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="text-lg font-medium">{invoice.customer.name}</div>
              <div className="divider my-2" />
              <ul className="space-y-1">
                {invoice.items.map((it, i) => (
                  <li key={i} className="flex justify-between">
                    <span>{it.name}</span>
                    <span className="tabular-nums">
                      {it.qty} × ${it.price}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
