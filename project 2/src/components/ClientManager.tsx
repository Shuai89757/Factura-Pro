import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Client } from '../lib/supabase';
import { Plus, Edit2, Trash2, X, Check, Users } from 'lucide-react';

interface ClientManagerProps {
  onSelectClient: (client: Client) => void;
}

export default function ClientManager({ onSelectClient }: ClientManagerProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    tax_id: '',
    address: '',
    contact: ''
  });

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error loading clients:', error);
      return;
    }

    setClients(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        alert('Por favor, inicie sesión para continuar.');
        return;
      }

      if (editingClient) {
        const { error } = await supabase
          .from('clients')
          .update(formData)
          .eq('id', editingClient.id);

        if (error) throw error;

        setClients(clients.map(c => 
          c.id === editingClient.id ? { ...c, ...formData } : c
        ));
      } else {
        const { data, error } = await supabase
          .from('clients')
          .insert([{ ...formData, user_id: session.user.id }])
          .select();

        if (error) throw error;
        if (data) {
          setClients([...clients, data[0]]);
          onSelectClient(data[0]);
        }
      }

      setIsModalOpen(false);
      setEditingClient(null);
      setFormData({ name: '', tax_id: '', address: '', contact: '' });
    } catch (error) {
      console.error('Error saving client:', error);
      alert('Error al guardar el cliente. Por favor, inténtelo de nuevo.');
    }
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      tax_id: client.tax_id || '',
      address: client.address || '',
      contact: client.contact || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este cliente?')) return;

    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setClients(clients.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting client:', error);
      alert('Error al eliminar el cliente. Por favor, inténtelo de nuevo.');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold flex items-center">
          <Users className="w-5 h-5 mr-2" />
          Clientes
        </h2>
        <button
          onClick={() => {
            setEditingClient(null);
            setFormData({ name: '', tax_id: '', address: '', contact: '' });
            setIsModalOpen(true);
          }}
          className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-1" />
          Nuevo Cliente
        </button>
      </div>

      <div className="grid gap-4">
        {clients.map(client => (
          <div
            key={client.id}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-blue-300 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{client.name}</h3>
                <p className="text-sm text-gray-500">{client.tax_id}</p>
                <p className="text-sm text-gray-500">{client.address}</p>
                <p className="text-sm text-gray-500">{client.contact}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onSelectClient(client)}
                  className="text-blue-600 hover:text-blue-800"
                  title="Usar cliente"
                >
                  <Check className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleEdit(client)}
                  className="text-gray-600 hover:text-gray-800"
                  title="Editar"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(client.id)}
                  className="text-red-600 hover:text-red-800"
                  title="Eliminar"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                {editingClient ? 'Editar Cliente' : 'Nuevo Cliente'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Nombre
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  NIF/CIF
                </label>
                <input
                  type="text"
                  value={formData.tax_id}
                  onChange={e => setFormData({ ...formData, tax_id: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Dirección
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Contacto
                </label>
                <input
                  type="text"
                  value={formData.contact}
                  onChange={e => setFormData({ ...formData, contact: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                >
                  {editingClient ? 'Guardar Cambios' : 'Crear Cliente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}