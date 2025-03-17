import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Invoice } from '../lib/supabase';
import { FileText, Trash2, Copy } from 'lucide-react';

interface InvoiceListProps {
  onCopy: (invoice: Invoice) => void;
}

export default function InvoiceList({ onCopy }: InvoiceListProps) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvoices(data as Invoice[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las facturas');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar esta factura?')) return;

    try {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setInvoices(invoices.filter(inv => inv.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar la factura');
    }
  };

  if (loading) return <div className="text-center py-4">Cargando facturas...</div>;
  if (error) return <div className="text-red-600 py-4">{error}</div>;

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Historial de Facturas
        </h3>
      </div>
      <div className="border-t border-gray-200">
        <ul className="divide-y divide-gray-200">
          {invoices.length === 0 ? (
            <li className="px-4 py-5 sm:px-6 text-gray-500 text-center">
              No hay facturas guardadas
            </li>
          ) : (
            invoices.map((invoice) => (
              <li key={invoice.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 text-gray-400" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {invoice.invoice_number}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(invoice.date).toLocaleDateString('es-ES')} - {invoice.client_data.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => onCopy(invoice)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Copiar factura"
                    >
                      <Copy className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(invoice.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Eliminar factura"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}