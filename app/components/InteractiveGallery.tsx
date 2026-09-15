'use client';

import { useState } from 'react';

// Definimos el tipo de dato básico de las fotos que recibiremos
type Photo = {
  id: string;
  storage_path_original: string;
  url?: string; // URL pública que inyectaremos
};

export default function InteractiveGallery({ photos }: { photos: Photo[] }) {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  return (
    <>
      {/* Cuadrícula de fotos */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-1 w-full max-w-4xl mt-12 px-2">
        {photos.map((photo) => (
          <div 
            key={photo.id} 
            className="aspect-square relative overflow-hidden bg-gray-200 cursor-pointer"
            onClick={() => setSelectedPhoto(photo.url!)}
          >
            <img 
              src={photo.url} 
              alt="Recuerdo de la boda" 
              loading="lazy" 
              className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}
      </div>

      {/* Modal / Vista Ampliada */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-4xl w-full max-h-[90vh] flex justify-center">
            <button 
              className="absolute -top-10 right-0 text-white text-3xl font-bold hover:text-gray-300"
              onClick={() => setSelectedPhoto(null)}
            >
              &times;
            </button>
            <img 
              src={selectedPhoto} 
              alt="Vista ampliada" 
              className="max-w-full max-h-[85vh] object-contain rounded-md"
            />
          </div>
        </div>
      )}
    </>
  );
}