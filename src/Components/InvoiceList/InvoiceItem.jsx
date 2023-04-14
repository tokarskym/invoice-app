import { useContext } from 'react';
import { ThemeContext } from '../../Context/Theme';

import InvoiceStatus from './ReusableComponents/InvoiceStatus';

export default function InvoiceItem({ invoice }) {
  const [{ theme }] = useContext(ThemeContext);

  return (
    <div className="invoice-item" style={{ backgroundColor: theme.invoiceItemColor }}>
      <div className="invoice-item__id">
        <span className="invoice-item__prefix">#</span>
        <h3>{invoice.id}</h3>
      </div>
      <p className="invoice-item__payment-due">{invoice.paymentDue}</p>
      <h3 className="invoice-item__total">{invoice.total}</h3>
      <p className="invoice-item__client">{invoice.clientName}</p>
      <InvoiceStatus invoice={invoice} />
    </div>
  );
}
