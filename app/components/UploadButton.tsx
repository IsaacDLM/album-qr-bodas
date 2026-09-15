'use client';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { supabase } from '../../lib/supabase'; // Ajusta la ruta si es necesario

export default function UploadButton({ eventId }: { eventId: string }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const router = useRouter();
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const files = Array.from(e.target.files);
    setUploading(true);

    for (const file of files) {
      // Generamos un nombre único usando la fecha y un número aleatorio
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${eventId}/${fileName}`;

      // 1. Subir el archivo físico al bucket 'bodas'
      const { error: uploadError } = await supabase.storage
        .from('bodas')
        .upload(filePath, file);

      if (!uploadError) {
        // 2. Registrar los metadatos de la foto en la base de datos
        await supabase.from('photos').insert({
          event_id: eventId,
          storage_path_original: filePath,
          mime_type: file.type,
          file_size: file.size
        });
      }
    }

    setUploading(false);
    // Limpiamos el input para que permita volver a seleccionar las mismas fotos si se desea
    if (fileInputRef.current) fileInputRef.current.value = ''; 
    alert('¡Fotos subidas con éxito!');
    router.refresh();
  };

  return (
    <>
      <input 
        type="file" 
        accept="image/*" 
        multiple 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileChange}
      />
      <button 
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400"
      >
        {uploading ? 'Subiendo...' : 'Subir fotos'}
      </button>
    </>
  );
}