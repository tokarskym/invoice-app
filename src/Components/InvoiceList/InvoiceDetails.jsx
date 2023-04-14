import InvoiceStatus from './ReusableComponents/InvoiceStatus';

import { useParams } from 'react-router-dom';
import { useContext } from 'react';
import { ThemeContext } from '../../Context/Theme';

export default function InvoiceDetails({ invoicesList }) {
  const { id } = useParams();
  const invoice = invoicesList.find((inv) => inv.id === id);
  const [{ theme }] = useContext(ThemeContext);

  return (
    <>
      <div className="container">
        <div className="invoice-details__status">
          <p>Status</p>
          <InvoiceStatus invoice={invoice} />
        </div>
        <div className="invoice-details__info">
          <div className="invoice-details__info-id">
            <span className="invoice-item__prefix">#</span>
            <h3>{invoice.id}</h3>
            <p>{invoice.description}</p>
          </div>
          <div className="invoice-details__info-adres">
            <p>{invoice.senderAddress.street}</p>
            <p>{invoice.senderAddress.city}</p>
            <p>{invoice.senderAddress.postCode}</p>
            <p>{invoice.senderAddress.country}</p>
          </div>
          <div className="invoice-details__info-date">
            <p>Invoice Date</p>
            <h3>{invoice.createdAt}</h3>
          </div>
          <div className="invoice-details__info-payment">
            <p>Payment Due</p>
            <h3>{invoice.paymentDue}</h3>
          </div>
          <div className="invoice-details__info-email">
            <p>Sent to</p>
            <h3>{invoice.clientEmail}</h3>
          </div>
          <div className="invoice-details__info-recipient">
            <p>Bill to</p>
            <h3>{invoice.clientName}</h3>
            <p>{invoice.clientAddress.street}</p>
            <p>{invoice.clientAddress.city}</p>
            <p>{invoice.clientAddress.postCode}</p>
            <p>{invoice.clientAddress.country}</p>
          </div>
          <div className="invoice-details__info-items">
            {invoice.items.map((item, index) => (
              <div className="invoice-details__single-item" key={index}>
                <div>
                  <h3>{item.name}</h3>
                  <p>
                    {item.quantity} x {item.price} PLN
                  </p>
                </div>
                <div>
                  <h3>{item.total} PLN </h3>
                </div>
              </div>
            ))}
          </div>
          <div className="invoice-details__info-total">
            <p>Amount Due</p>
            <h2>{invoice.total}</h2>
          </div>
        </div>
      </div>
      <div className="invoice-details__buttons">
        <button className="edit-button">Edit</button>
        <button className="delete-button">Delete</button>
        <button className="paid-button">Mark as Paid</button>
      </div>
    </>
  );
}
