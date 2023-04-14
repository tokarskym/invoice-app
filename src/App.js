import './Styles/styles.css';

import InvoiceHeader from './Components/InvoiceHeader/InvoiceHeader';
import InvoiceList from './Components/InvoiceList/InvoiceList';
import InvoiceDetails from './Components/InvoiceList/InvoiceDetails';
import Navbar from './Components/Navbar/Navbar';

import { invoices } from './Data/InvoicesData';

import { Routes, Route, useLocation } from 'react-router-dom';
import { useState } from 'react';

function App() {
  const [invoicesList, setInvoicesList] = useState(invoices);
  const [filter, setFilter] = useState('all');

  const handleFilterChange = (selectedFilter) => {
    setFilter(selectedFilter);
  };

  const handleAddInvoice = () => {
    // ...
  };
  const location = useLocation();

  const filteredInvoices = invoicesList.filter((invoice) => {
    if (filter === 'all') {
      return true;
    } else if (filter === 'draft') {
      return invoice.status === 'draft';
    } else if (filter === 'pending') {
      return invoice.status === 'pending';
    } else if (filter === 'paid') {
      return invoice.status === 'paid';
    }
  });

  return (
    <div className="app">
      <Navbar />
      {location.pathname === '/' && (
        <InvoiceHeader invoiceCount={filteredInvoices.length} handleFilterChange={handleFilterChange} onAddInvoice={handleAddInvoice} filter={filter} />
      )}
      <Routes>
        <Route path="/invoices/:id" element={<InvoiceDetails invoicesList={invoicesList} />} />
        <Route exact path="/" element={<InvoiceList invoices={filteredInvoices} filter={filter} />} />
      </Routes>
    </div>
  );
}

export default App;
