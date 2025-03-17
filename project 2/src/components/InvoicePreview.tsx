import React from 'react';
import { getPreTaxPrice } from '../utils/calculations';

interface InvoicePreviewProps {
  data: any;
  totals: {
    subtotal: number;
    tax: number;
    total: number;
  };
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({ data, totals }) => {
  return (
    <div className="border rounded-lg p-6 bg-white">
      {/* Header */}
      <div className="mb-8">
        <div className="text-2xl font-bold text-gray-800 mb-2">FACTURA</div>
        <div className="text-gray-500 text-sm space-y-1">
          <div>Nº: {data.invoiceNumber}</div>
          <div>Fecha: {new Date(data.date).toLocaleDateString('es-ES')}</div>
        </div>
      </div>

      {/* Issuer Info */}
      <div className="mb-8">
        <h4 className="font-semibold text-gray-700 mb-2">Datos del Emisor:</h4>
        <div className="text-gray-600">
          <p className="font-medium">{data.issuer.name}</p>
          <p>NIF/CIF: {data.issuer.taxId}</p>
          <p>{data.issuer.address}</p>
          <p>{data.issuer.contact}</p>
        </div>
      </div>

      {/* Client Info */}
      <div className="mb-8">
        <h4 className="font-semibold text-gray-700 mb-2">Datos del Cliente:</h4>
        <div className="text-gray-600">
          <p className="font-medium">{data.client.name}</p>
          <p>NIF/CIF: {data.client.taxId}</p>
          <p>{data.client.address}</p>
          <p>{data.client.contact}</p>
        </div>
      </div>

      {/* Items */}
      <div className="mb-8">
        <h4 className="font-semibold text-gray-700 mb-2">Conceptos:</h4>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Descripción</th>
              <th className="text-right py-2">Cantidad</th>
              <th className="text-right py-2">Base</th>
              <th className="text-right py-2">Total con IVA</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item: any, index: number) => {
              const basePrice = getPreTaxPrice(item.price, data.taxRate);
              return (
                <tr key={index} className="border-b">
                  <td className="py-2">{item.description}</td>
                  <td className="text-right">{item.quantity}</td>
                  <td className="text-right">{basePrice.toFixed(2)} €</td>
                  <td className="text-right">{item.price.toFixed(2)} €</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex flex-col items-end">
        <div className="w-48 space-y-2">
          <div className="flex justify-between">
            <span>Base Imponible:</span>
            <span>{totals.subtotal.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between">
            <span>IVA ({data.taxRate}%):</span>
            <span>{totals.tax.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between font-bold border-t pt-2">
            <span>Total con IVA:</span>
            <span>{totals.total.toFixed(2)} €</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;