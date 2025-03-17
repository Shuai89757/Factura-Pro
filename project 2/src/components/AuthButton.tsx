import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { LogIn, UserPlus, LogOut } from 'lucide-react';

interface AuthButtonProps {
  session: any;
}

export default function AuthButton({ session }: AuthButtonProps) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
      }
      setShowAuthModal(false);
      setEmail('');
      setPassword('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ha ocurrido un error');
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleModalClose = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setShowAuthModal(false);
      setEmail('');
      setPassword('');
      setError(null);
    }
  };

  if (session) {
    return (
      <button
        onClick={handleSignOut}
        className="flex items-center px-4 py-2 text-sm bg-blue-800 hover:bg-blue-700 text-white rounded-lg transition-colors"
      >
        <LogOut className="w-4 h-4 mr-2" />
        Cerrar Sesión
      </button>
    );
  }

  return (
    <>
      <button
        onClick={() => {
          setMode('login');
          setShowAuthModal(true);
        }}
        className="flex items-center px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
      >
        <LogIn className="w-4 h-4 mr-2" />
        Iniciar Sesión
      </button>

      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" onClick={handleModalClose}>
          <div className="bg-white rounded-lg max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-xl font-semibold mb-4">
              {mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </h2>

            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-white text-gray-900 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="ejemplo@correo.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-white text-gray-900 rounded-md border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="••••••••"
                  required
                />
              </div>

              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-2 rounded">{error}</div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAuthModal(false);
                    setEmail('');
                    setPassword('');
                    setError(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                >
                  {mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
                </button>
              </div>

              <div className="text-center text-sm">
                {mode === 'login' ? (
                  <button
                    type="button"
                    onClick={() => setMode('register')}
                    className="text-blue-600 hover:text-blue-500 transition-colors"
                  >
                    ¿No tienes una cuenta? Regístrate
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="text-blue-600 hover:text-blue-500 transition-colors"
                  >
                    ¿Ya tienes una cuenta? Inicia sesión
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}