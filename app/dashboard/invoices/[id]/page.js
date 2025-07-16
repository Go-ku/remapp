import { getInvoiceById } from "@/lib/mongoose/actions/invoiceActions";
import { getPaymentsForInvoice } from "@/lib/mongoose/actions/paymentActions";

export default async function InvoiceDetail({ params }) {
  const invoice = await getInvoiceById(params.id);
  const payments = await getPaymentsForInvoice(params.id);

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Invoice #{invoice.invoiceNumber}</h1>
      {/* Render invoice summary here */}

      <h2 className="text-lg font-semibold mt-6">Payment History</h2>
      <ul className="space-y-2">
        {payments.length > 0 ? (
          payments.map((payment) => (
            <li key={payment._id} className="border p-3 rounded">
              <p>Paid: ZMW {payment.amount}</p>
              <p>Date: {new Date(payment.paidAt).toLocaleDateString()}</p>
              <p>Method: {payment.method}</p>
              <p>Receipt #: {payment.receiptNumber}</p>
            </li>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No payments recorded.</p>
        )}
      </ul>
    </div>
  );
}
