import ArrowDown from '../../Images/icon-arrow-down.svg';

import { useContext, useState } from 'react';
import { ThemeContext } from '../../Context/Theme';

export default function InvoiceHeader({ invoiceCount, handleFilterChange, filter, onAddInvoice }) {
  const [{ theme }] = useContext(ThemeContext);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalOpen = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleFilterOptionSelect = (event) => {
    handleFilterChange(event.target.value);
    handleModalOpen(!isModalOpen);
  };

  return (
    <div className="invoice-header container">
      <div className="invoice-header__total">
        <h2 className="invoice-header__total-title" style={{ color: theme.headingColor }}>
          Invoices
        </h2>

        <p className="invoice-header__total-sum" style={{ color: theme.paragraphColor }}>
          {invoiceCount} {filter === 'all' ? 'Invoices' : filter.charAt(0).toUpperCase() + filter.slice(1) + ' Invoices'}
        </p>
      </div>
      <div className="invoice-header__buttons">
        <div className="invoice-header__buttons-select" style={{ color: theme.headingColor }} onClick={handleModalOpen}>
          <p>Filtruj</p>
          <img src={ArrowDown} alt="arrow down" />
          {isModalOpen && (
            <div className="modal">
              <div className="modal-body">
                <label>
                  <input type="checkbox" value="paid" checked={filter === 'paid'} onChange={handleFilterOptionSelect} />
                  Paid
                </label>
                <label>
                  <input type="checkbox" value="pending" checked={filter === 'pending'} onChange={handleFilterOptionSelect} />
                  Pending
                </label>
                <label>
                  <input type="checkbox" value="draft" checked={filter === 'draft'} onChange={handleFilterOptionSelect} />
                  Draft
                </label>
                <label>
                  <input type="checkbox" value="all" checked={filter === 'all'} onChange={handleFilterOptionSelect} />
                  All
                </label>
              </div>
            </div>
          )}
        </div>
        <div className="invoice-header__button">
          <button className="invoice-header__button-plus" onClick={onAddInvoice}>
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
