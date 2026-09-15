import { supabase } from '../../lib/supabase';
import InteractiveGallery from './InteractiveGallery';

export default async function Gallery({ eventId }: { eventId: string }) {
  // 1. Obtenemos las fotografías ordenadas por la más reciente
  const { data: photos, error } = await supabase
    .from('photos')
    .select('*')
    .eq('event_id', eventId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Detalle del error en la galería:', error);
    return <p className="text-red-500 mt-8">Error al cargar la galería.</p>;
  }
  
  if (!photos || photos.length === 0) {
    return <p className="text-gray-500 mt-8 text-center">Aún no hay fotos. ¡Sé el primero en participar!</p>;
  }

  // 2. Mapeamos el array para inyectarle a cada foto su URL pública de Storage
  const photosWithUrls = photos.map((photo) => {
    const { data } = supabase.storage.from('bodas').getPublicUrl(photo.storage_path_original);
    return {
      ...photo,
      url: data.publicUrl
    };
  });

  // 3. Pasamos los datos listos al componente de cliente
  return <InteractiveGallery photos={photosWithUrls} />;
}