import React from 'react';
import { User, Clock, Star, FileText } from 'lucide-react';

interface SidebarProps {
  session: any;
  recentInvoices: any[];
}

export default function Sidebar({ session, recentInvoices }: SidebarProps) {
  if (!session) return null;

  return (
    <aside className="hidden lg:block w-64 bg-gray-50 border-r border-gray-200 h-[calc(100vh-4rem)] p-6">
      {/* User Info */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-blue-600 text-white p-3 rounded-full">
            <User className="w-6 h-6" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{session.user.email}</p>
            <p className="text-sm text-gray-500">Usuario Pro</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h3 className="text-sm font-medium text-gray-500 mb-4">ACCIONES RÁPIDAS</h3>
        <div className="space-y-2">
          <button className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <FileText className="w-5 h-5 mr-3" />
            Nueva Factura
          </button>
          <button className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <Star className="w-5 h-5 mr-3" />
            Favoritos
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-4">ACTIVIDAD RECIENTE</h3>
        <div className="space-y-3">
          {recentInvoices.slice(0, 5).map((invoice) => (
            <div key={invoice.id} className="flex items-center space-x-3">
              <Clock className="w-4 h-4 text-gray-400" />
              <div className="text-sm">
                <p className="text-gray-700">{invoice.invoice_number}</p>
                <p className="text-gray-500">{new Date(invoice.date).toLocaleDateString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}