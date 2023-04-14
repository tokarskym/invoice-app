import InvoiceItem from './InvoiceItem';
import { Link } from 'react-router-dom';

export default function InvoiceList({ invoices }) {
  return (
    <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
      {invoices.map((invoice) => (
        <Link key={invoice.id} to={{ pathname: `/invoices/${invoice.id}`, state: { invoice } }} className="invoice-item__wrapper">
          <InvoiceItem invoice={invoice} />
        </Link>
      ))}
    </div>
  );
}
