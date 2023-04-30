import './Styles/styles.css';

import InvoiceHeader from './Components/InvoiceHeader/InvoiceHeader';
import InvoiceForm from './Components/InvoiceForm/InvoiceForm';
import InvoiceList from './Components/InvoiceList/InvoiceList';
import InvoiceDetails from './Components/InvoiceList/InvoiceDetails';
import Navbar from './Components/Navbar/Navbar';

import { invoices } from './Data/InvoicesData';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

function App() {
  const location = useLocation();

  //GET INVOICE LIST FROM LOCAL STORAGE

  const getFromLocalStorage = () => {
    const savedData = localStorage.getItem('invoicesList');
    return savedData ? JSON.parse(savedData) : invoices;
  };

  const [invoicesList, setInvoicesList] = useState(getFromLocalStorage());
  const [filter, setFilter] = useState('all');

  const saveToLocalStorage = (data) => {
    localStorage.setItem('invoicesList', JSON.stringify(data));
  };

  useEffect(() => {
    saveToLocalStorage(invoicesList);
  }, [invoicesList]);

  //FILTER INVOICES BY STATUS

  const handleFilterChange = (selectedFilter) => {
    setFilter(selectedFilter);
  };

  const filteredInvoices = invoicesList.filter((invoice) => {
    return filter === 'all'
      ? true
      : filter === 'draft'
      ? invoice.status === 'draft'
      : filter === 'pending'
      ? invoice.status === 'pending'
      : filter === 'paid'
      ? invoice.status === 'paid'
      : false;
  });

  //INVOICE FUNCTIONS ADD / DELETE / EDIT / MARK AS PAID

  const handleAddInvoice = (newInvoice) => {
    const updatedInvoices = [...invoicesList, { ...newInvoice }];
    setInvoicesList(updatedInvoices);
  };

  const handleDeleteInvoice = (id) => {
    const updatedInvoices = invoicesList.filter((invoice) => invoice.id !== id);
    setInvoicesList(updatedInvoices);
  };

  const handleEditInvoice = (updatedInvoice) => {
    const updatedInvoices = invoicesList.map((invoice) => {
      if (invoice.id === updatedInvoice.id) {
        return updatedInvoice;
      } else {
        return invoice;
      }
    });
    setInvoicesList(updatedInvoices);
  };

  const handleMarkAsPaid = (updatedInvoice) => {
    const updatedInvoices = invoicesList.map((invoice) => {
      if (invoice.id === updatedInvoice.id) {
        return {
          ...updatedInvoice,
          status: 'paid',
        };
      } else {
        return invoice;
      }
    });
    setInvoicesList(updatedInvoices);
  };

  return (
    <div className="app">
      <Navbar />
      {location.pathname === '/' && <InvoiceHeader invoiceCount={filteredInvoices.length} handleFilterChange={handleFilterChange} filter={filter} />}
      <Routes>
        <Route path="/invoices/:id/new" element={<InvoiceForm onAddInvoice={handleAddInvoice} mode="new" />} />
        <Route path="/invoices/:id/edit" element={<InvoiceForm invoicesList={invoicesList} handleEditInvoice={handleEditInvoice} mode="edit" />} />
        <Route path="/invoices/:id" element={<InvoiceDetails invoicesList={invoicesList} onDeleteInvoice={handleDeleteInvoice} onMarkAsPaid={handleMarkAsPaid} />} />
        <Route exact path="/" element={<InvoiceList invoices={filteredInvoices} filter={filter} />} />
      </Routes>
    </div>
  );
}

export default App;
