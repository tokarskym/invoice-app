import { createContext, useEffect, useState } from 'react';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  h1, h2, h3, h4, div.modal-body label, div.back-button button {
    color: ${({ theme }) => theme.headingColor};
  }

  p {
    color: ${({ theme }) => theme.paragraphColor};
  }

  body { 
    background-color: ${({ theme }) => theme.bodyColor}; 
  }

  div.modal, div.delete-modal__content {
    background-color: ${({ theme }) => theme.modalColor};
    border: ${({ theme }) => theme.modalBorder}; 
  }

  div.invoice-item, 
  .invoice-details__status, 
  .invoice-details__info {
  background-color: ${({ theme }) => theme.invoiceItemColor}; 
  }

  .modal-input__checkbox:before {
    background-color: ${({ theme }) => theme.modalCheckboxColor}; 
  }

  .invoice-details__info-items {
    background-color: ${({ theme }) => theme.infoItemsBackground}; 
  }

  .invoice-details__info-total {
    background-color: ${({ theme }) => theme.infoItemsTotalBackground}; 
  }

  div.invoice-details__info-total h2.info-total {
    color: ${({ theme }) => theme.infoItemsTotal}; 
  }

  .invoice-details__buttons, 
  .invoice-form__buttons {
    background-color: ${({ theme }) => theme.modalColor}; 
  }

  a.edit-button {
    background-color: ${({ theme }) => theme.editButton}; 
  }

  .invoice-form input, 
  div.invoice-form__payment-terms {
    background-color: ${({ theme }) => theme.invoiceInputBackground}; 
    border: ${({ theme }) => theme.invoiceInputBorder}; 
    color: ${({ theme }) => theme.invoiceInputColor}; 
  }

  div.invoice-form__payment-terms p {
  color: ${({ theme }) => theme.invoiceInputColor}; 
  }

  button.cancel-button,
  .invoice-form__item-add  {
    background-color: ${({ theme }) => theme.buttonsBackgroundAddCancel}; 
    color: ${({ theme }) => theme.buttonsColorAddCancel}; 
  }

  .invoice-form label {
    color: ${({ theme }) => theme.invoiceFormLabelColor}; 
  }

  .modal-body, 
  .delete-modal__content {
    box-shadow: ${({ theme }) => theme.modalBoxShadow}; 
  }

  .react-datepicker__month-container {
    background-color: ${({ theme }) => theme.calendarBackgroundColor}; 
    box-shadow: ${({ theme }) => theme.modalBoxShadow}; 
  }
  div.react-datepicker__month div.react-datepicker__week div.react-datepicker__day, 
  div.react-datepicker__month-container div.react-datepicker__header .react-datepicker__current-month {
    color: ${({ theme }) => theme.calendarDaysColor}; 
  }

`;

const themes = {
  dark: {
    headingColor: '#FFFF',
    paragraphColor: '#DFE3FA',
    invoiceItemColor: '#1E2139',
    draftColor: '#dfe3fa',
    bodyColor: '#141625',
    modalColor: '#1e2139',
    modalBorder: '1px solid #252945',
    modalCheckboxColor: '#1e2139',
    infoItemsBackground: '#252945;',
    infoItemsTotalBackground: '#0c0e16',
    infoItemsTotal: '#FFFFFF',
    editButton: '#252945;',
    invoiceInputBackground: '#1e2139',
    invoiceInputColor: '#FFFFFF',
    invoiceInputBorder: '1px solid #252945',
    buttonsBackgroundAddCancel: '#252945',
    buttonsColorAddCancel: '#DFE3FA',
    invoiceFormLabelColor: '#888EB0',
    calendarBackgroundColor: '#1D1F35',
    calendarDaysColor: '#dfe3fa',
  },

  light: {
    headingColor: '#0C0E16',
    paragraphColor: '#888EB0',
    invoiceItemColor: '#FFFF',
    draftColor: '#373B53',
    bodyColor: '#F8F8FB',
    modalColor: '#FFFFFF',
    modalBorder: 'none',
    modalCheckboxColor: '#DFE3FA',
    infoItemsBackground: '#F9FAFE',
    infoItemsTotalBackground: '#373B53',
    infoItemsTotal: '#FFFFFF',
    editButton: '#F9FAFE',
    invoiceInputBackground: '#FFFFFF',
    invoiceInputColor: '#0C0E16',
    invoiceInputBorder: '1px solid #DFE3FA',
    buttonsBackgroundAddCancel: '#EEEFF4',
    buttonsColorAddCancel: '#7E88C3',
    invoiceFormLabelColor: '#7E88C3',
    modalBoxShadow: '0px 10px 20px 0px rgba(72, 84, 159, 0.25)',
    calendarBackgroundColor: '#FFFFFF',
    calendarDaysColor: '#0C0E16',
  },
};

export const ThemeContext = createContext();

export default function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const theme = isDarkMode ? themes.dark : themes.light;

  function toggleTheme() {
    localStorage.setItem('isDarkMode', JSON.stringify(!isDarkMode));
    setIsDarkMode(!isDarkMode);
  }

  useEffect(() => {
    const isDarkMode = localStorage.getItem('isDarkMode') === 'true';
    setIsDarkMode(isDarkMode);
  }, []);

  return (
    <ThemeContext.Provider value={[{ theme, isDarkMode }, toggleTheme]}>
      <GlobalStyle theme={theme} />
      {children}
    </ThemeContext.Provider>
  );
}
