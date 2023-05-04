import InvoiceStatus from './ReusableComponents/InvoiceStatus';

import { Link } from 'react-router-dom';

export default function InvoiceItem({ invoice, isTablet }) {
  return (
    <div className="invoice-item">
      <div className="invoice-item__id">
        <span className="invoice-item__prefix">#</span>
        <h3>{invoice.id}</h3>
      </div>
      <p className="invoice-item__payment-due">{invoice.paymentDue}</p>
      <h3 className="invoice-item__total">{invoice.total}</h3>
      <p className="invoice-item__client">{invoice.clientName}</p>
      <InvoiceStatus invoice={invoice} />
      {isTablet && (
        <Link to={{ pathname: `/invoices/${invoice.id}` }} className="link-arrow-right">
          <svg width="7" height="10" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1l4 4-4 4" stroke="#7C5DFA" strokeWidth="2" fill="none" fillRule="evenodd" />
          </svg>
        </Link>
      )}
    </div>
  );
}
