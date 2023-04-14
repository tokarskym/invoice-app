import { useContext } from 'react';
import { ThemeContext } from '../../../Context/Theme';

export default function InvoiceStatus({ invoice }) {
  const [{ theme }] = useContext(ThemeContext);
  return (
    <div className={`invoice-item__status invoice-item__status-${invoice.status}`}>
      <div className={`invoice-item__status-dot--${invoice.status}`} style={{ backgroundColor: invoice.status === 'draft' ? theme.draftColor : '' }}></div>
      <h3 className={`invoice-item__status-${invoice.status}`} style={{ color: invoice.status === 'draft' ? theme.draftColor : '' }}>
        {invoice.status}
      </h3>
    </div>
  );
}
