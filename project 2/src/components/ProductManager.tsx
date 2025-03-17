import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Product } from '../lib/supabase';
import { Plus, Edit2, Trash2, X, Package, Check } from 'lucide-react';

interface ProductManagerProps {
  onSelectProduct: (product: Product) => void;
}

export default function ProductManager({ onSelectProduct }: ProductManagerProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: ''
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('category', { ascending: true })
      .order('name', { ascending: true });
    
    if (error) {
      console.error('Error loading products:', error);
      return;
    }

    setProducts(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        alert('Por favor, inicie sesión para continuar.');
        return;
      }

      const productData = {
        ...formData,
        price: parseFloat(formData.price)
      };

      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);

        if (error) throw error;

        setProducts(products.map(p => 
          p.id === editingProduct.id ? { ...p, ...productData } : p
        ));
      } else {
        const { data, error } = await supabase
          .from('products')
          .insert([{ ...productData, user_id: session.user.id }])
          .select();

        if (error) throw error;
        if (data) {
          setProducts([...products, data[0]]);
          onSelectProduct(data[0]);
        }
      }

      setIsModalOpen(false);
      setEditingProduct(null);
      setFormData({ name: '', description: '', price: '', category: '' });
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error al guardar el producto. Por favor, inténtelo de nuevo.');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      category: product.category || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setProducts(products.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error al eliminar el producto. Por favor, inténtelo de nuevo.');
    }
  };

  // Group products by category
  const groupedProducts = products.reduce((acc, product) => {
    const category = product.category || 'Sin categoría';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold flex items-center">
          <Package className="w-5 h-5 mr-2" />
          Productos y Servicios
        </h2>
        <button
          onClick={() => {
            setEditingProduct(null);
            setFormData({ name: '', description: '', price: '', category: '' });
            setIsModalOpen(true);
          }}
          className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-1" />
          Nuevo Producto
        </button>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedProducts).map(([category, categoryProducts]) => (
          <div key={category}>
            <h3 className="text-sm font-medium text-gray-500 mb-2">{category}</h3>
            <div className="grid gap-4">
              {categoryProducts.map(product => (
                <div
                  key={product.id}
                  className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-blue-300 transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{product.name}</h3>
                      <p className="text-sm text-gray-500">{product.description}</p>
                      <p className="text-sm font-medium text-gray-900 mt-1">
                        {product.price.toFixed(2)} €
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onSelectProduct(product)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Usar producto"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-gray-600 hover:text-gray-800"
                        title="Editar"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
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
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
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
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Precio (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={e => setFormData({ ...formData, price: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Categoría
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Ej: Servicios, Productos, Consultoría..."
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
                  {editingProduct ? 'Guardar Cambios' : 'Crear Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}