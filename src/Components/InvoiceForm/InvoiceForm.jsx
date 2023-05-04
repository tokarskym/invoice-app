import BackButton from '../../Utils/BackButton';
import Calendar from '../../Images/icon-calendar.svg';
import DatePicker from 'react-datepicker';

import { useState, useEffect } from 'react';
import { format, addDays } from 'date-fns';
import { useParams, useNavigate } from 'react-router-dom';

import 'react-datepicker/dist/react-datepicker.css';

export default function InvoiceForm({ onAddInvoice, handleEditInvoice, mode, invoicesList, invoiceToEdit, isTablet, onCloseModal, invoiceID }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const newInvoiceID = invoiceID || id;

  //STATES FOR THE NEW OR EDITED INVOICE
  const [createdAt, setCreatedAt] = useState(new Date());
  const [description, setDescription] = useState('');
  const [paymentTerms, setPaymentTerms] = useState();
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [status, setStatus] = useState('pending');
  const [senderAddress, setSenderAddress] = useState({
    street: '',
    city: '',
    postCode: '',
    country: '',
  });
  const [clientAddress, setClientAddress] = useState({
    street: '',
    city: '',
    postCode: '',
    country: '',
  });
  const [items, setItems] = useState([
    {
      id: 1,
      name: '',
      quantity: 0,
      price: 0,
      total: 0,
    },
  ]);
  const [total, setTotal] = useState(0);

  const formatDate = (date) => {
    if (!date) return '';

    return format(date, 'yyyy-MM-dd');
  };

  const calculateDueDate = (createdAt, paymentTerms) => {
    if (!createdAt || !paymentTerms) return '';

    const createdDate = new Date(createdAt);
    const dueDate = addDays(createdDate, paymentTerms);

    return formatDate(dueDate);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const newInvoice = {
    id: newInvoiceID,
    createdAt: createdAt,
    paymentDue: calculateDueDate(createdAt, paymentTerms),
    description: description,
    paymentTerms: paymentTerms,
    clientName: clientName,
    clientEmail: clientEmail,
    status: status,
    senderAddress: {
      street: senderAddress.street,
      city: senderAddress.city,
      postCode: senderAddress.postCode,
      country: senderAddress.country,
    },
    clientAddress: {
      street: clientAddress.street,
      city: clientAddress.city,
      postCode: clientAddress.postCode,
      country: clientAddress.country,
    },
    items: items,
    total: total,
  };

  // ERRORS & VALIDATION

  //ON BLUR STATES FOR "can't be empty" SEPARATED FROM VALIDATION FUNCTION
  const [senderAddressTouched, setSenderAddressTouched] = useState({
    street: false,
    city: false,
    postCode: false,
    country: false,
  });

  const [clientAddressTouched, setClientAddressTouched] = useState({
    street: false,
    city: false,
    postCode: false,
    country: false,
  });

  const [clientNameTouched, setClientNameTouched] = useState(false);
  const [clientEmailTouched, setClientEmailTouched] = useState(false);
  const [paymentTermsTouched, setPaymentTermsTouched] = useState(false);
  const [projectDescriptionTouched, setProjectDescriptionTouched] = useState(false);

  const [itemsTouched, setItemsTouched] = useState([
    {
      id: 1,
      name: false,
      quantity: false,
      price: false,
    },
  ]);

  const handleBlur = (field, index) => {
    setItemsTouched((prevItemsTouched) => {
      const updatedItemsTouched = [...prevItemsTouched];
      updatedItemsTouched[index] = {
        ...updatedItemsTouched[index],
        [field]: true,
      };
      return updatedItemsTouched;
    });
  };

  const handleModalOpen = (e) => {
    setIsModalOpen(!isModalOpen);
    e.preventDefault();
  };

  const [errors, setErrors] = useState({});

  const validatePaymentTerms = (paymentTerms) => {
    let errors = {};

    if (!paymentTerms) {
      errors.paymentTerms = "can't be empty";
    }

    return errors;
  };

  const validateForm = (invoice) => {
    let errors = {};

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|pl|org|net|edu|gov|mil|biz|info|mobi|name|aero|asia|jobs|museum)$/;
    const paymentTermsErrors = validatePaymentTerms(invoice.paymentTerms);
    errors.items = invoice.items.map((item) => {
      const itemErrors = {};

      if (!item.name || item.name.length < 5) {
        itemErrors.name = 'At least 5 characters.';
      }

      if (item.quantity <= 0) {
        itemErrors.quantity = 'Amount must be greater than 0.';
      }

      if (item.price <= 0) {
        itemErrors.price = 'Price must be greater than 0.';
      }

      return itemErrors;
    });

    if (!/\d/.test(invoice.senderAddress.street)) {
      errors.senderAddress = {
        ...errors.senderAddress,
        street: 'Sender street needs to include at least one number.',
      };
    }
    if (!/\d/.test(invoice.clientAddress.street)) {
      errors.clientAddress = {
        ...errors.clientAddress,
        street: 'Client street needs to include at least one number.',
      };
    }

    if (!invoice.senderAddress.country || invoice.senderAddress.country.length < 2) {
      errors.senderAddress = {
        ...errors.senderAddress,
        country: 'Country must include at least 2 characters.',
      };
    }

    if (!/^([a-zA-Z\s]{3,})$/.test(invoice.senderAddress.city)) {
      errors.senderAddress = {
        ...errors.senderAddress,
        city: 'include at least 3 characters and no numbers.',
      };
    }
    if (!/^([a-zA-Z\s]{3,})$/.test(invoice.clientAddress.city)) {
      errors.clientAddress = {
        ...errors.clientAddress,
        city: 'City must include at least 3 characters and no numbers.',
      };
    }

    if (!invoice.senderAddress.postCode || invoice.senderAddress.postCode.length !== 6) {
      errors.senderAddress = {
        ...errors.senderAddress,
        postCode: 'Must include 6 characters.',
      };
    }

    if (!invoice.clientAddress.postCode || invoice.clientAddress.postCode.length !== 6) {
      errors.clientAddress = {
        ...errors.clientAddress,
        postCode: 'Must include 6 characters.',
      };
    }

    if (!invoice.description || invoice.description.length < 8) {
      errors.projectDescription = 'Must include 8 characters.';
    }

    if (!/^[a-zA-Z]+\s+[a-zA-Z]+$/.test(invoice.clientName)) {
      errors.clientName = 'Client name must include a first name and a last name separated by a space.';
    }

    if (!emailRegex.test(invoice.clientEmail)) {
      errors.clientEmail = 'Client email must contain "@" and a valid domain (e.g., ".com" or ".pl").';
    }

    if (!invoice.clientAddress.country || invoice.clientAddress.country.length < 2) {
      errors.clientAddress = {
        ...errors.clientAddress,
        country: 'Country must include at least 2 characters.',
      };
    }

    if (Object.keys(paymentTermsErrors).length > 0) {
      errors = {
        ...errors,
        ...paymentTermsErrors,
      };
    }

    errors.items = errors.items.filter((itemErrors) => Object.keys(itemErrors).length > 0);
    if (errors.items.length === 0) {
      delete errors.items;
    }

    return errors;
  };

  // FUNCTIONS FOR INPUT CHANGES
  const handleSenderAddressChange = (field, value) => {
    setSenderAddress((prevAddress) => ({ ...prevAddress, [field]: value }));
  };

  const handleClientAddressChange = (field, value) => {
    setClientAddress((prevAdress) => ({ ...prevAdress, [field]: value }));
  };

  const handlePostCodeChange = (inputValue, type) => {
    const maxLength = 10;

    let formattedPostCode = inputValue;

    if (formattedPostCode.length <= maxLength) {
      if (type === 'senderPostcode') {
        setSenderAddress({
          ...senderAddress,
          postCode: formattedPostCode,
        });
      } else if (type === 'clientPostcode') {
        setClientAddress({
          ...clientAddress,
          postCode: formattedPostCode,
        });
      }
    }
  };

  const handleDateChange = (date) => {
    setCreatedAt(format(date, 'yyyy-MM-dd'));
  };

  const handleDaysChange = (e) => {
    setPaymentTerms(parseInt(e.target.value));
    setIsModalOpen(!isModalOpen);
  };

  const handleItemsChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    newItems[index].total = newItems[index].quantity * newItems[index].price;

    setItems(newItems);
    calculateTotal(newItems);
  };

  const addItem = () => {
    const newItem = {
      id: items.length + 1,
      name: '',
      quantity: 0,
      price: 0,
      total: 0,
    };

    setItems([...items, newItem]);
    setItemsTouched((prevItemsTouched) => [
      ...prevItemsTouched,
      {
        id: items.length + 1,
        name: false,
        quantity: false,
        price: false,
      },
    ]);
  };

  const removeItem = (index) => {
    const newItems = items.filter((item, i) => i !== index);
    setItems(newItems);
    calculateTotal(newItems);
  };

  const calculateTotal = (newItems) => {
    const totalValue = newItems.reduce((acc, item) => acc + item.total, 0);
    setTotal(totalValue);
  };

  const onSaveDraft = (invoice) => {
    const draftInvoice = { ...invoice, status: 'draft' };
    onAddInvoice(draftInvoice);
    navigate(-1);
    onCloseModal();
  };

  const editedInvoice = invoiceToEdit || (invoicesList ? invoicesList.find((invoice) => invoice.id === id) : undefined);

  useEffect(() => {
    if (mode === 'edit' && editedInvoice) {
      setClientName(editedInvoice.clientName);
      setClientEmail(editedInvoice.clientEmail);
      setCreatedAt(editedInvoice.createdAt);
      setPaymentTerms(editedInvoice.paymentTerms);
      setSenderAddress(editedInvoice.senderAddress);
      setClientAddress(editedInvoice.clientAddress);
      setItems(editedInvoice.items);
      setDescription(editedInvoice.description);
      setStatus(editedInvoice.status);
      setTotal(editedInvoice.total);
    }
  }, [mode, editedInvoice]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formErrors = validateForm(newInvoice);
    setErrors(formErrors);

    if (Object.keys(formErrors).length === 0) {
      if (mode === 'new') {
        onAddInvoice(newInvoice);
        if (isTablet) {
          onCloseModal();
        } else {
          navigate(-1);
        }
      } else if (mode === 'edit') {
        const updatedInvoice = invoiceToEdit ? { ...newInvoice, id: invoiceToEdit.id } : newInvoice;
        handleEditInvoice(updatedInvoice);
        if (isTablet) {
          onCloseModal();
        } else {
          navigate(-1);
        }
      }
    } else {
      console.log('Form validation errors:', formErrors);
    }
  };

  return (
    <>
      {!isTablet && <BackButton />}
      <div className={isTablet ? 'modal-background' : 'container'}>
        {mode === 'edit' && !isTablet ? (
          <div className="invoice-form__mode-display">
            <h2>Edit</h2>
            <span className="invoice-item__prefix invoice-form__prefix">#</span>
            <h2>{id}</h2>
          </div>
        ) : (
          mode === 'new' &&
          !isTablet && (
            <div className="invoice-form__mode-display">
              <h2>New Invoice</h2>
              <span className="invoice-item__prefix invoice-form__prefix">#</span>
              <h2>{newInvoice.id}</h2>
            </div>
          )
        )}
        <div className="form-container">
          <div className="modal-content">
            {mode === 'edit' && isTablet ? (
              <div className="invoice-form__mode-display">
                <h2>Edit</h2>
                <span className="invoice-item__prefix invoice-form__prefix">#</span>
                <h2>{invoiceToEdit.id}</h2>
              </div>
            ) : (
              mode === 'new' &&
              isTablet && (
                <div className="invoice-form__mode-display">
                  <h2>New Invoice</h2>
                  <span className="invoice-item__prefix invoice-form__prefix">#</span>
                  <h2>{invoiceID}</h2>
                </div>
              )
            )}
            <form className="invoice-form" id="invoice-form" onSubmit={handleSubmit}>
              <h3 className="invoice-form__heading">Bill From</h3>
              <div className="invoice-form__adress">
                <label htmlFor="sender-city">
                  Street Address
                  {senderAddressTouched.street && !senderAddress.street ? (
                    <p className="error">can't be empty</p>
                  ) : (
                    errors.senderAddress && errors.senderAddress.street && <p className="error">{errors.senderAddress.street}</p>
                  )}
                  <input
                    className={`invoice-form__adress-street ${senderAddressTouched.street && !senderAddress.street ? 'input-error' : ''}`}
                    id="sender-city"
                    type="text"
                    onBlur={() => setSenderAddressTouched((prev) => ({ ...prev, street: true }))}
                    value={senderAddress.street}
                    onChange={(e) => handleSenderAddressChange('street', e.target.value)}
                  />
                </label>
                <div className="city-postcode">
                  <label className="invoice-form__adress-city" htmlFor="sender-city">
                    City
                    {senderAddressTouched.city && !senderAddress.city ? (
                      <p className="error">can't be empty</p>
                    ) : (
                      errors.senderAddress && errors.senderAddress.city && <p className="error">{errors.senderAddress.city}</p>
                    )}
                    <input
                      className={senderAddressTouched.city && !senderAddress.city ? 'input-error' : ''}
                      type="text"
                      id="sender-city"
                      onBlur={() => setSenderAddressTouched((prev) => ({ ...prev, city: true }))}
                      value={senderAddress.city}
                      onChange={(e) => handleSenderAddressChange('city', e.target.value)}
                    />
                  </label>
                  <label className="invoice-form__adress-code" htmlFor="sender-postcode">
                    Post Code
                    {senderAddressTouched.postCode && !senderAddress.postCode ? (
                      <p className="error">can't be empty</p>
                    ) : (
                      errors.senderAddress && errors.senderAddress.postCode && <p className="error">{errors.senderAddress.postCode}</p>
                    )}
                    <input
                      type="text"
                      className={senderAddressTouched.postCode && !senderAddress.postCode ? 'input-error' : ''}
                      id="sender-postcode"
                      onBlur={() => setSenderAddressTouched((prev) => ({ ...prev, postCode: true }))}
                      maxLength="6"
                      value={senderAddress.postCode}
                      onChange={(e) => handlePostCodeChange(e.target.value, 'senderPostcode')}
                    />
                  </label>
                </div>
                <label htmlFor="sender-country">
                  Country
                  {senderAddressTouched.country && !senderAddress.country ? (
                    <p className="error">can't be empty</p>
                  ) : (
                    errors.senderAddress && errors.senderAddress.country && <p className="error">{errors.senderAddress.country}</p>
                  )}
                  <input
                    id="sender-country"
                    className={senderAddressTouched.country && !senderAddress.country ? 'input-error' : ''}
                    type="text"
                    onBlur={() => setSenderAddressTouched((prev) => ({ ...prev, country: true }))}
                    value={senderAddress.country}
                    onChange={(e) => handleSenderAddressChange('country', e.target.value)}
                  />
                </label>
              </div>
              <div className="invoice-form__recipient">
                <h3 className="invoice-form__heading">Bill To</h3>
                <label htmlFor="client-name">
                  Client's Name
                  {clientNameTouched && !clientName ? <p className="error">can't be empty</p> : errors.clientName && <p className="error">{errors.clientName}</p>}
                  <input
                    id="client-name"
                    className={clientNameTouched && !clientName ? 'input-error' : ''}
                    type="text"
                    value={clientName}
                    onBlur={() => setClientNameTouched(true)}
                    onChange={(e) => setClientName(e.target.value)}
                  />
                </label>
                <label htmlFor="client-email">
                  Client's Email
                  {clientEmailTouched && !clientEmail ? <p className="error">can't be empty</p> : errors.clientEmail && <p className="error">{errors.clientEmail}</p>}
                  <input
                    id="client-email"
                    type="text"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    onBlur={() => setClientEmailTouched(true)}
                    className={clientEmailTouched && !clientEmail ? 'input-error' : ''}
                  />
                </label>
                <label htmlFor="client-street">
                  Street Address
                  {clientAddressTouched.street && !clientAddress.street ? (
                    <p className="error">can't be empty</p>
                  ) : (
                    errors.clientAddress && errors.clientAddress.street && <p className="error">{errors.clientAddress.street}</p>
                  )}
                  <input
                    id="client-street"
                    className={clientAddressTouched.street && !clientAddress.street ? 'input-error' : ''}
                    type="text"
                    value={clientAddress.street}
                    onBlur={() => setClientAddressTouched((prev) => ({ ...prev, street: true }))}
                    onChange={(e) => handleClientAddressChange('street', e.target.value)}
                  />
                </label>
                <div className="city-postcode">
                  <label htmlFor="client-city">
                    City
                    {clientAddressTouched.city && !clientAddress.city ? (
                      <p className="error">can't be empty</p>
                    ) : (
                      errors.clientAddress && errors.clientAddress.city && <p className="error">{errors.clientAddress.city}</p>
                    )}
                    <input
                      type="text"
                      className={clientAddressTouched.city && !clientAddress.city ? 'input-error' : ''}
                      id="client-city"
                      onBlur={() => setClientAddressTouched((prev) => ({ ...prev, city: true }))}
                      value={clientAddress.city}
                      onChange={(e) => handleClientAddressChange('city', e.target.value)}
                    />
                  </label>
                  <label htmlFor="client-postcode">
                    Post Code
                    {clientAddressTouched.postCode && !clientAddress.postCode ? (
                      <p className="error">can't be empty</p>
                    ) : (
                      errors.clientAddress && errors.clientAddress.postCode && <p className="error">{errors.clientAddress.postCode}</p>
                    )}
                    <input
                      className={clientAddressTouched.postCode && !clientAddress.postCode ? 'input-error' : ''}
                      type="text"
                      id="client-postcode"
                      maxLength="6"
                      value={clientAddress.postCode}
                      onBlur={() => setClientAddressTouched((prev) => ({ ...prev, postCode: true }))}
                      onChange={(e) => handlePostCodeChange(e.target.value, 'clientPostcode')}
                    />
                  </label>
                </div>
                <label htmlFor="client-country">
                  Country
                  {clientAddressTouched.country && !clientAddress.country ? (
                    <p className="error">can't be empty</p>
                  ) : (
                    errors.clientAddress && errors.clientAddress.country && <p className="error">{errors.clientAddress.country}</p>
                  )}
                  <input
                    id="client-country"
                    className={clientAddressTouched.country && !clientAddress.country ? 'input-error' : ''}
                    type="text"
                    value={clientAddress.country}
                    onBlur={() => setClientAddressTouched((prev) => ({ ...prev, country: true }))}
                    onChange={(e) => handleClientAddressChange('country', e.target.value)}
                  />
                </label>
              </div>
              <label onClick={(e) => e.preventDefault()} className="calendar-label" htmlFor="date-picker">
                Invoice Date
                <DatePicker id="date-picker" tabIndex="0" selected={createdAt ? new Date(createdAt) : null} onChange={(date) => handleDateChange(date)} dateFormat="dd MMM yyyy" />
                <img src={Calendar} alt="calendar icon" />
              </label>
              <label htmlFor="payment-terms">
                Payment terms
                {(paymentTermsTouched && !paymentTerms) || errors.paymentTerms ? <p className="error">can't be empty</p> : null}
                <div
                  id="payment-terms"
                  tabIndex="0"
                  onBlur={() => setPaymentTermsTouched(true)}
                  className={`invoice-form__payment-terms ${paymentTermsTouched && !paymentTerms ? 'input-error' : ''}`}
                >
                  <p>{!paymentTerms ? 'Choose an option' : paymentTerms + (paymentTerms === 1 ? ' Day' : ' Days')} </p>
                  <button onClick={handleModalOpen}>
                    <svg width="11" height="7" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 1l4.228 4.228L9.456 1" stroke="#7C5DFA" strokeWidth="2" fill="none" fillRule="evenodd" />
                    </svg>
                  </button>
                  {isModalOpen && (
                    <div className="modal">
                      <div className="modal-body">
                        <label htmlFor="1day">
                          <input id="1day" className="modal-input__checkbox" type="checkbox" checked={paymentTerms === 1} value="1" onChange={handleDaysChange} />1 Day
                        </label>
                        <label htmlFor="7days">
                          <input id="7days" className="modal-input__checkbox" type="checkbox" value="7" checked={paymentTerms === 7} onChange={handleDaysChange} />7 Days
                        </label>
                        <label htmlFor="14days">
                          <input id="14days" className="modal-input__checkbox" type="checkbox" value="14" checked={paymentTerms === 14} onChange={handleDaysChange} />
                          14 Days
                        </label>
                        <label htmlFor="30days">
                          <input id="30days" className="modal-input__checkbox" type="checkbox" value="30" checked={paymentTerms === 30} onChange={handleDaysChange} />
                          30 Days
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </label>
              <label htmlFor="project-description">
                Project Description
                {projectDescriptionTouched && !description ? (
                  <p className="error">can't be empty</p>
                ) : (
                  errors.projectDescription && <p className="error">{errors.projectDescription}</p>
                )}
                <input
                  className={projectDescriptionTouched && !description ? 'input-error' : ''}
                  onBlur={() => setProjectDescriptionTouched(true)}
                  id="project-description"
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </label>
              <div>
                {items.map((item, index) => (
                  <div key={`${item.id}-${index}`} className="invoice-form__item-grid">
                    <label htmlFor="item-name">
                      Item name
                      {itemsTouched[index]?.name && !item.name ? (
                        <p className="error">can't be empty</p>
                      ) : (
                        errors.items && errors.items[index]?.name && <p className="error">{errors.items[index].name}</p>
                      )}
                      <input
                        id="item-name"
                        type="text"
                        className={`invoice-form__item-name${itemsTouched[index]?.name && !item.name ? ' input-error' : ''}`}
                        value={item.name}
                        onChange={(e) => handleItemsChange(index, 'name', e.target.value)}
                        onBlur={() => handleBlur('name', index)}
                      />
                    </label>
                    <label htmlFor="item-qty">
                      Amount
                      {itemsTouched[index]?.quantity && !item.quantity ? (
                        <p className="error">can't be empty</p>
                      ) : (
                        errors.items && errors.items[index]?.quantity && <p className="error">{errors.items[index].quantity}</p>
                      )}
                      <input
                        type="number"
                        id="itemy-qty"
                        className={`invoice-form__item-quantity${itemsTouched[index]?.quantity && !item.quantity ? ' input-error' : ''}`}
                        value={item.quantity}
                        onChange={(e) => handleItemsChange(index, 'quantity', parseInt(e.target.value))}
                        onBlur={() => handleBlur('quantity', index)}
                      />
                    </label>
                    <label htmlFor="item-price">
                      Price
                      {itemsTouched[index]?.price && !item.price ? (
                        <p className="error">can't be empty</p>
                      ) : (
                        errors.items && errors.items[index]?.price && <p className="error">{errors.items[index].price}</p>
                      )}
                      <input
                        id="item-price"
                        type="number"
                        className={`invoice-form__item-price${itemsTouched[index]?.price && !item.price ? ' input-error' : ''}`}
                        value={item.price}
                        onChange={(e) => handleItemsChange(index, 'price', parseFloat(e.target.value))}
                        onBlur={() => handleBlur('price', index)}
                      />
                    </label>
                    <label htmlFor="item-total">
                      Total
                      <div className="invoice-form__item-total" tabIndex="0" id="item-total" aria-labelledby="item-total">
                        <p>{isNaN(item.total) ? (item.total === 0 ? '0' : '') : item.total}</p>
                      </div>
                    </label>
                    <button className="invoice-form__item-delete" onClick={() => removeItem(index)}>
                      <svg width="13" height="16" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M11.583 3.556v10.666c0 .982-.795 1.778-1.777 1.778H2.694a1.777 1.777 0 01-1.777-1.778V3.556h10.666zM8.473 0l.888.889h3.111v1.778H.028V.889h3.11L4.029 0h4.444z"
                          fill="#888EB0"
                          fillRule="nonzero"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
                <button className="invoice-form__item-add" onClick={addItem} disabled={items.some((item) => !item.name || !item.quantity || !item.price)}>
                  + Add New Item
                </button>
              </div>
            </form>
          </div>
          {isTablet && (
            <div className="modal-form__buttons">
              {mode === 'edit' ? (
                <>
                  <button className="cancel-button" onClick={isTablet ? onCloseModal : () => navigate(-1)}>
                    Cancel
                  </button>
                  <button className="save-button" type="submit" form="invoice-form" onClick={handleSubmit}>
                    Save Changes
                  </button>
                </>
              ) : (
                <>
                  <button className="cancel-button" onClick={isTablet ? onCloseModal : () => navigate(-1)}>
                    Discard
                  </button>
                  <button className="draft-button" onClick={() => onSaveDraft(newInvoice)}>
                    Save as Draft
                  </button>
                  <button className="save-button" type="submit" form="invoice-form">
                    Save & Send
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="invoice-form__buttons">
        {mode === 'edit' ? (
          <>
            <button className="cancel-button" onClick={isTablet ? onCloseModal : () => navigate(-1)}>
              Cancel
            </button>
            <button className="save-button" type="submit" form="invoice-form" onClick={handleSubmit}>
              Save Changes
            </button>
          </>
        ) : (
          <>
            <button className="cancel-button" onClick={isTablet ? onCloseModal : () => navigate(-1)}>
              Discard
            </button>
            <button className="draft-button" onClick={() => onSaveDraft(newInvoice)}>
              Save as Draft
            </button>
            <button className="save-button" type="submit" form="invoice-form">
              Save & Send
            </button>
          </>
        )}
      </div>
    </>
  );
}
