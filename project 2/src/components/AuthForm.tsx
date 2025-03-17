import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { LogIn, UserPlus, Lock } from 'lucide-react';

type AuthMode = 'login' | 'register' | 'reset';

export default function AuthForm() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } else if (mode === 'register') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setMessage('Registro exitoso. Ya puedes iniciar sesión.');
        setMode('login');
      } else if (mode === 'reset') {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) throw error;
        setMessage('Si existe una cuenta con este correo, recibirás un enlace para restablecer tu contraseña.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ha ocurrido un error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {mode === 'login' ? 'Iniciar Sesión' : 
           mode === 'register' ? 'Crear Cuenta' : 
           'Restablecer Contraseña'}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Correo electrónico
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            {mode !== 'reset' && (
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Contraseña
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}

            {message && (
              <div className="text-green-600 text-sm">{message}</div>
            )}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {mode === 'login' ? (
                  <><LogIn className="w-4 h-4 mr-2" /> Iniciar Sesión</>
                ) : mode === 'register' ? (
                  <><UserPlus className="w-4 h-4 mr-2" /> Registrarse</>
                ) : (
                  <><Lock className="w-4 h-4 mr-2" /> Restablecer Contraseña</>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  {mode === 'login' ? '¿No tienes una cuenta?' : 
                   mode === 'register' ? '¿Ya tienes una cuenta?' :
                   '¿Recordaste tu contraseña?'}
                </span>
              </div>
            </div>

            <div className="mt-6 flex flex-col space-y-2">
              {mode === 'login' && (
                <>
                  <button
                    type="button"
                    onClick={() => setMode('register')}
                    className="text-sm text-blue-600 hover:text-blue-500"
                  >
                    Crear una cuenta nueva
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('reset')}
                    className="text-sm text-blue-600 hover:text-blue-500"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </>
              )}
              {(mode === 'register' || mode === 'reset') && (
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  Volver al inicio de sesión
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}