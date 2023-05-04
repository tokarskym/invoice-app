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
  const [isInvoiceFormEditModalOpen, setIsInvoiceFormEditModalOpen] = useState(false); //  INVOICE EDIT FORM AS A MODAL [TABLETS, DESKTOP]
  const [isInvoiceFormNewModalOpen, setIsInvoiceFormNewModalOpen] = useState(false); // NEW INVOICE FORM AS A MODAL [TABLETS, DESKTOP]
  const [newInvoiceID, setNewInvoiceID] = useState(null); //GENERATE NEW ID FOR NEW INVOICE FORM AS A MODAL
  const [scrollY, setScrollY] = useState(0); //PAGE SCROLL VALUE BEFORE OPENING MODAL

  const generateIDModal = (id) => {
    setNewInvoiceID(id);
  };

  const [editedInvoice, setEditedInvoice] = useState(null); //INVOICE E

  const openInvoiceFormModal = (invoice) => {
    setIsInvoiceFormEditModalOpen(true);
    setEditedInvoice(invoice);
    setScrollY(window.pageYOffset);
    window.scrollTo(0, 0);
  };

  const openInvoiceFormNewModal = () => {
    setIsInvoiceFormNewModalOpen(true);
    setScrollY(window.pageYOffset);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    if (isInvoiceFormEditModalOpen || isInvoiceFormNewModalOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
  }, [isInvoiceFormEditModalOpen, isInvoiceFormNewModalOpen]);

  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const updateWidth = () => {
      setIsTablet(window.innerWidth >= 768);
    };

    window.addEventListener('resize', updateWidth);
    updateWidth();

    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const closeModal = (type) => {
    if (type === 'new') {
      setIsInvoiceFormNewModalOpen(false);
    } else if (type === 'edit') {
      setIsInvoiceFormEditModalOpen(false);
    }
    window.scrollTo(0, scrollY);
  };

  return (
    <div className="app">
      <Navbar />
      {location.pathname === '/' && (
        <InvoiceHeader
          invoiceCount={filteredInvoices.length}
          handleFilterChange={handleFilterChange}
          filter={filter}
          openInvoiceFormNewModal={openInvoiceFormNewModal}
          isTablet={isTablet}
          generateIDModal={generateIDModal}
        />
      )}
      <Routes>
        <Route path="/invoices/:id/new" element={<InvoiceForm onAddInvoice={handleAddInvoice} mode="new" />} />
        <Route path="/invoices/:id/edit" element={<InvoiceForm invoicesList={invoicesList} handleEditInvoice={handleEditInvoice} mode="edit" />} />
        <Route
          path="/invoices/:id"
          element={
            <InvoiceDetails
              openInvoiceFormModal={openInvoiceFormModal}
              invoicesList={invoicesList}
              onDeleteInvoice={handleDeleteInvoice}
              onMarkAsPaid={handleMarkAsPaid}
              isTablet={isTablet}
            />
          }
        />
        <Route exact path="/" element={<InvoiceList invoices={filteredInvoices} filter={filter} isTablet={isTablet} />} />
      </Routes>
      {isTablet && isInvoiceFormEditModalOpen && (
        <InvoiceForm onCloseModal={() => closeModal('edit')} invoiceToEdit={editedInvoice} mode="edit" isTablet={isTablet} handleEditInvoice={handleEditInvoice} />
      )}
      {isTablet && isInvoiceFormNewModalOpen && (
        <InvoiceForm onAddInvoice={handleAddInvoice} onCloseModal={() => closeModal('new')} mode="new" isTablet={isTablet} invoiceID={newInvoiceID} />
      )}
    </div>
  );
}

export default App;
