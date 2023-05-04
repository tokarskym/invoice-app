import Empty from '../../Images/illustration-empty.svg';
import InvoiceItem from './InvoiceItem';

import { Link } from 'react-router-dom';


export default function InvoiceList({ invoices, filter, isTablet }) {
  return (
    <div className="container list-container">
      {invoices.length === 0 && filter !== 'all' ? (
        <div className="empty-message">
          <img src={Empty} alt="No invoices illustration" />
          <h2>No {filter} invoices</h2>
          <p>
            Create a new invoice by clicking the <br /> <b>New Invoice</b> button and get started
          </p>
        </div>
      ) : (
        invoices.length === 0 &&
        filter === 'all' && (
          <div className="empty-message">
            <img src={Empty} alt="No invoices illustration" />
            <h2>There is nothing here</h2>
            <p>
              Create a new invoice by clicking the <br /> <b>New Invoice</b> button and get started
            </p>
          </div>
        )
      )}
      {invoices.map((invoice) =>
        isTablet ? (
          <InvoiceItem key={invoice.id} invoice={invoice} isTablet={isTablet} />
        ) : (
          <Link key={invoice.id} to={{ pathname: `/invoices/${invoice.id}` }} className="invoice-item__wrapper">
            <InvoiceItem invoice={invoice} isTablet={isTablet} />
          </Link>
        )
      )}
    </div>
  );
}
