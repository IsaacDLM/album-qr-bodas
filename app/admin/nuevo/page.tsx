'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase'; // Ajusta la ruta si es necesario

export default function NuevoEvento() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    couple_name_1: '',
    couple_name_2: '',
    event_date: '',
    welcome_message: '¡Gracias por acompañarnos! Sube aquí tus mejores fotos.',
  });

  // Generador de Token aleatorio de 10 caracteres (Ej: 7K9XQ2M8P4)
  const generateToken = () => {
    return Math.random().toString(36).substring(2, 12).toUpperCase();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const token = generateToken();
    
    // Calculamos la fecha de expiración sumando 30 días a la fecha actual
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const { error } = await supabase.from('events').insert({
      public_token: token,
      couple_name_1: formData.couple_name_1,
      couple_name_2: formData.couple_name_2,
      event_date: formData.event_date,
      welcome_message: formData.welcome_message,
      expires_at: expiresAt.toISOString(),
      status: 'active'
    });

    setLoading(false);

    if (error) {
      alert('Hubo un error al crear el evento');
      console.error(error);
    } else {
      router.push('/admin'); // Volvemos al panel principal
      router.refresh(); // Refrescamos los datos de la tabla
    }
  };

  return (
    <main className="p-8 font-sans max-w-2xl mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Crear Nuevo Evento</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre 1</label>
            <input 
              required
              type="text" 
              className="w-full border rounded-md p-2"
              onChange={e => setFormData({...formData, couple_name_1: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre 2</label>
            <input 
              required
              type="text" 
              className="w-full border rounded-md p-2"
              onChange={e => setFormData({...formData, couple_name_2: e.target.value})}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de la boda</label>
          <input 
            required
            type="date" 
            className="w-full border rounded-md p-2"
            onChange={e => setFormData({...formData, event_date: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje de bienvenida</label>
          <textarea 
            required
            rows={3}
            className="w-full border rounded-md p-2"
            value={formData.welcome_message}
            onChange={e => setFormData({...formData, welcome_message: e.target.value})}
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button 
            type="button" 
            onClick={() => router.push('/admin')}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800 disabled:bg-gray-400"
          >
            {loading ? 'Creando...' : 'Guardar Evento'}
          </button>
        </div>
      </form>
    </main>
  );
}