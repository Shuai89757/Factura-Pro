import React from 'react';
import { Plus, Minus, Users, Package } from 'lucide-react';
import { getPreTaxPrice } from '../utils/calculations';

interface InvoiceFormProps {
  data: any;
  onChange: (data: any) => void;
  onShowClients: () => void;
  onShowProducts: () => void;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ data, onChange, onShowClients, onShowProducts }) => {
  const handleIssuerChange = (field: string, value: string) => {
    onChange({
      ...data,
      issuer: { ...data.issuer, [field]: value }
    });
  };

  const handleClientChange = (field: string, value: string) => {
    onChange({
      ...data,
      client: { ...data.client, [field]: value }
    });
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...data.items];
    newItems[index] = { ...newItems[index], [field]: value };
    onChange({ ...data, items: newItems });
  };

  const addItem = () => {
    onChange({
      ...data,
      items: [...data.items, { description: '', quantity: 1, price: 0 }]
    });
  };

  const removeItem = (index: number) => {
    if (data.items.length > 1) {
      const newItems = data.items.filter((_: any, i: number) => i !== index);
      onChange({ ...data, items: newItems });
    }
  };

  return (
    <div className="space-y-8">
      {/* Invoice Details */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Detalles de la Factura</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Número de Factura</label>
            <input
              type="text"
              value={data.invoiceNumber}
              onChange={(e) => onChange({ ...data, invoiceNumber: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="FAC-2024-001"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Fecha</label>
            <input
              type="date"
              value={data.date}
              onChange={(e) => onChange({ ...data, date: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </section>

      {/* Issuer Information */}
      <section>
        <h3 className="text-lg font-semibold mb-4">Información del Emisor</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre de la Empresa</label>
            <input
              type="text"
              value={data.issuer.name}
              onChange={(e) => handleIssuerChange('name', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Empresa S.L."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">NIF/CIF</label>
            <input
              type="text"
              value={data.issuer.taxId}
              onChange={(e) => handleIssuerChange('taxId', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="B12345678"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Dirección</label>
            <input
              type="text"
              value={data.issuer.address}
              onChange={(e) => handleIssuerChange('address', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Calle Example 123, 28001 Madrid"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Contacto</label>
            <input
              type="text"
              value={data.issuer.contact}
              onChange={(e) => handleIssuerChange('contact', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Tel: +34 912345678 | Email: contacto@empresa.es"
            />
          </div>
        </div>
      </section>

      {/* Client Information */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Información del Cliente</h3>
          <button
            onClick={onShowClients}
            className="flex items-center px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
          >
            <Users className="w-4 h-4 mr-1" />
            Seleccionar Cliente
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre/Empresa</label>
            <input
              type="text"
              value={data.client.name}
              onChange={(e) => handleClientChange('name', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Cliente S.L."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">NIF/CIF</label>
            <input
              type="text"
              value={data.client.taxId}
              onChange={(e) => handleClientChange('taxId', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="A87654321"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Dirección</label>
            <input
              type="text"
              value={data.client.address}
              onChange={(e) => handleClientChange('address', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Avenida Cliente 456, 28002 Madrid"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Contacto</label>
            <input
              type="text"
              value={data.client.contact}
              onChange={(e) => handleClientChange('contact', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Tel: +34 913456789 | Email: info@cliente.es"
            />
          </div>
        </div>
      </section>

      {/* Items */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Conceptos</h3>
          <button
            onClick={onShowProducts}
            className="flex items-center px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100"
          >
            <Package className="w-4 h-4 mr-1" />
            Seleccionar Producto
          </button>
        </div>
        {data.items.map((item: any, index: number) => (
          <div key={index} className="grid grid-cols-12 gap-4 mb-4">
            <div className="col-span-6">
              <label className="block text-sm font-medium text-gray-700">Descripción</label>
              <input
                type="text"
                value={item.description}
                onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Servicio/Producto"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Cantidad</label>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                min="1"
              />
            </div>
            <div className="col-span-3">
              <label className="block text-sm font-medium text-gray-700">Precio con IVA (€)</label>
              <input
                type="number"
                value={item.price}
                onChange={(e) => handleItemChange(index, 'price', Number(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                min="0"
                step="0.01"
              />
              <span className="text-xs text-gray-500 mt-1 block">
                Base: {getPreTaxPrice(item.price, data.taxRate).toFixed(2)} €
              </span>
            </div>
            <div className="col-span-1 flex items-end justify-center">
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="mb-1 p-2 text-red-600 hover:text-red-800"
                disabled={data.items.length === 1}
              >
                <Minus className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addItem}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <Plus className="w-5 h-5 mr-1" />
          Añadir concepto
        </button>
      </section>

      {/* Tax Rate */}
      <section>
        <div className="w-48">
          <label className="block text-sm font-medium text-gray-700">IVA (%)</label>
          <input
            type="number"
            value={data.taxRate}
            onChange={(e) => onChange({ ...data, taxRate: Number(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            min="0"
            max="100"
            step="1"
          />
        </div>
      </section>
    </div>
  );
};

export default InvoiceForm;