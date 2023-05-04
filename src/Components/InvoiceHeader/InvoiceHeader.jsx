import ArrowDown from '../../Images/icon-arrow-down.svg';

import { generateRandomID } from '../../Utils/RandomId';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function InvoiceHeader({ invoiceCount, handleFilterChange, filter, openInvoiceFormNewModal, isTablet, generateIDModal }) {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalOpen = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleFilterOptionSelect = (event) => {
    handleFilterChange(event.target.value);
    handleModalOpen(!isModalOpen);
  };

  const handleAddInvoice = () => {
    const newID = generateRandomID();
    navigate(`/invoices/${newID}/new`);
  };

  const handleAddInvoiceModal = () => {
    openInvoiceFormNewModal();
    const newID = generateRandomID();
    generateIDModal(newID);
  };

  return (
    <div className="invoice-header container">
      <div className="invoice-header__total">
        <h2 className="invoice-header__total-title">Invoices</h2>

        <p className="invoice-header__total-sum">
          {invoiceCount} {filter === 'all' ? 'Invoices' : filter.charAt(0).toUpperCase() + filter.slice(1) + ' Invoices'}
        </p>
      </div>
      <div className="invoice-header__buttons">
        <div className="invoice-header__buttons-select" onClick={handleModalOpen}>
          <h3>Filter</h3>
          <img src={ArrowDown} alt="arrow down" />
          {isModalOpen && (
            <div className="modal">
              <div className="modal-body">
                <label>
                  <input className="modal-input__checkbox" type="checkbox" value="paid" checked={filter === 'paid'} onChange={handleFilterOptionSelect} />
                  Paid
                </label>
                <label>
                  <input className="modal-input__checkbox" type="checkbox" value="pending" checked={filter === 'pending'} onChange={handleFilterOptionSelect} />
                  Pending
                </label>
                <label>
                  <input className="modal-input__checkbox" type="checkbox" value="draft" checked={filter === 'draft'} onChange={handleFilterOptionSelect} />
                  Draft
                </label>
                <label>
                  <input className="modal-input__checkbox" type="checkbox" value="all" checked={filter === 'all'} onChange={handleFilterOptionSelect} />
                  All
                </label>
              </div>
            </div>
          )}
        </div>
        <div className="invoice-header__button">
          <button className="invoice-header__button-plus" onClick={isTablet ? handleAddInvoiceModal : handleAddInvoice}>
            <svg width="11" height="11" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.313 10.023v-3.71h3.71v-2.58h-3.71V.023h-2.58v3.71H.023v2.58h3.71v3.71z" fill="#7C5DFA" fillRule="nonzero" />
            </svg>
          </button>
          <h3>New</h3>
        </div>
      </div>
    </div>
  );
}
