import React from 'react';
import { FileText, Home, Settings, History } from 'lucide-react';
import AuthButton from './AuthButton';

interface NavigationProps {
  session: any;
}

export default function Navigation({ session }: NavigationProps) {
  return (
    <nav className="bg-blue-900 text-white py-4 px-6 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-8">
          {/* Logo and Site Name */}
          <div className="flex items-center">
            <FileText className="w-8 h-8 mr-3" />
            <h1 className="text-2xl font-bold">Factura Pro</h1>
          </div>

          {/* Navigation Menu */}
          {session && (
            <div className="hidden md:flex items-center space-x-6">
              <a href="#" className="flex items-center hover:text-blue-200 transition-colors">
                <Home className="w-5 h-5 mr-2" />
                Inicio
              </a>
              <a href="#" className="flex items-center hover:text-blue-200 transition-colors">
                <History className="w-5 h-5 mr-2" />
                Historial
              </a>
              <a href="#" className="flex items-center hover:text-blue-200 transition-colors">
                <Settings className="w-5 h-5 mr-2" />
                Configuración
              </a>
            </div>
          )}
        </div>

        {/* Auth Button */}
        <AuthButton session={session} />
      </div>
    </nav>
  );
}