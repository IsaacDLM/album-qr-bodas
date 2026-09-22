'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';

type Photo = {
  id: string;
  storage_path_original: string;
  url: string;
};

export default function AdminGallery({ initialPhotos }: { initialPhotos: Photo[] }) {
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
  const router = useRouter();

  const handleDelete = async (id: string, storagePath: string) => {
    const confirmDelete = window.confirm('¿Seguro que quieres eliminar esta foto del álbum?');
    if (!confirmDelete) return;

    // 1. Borramos el archivo físico del Storage (requiere un array de rutas)
    const { error: storageError } = await supabase.storage
      .from('bodas')
      .remove([storagePath]);

    if (storageError) {
      alert('Error al borrar el archivo físico');
      return;
    }

    // 2. Borramos el registro de PostgreSQL
    const { error: dbError } = await supabase
      .from('photos')
      .delete()
      .eq('id', id);

    if (dbError) {
      alert('Error al borrar el registro en la base de datos');
    } else {
      // 3. Actualizamos la vista quitando la foto borrada sin recargar toda la página
      setPhotos(photos.filter(photo => photo.id !== id));
      router.refresh();
    }
  };

  if (photos.length === 0) {
    return <p className="text-gray-500 mt-8">No hay fotos en este evento.</p>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mt-6">
      {photos.map((photo) => (
        <div key={photo.id} className="relative group aspect-square bg-gray-200 rounded-lg overflow-hidden border">
          <img 
            src={photo.url} 
            alt="Foto subida" 
            className="object-cover w-full h-full"
          />
          {/* Botón de borrado que aparece al pasar el ratón o tocar */}
          <button 
            onClick={() => handleDelete(photo.id, photo.storage_path_original)}
            className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-90 hover:bg-red-700 hover:scale-105 transition-all shadow-md"
            title="Eliminar foto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}