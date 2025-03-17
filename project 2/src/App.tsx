import React, { useState, useEffect } from 'react';
import { FileText, Download, RefreshCw } from 'lucide-react';
import { generatePDF } from './utils/pdfGenerator';
import { calculateTotals } from './utils/calculations';
import Navigation from './components/Navigation';
import Sidebar from './components/Sidebar';
import InvoiceForm from './components/InvoiceForm';
import InvoicePreview from './components/InvoicePreview';
import InvoiceList from './components/InvoiceList';
import ClientManager from './components/ClientManager';
import ProductManager from './components/ProductManager';
import { supabase } from './lib/supabase';
import type { Invoice, Client, Product } from './lib/supabase';

function App() {
  const [session, setSession] = useState(null);
  const [showClients, setShowClients] = useState(false);
  const [showProducts, setShowProducts] = useState(false);
  const [recentInvoices, setRecentInvoices] = useState([]);
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: '',
    date: new Date().toISOString().split('T')[0],
    issuer: {
      name: '',
      taxId: '',
      address: '',
      contact: ''
    },
    client: {
      name: '',
      taxId: '',
      address: '',
      contact: ''
    },
    items: [{ description: '', quantity: 1, price: 0 }],
    taxRate: 21,
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      loadRecentInvoices();
    }
  }, [session]);

  const loadRecentInvoices = async () => {
    const { data } = await supabase
      .from('invoices')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (data) {
      setRecentInvoices(data);
    }
  };

  const handleGeneratePDF = async () => {
    generatePDF(invoiceData);

    if (session) {
      try {
        await supabase.from('invoices').insert({
          user_id: session.user.id,
          invoice_number: invoiceData.invoiceNumber,
          date: invoiceData.date,
          issuer_data: invoiceData.issuer,
          client_data: invoiceData.client,
          items: invoiceData.items,
          tax_rate: invoiceData.taxRate
        });
        loadRecentInvoices(); // Refresh recent invoices
      } catch (error) {
        console.error('Error saving invoice:', error);
      }
    }
  };

  const handleReset = () => {
    setInvoiceData({
      invoiceNumber: '',
      date: new Date().toISOString().split('T')[0],
      issuer: { name: '', taxId: '', address: '', contact: '' },
      client: { name: '', taxId: '', address: '', contact: '' },
      items: [{ description: '', quantity: 1, price: 0 }],
      taxRate: 21,
    });
  };

  const handleCopyInvoice = (invoice: Invoice) => {
    setInvoiceData({
      invoiceNumber: '',
      date: new Date().toISOString().split('T')[0],
      issuer: invoice.issuer_data,
      client: invoice.client_data,
      items: invoice.items,
      taxRate: invoice.tax_rate,
    });
  };

  const handleSelectClient = (client: Client) => {
    setInvoiceData({
      ...invoiceData,
      client: {
        name: client.name,
        taxId: client.tax_id,
        address: client.address,
        contact: client.contact
      }
    });
    setShowClients(false);
  };

  const handleSelectProduct = (product: Product) => {
    setInvoiceData({
      ...invoiceData,
      items: [
        ...invoiceData.items,
        {
          description: `${product.name}${product.description ? ` - ${product.description}` : ''}`,
          quantity: 1,
          price: product.price
        }
      ]
    });
    setShowProducts(false);
  };

  const handleModalClose = (e: React.MouseEvent, modalSetter: (show: boolean) => void) => {
    if (e.target === e.currentTarget) {
      modalSetter(false);
    }
  };

  const totals = calculateTotals(invoiceData.items, invoiceData.taxRate);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation session={session} />
      
      <div className="flex">
        <Sidebar session={session} recentInvoices={recentInvoices} />
        
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Form Section */}
              <div className="space-y-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <InvoiceForm
                    data={invoiceData}
                    onChange={setInvoiceData}
                    onShowClients={() => setShowClients(true)}
                    onShowProducts={() => setShowProducts(true)}
                  />
                  
                  {/* Actions */}
                  <div className="mt-8 flex gap-4">
                    <button
                      onClick={handleGeneratePDF}
                      className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Download className="w-5 h-5 mr-2" />
                      Generar PDF
                    </button>
                    
                    <button
                      onClick={handleReset}
                      className="flex items-center px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      <RefreshCw className="w-5 h-5 mr-2" />
                      Reiniciar
                    </button>
                  </div>
                </div>

                {/* Invoice List (only for authenticated users) */}
                {session && <InvoiceList onCopy={handleCopyInvoice} />}
              </div>

              {/* Preview Section */}
              <div className="space-y-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-4">Vista Previa</h2>
                  <InvoicePreview data={invoiceData} totals={totals} />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Client Manager Modal */}
      {showClients && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={(e) => handleModalClose(e, setShowClients)}
        >
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <ClientManager onSelectClient={handleSelectClient} />
          </div>
        </div>
      )}

      {/* Product Manager Modal */}
      {showProducts && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={(e) => handleModalClose(e, setShowProducts)}
        >
          <div className="bg-white rounded-lg max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <ProductManager onSelectProduct={handleSelectProduct} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;