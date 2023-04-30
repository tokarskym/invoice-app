import BackButton from '../../Utils/BackButton';
import DeleteModal from './DeleteModal';
import InvoiceStatus from './ReusableComponents/InvoiceStatus';

import { format } from 'date-fns';
import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

export default function InvoiceDetails({ invoicesList, onDeleteInvoice, onMarkAsPaid }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const invoice = invoicesList ? invoicesList.find((invoice) => invoice.id === id) : undefined;

  const [showModal, setShowModal] = useState(false);

  const handleDeleteInvoice = (id) => {
    onDeleteInvoice(id);
    navigate(`/`);
  };

  const handleCancelDeletion = () => {
    setShowModal(false);
  };

  const formatDate = (date) => {
    if (!date) return '';
    return format(new Date(date), 'dd MMM yyyy');
  };

  return (
    <>
      <BackButton />
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
            <h3>{formatDate(invoice.createdAt)}</h3>
          </div>
          <div className="invoice-details__info-payment">
            <p>Payment Due</p>
            <h3>{formatDate(invoice.paymentDue)}</h3>
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
            <p>Grand Total</p>
            <h2 className="info-total">{invoice.total} PLN</h2>
          </div>
        </div>
      </div>
      <div className="invoice-details__buttons">
        {invoice.status !== 'paid' && (
          <Link to={`/invoices/${id}/edit`} className="edit-button">
            Edit
          </Link>
        )}
        <button className="delete-button" onClick={() => setShowModal(true)}>
          Delete
        </button>
        {invoice.status !== 'paid' && invoice.status !== 'draft' && (
          <button className="paid-button" onClick={() => onMarkAsPaid(invoice)}>
            Mark as Paid
          </button>
        )}
        {showModal === true && <DeleteModal id={id} onDelete={handleDeleteInvoice} onCancel={handleCancelDeletion} />}
      </div>
    </>
  );
}
