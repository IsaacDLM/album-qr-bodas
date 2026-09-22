import { supabase } from '../../../../lib/supabase';
import AdminGallery from '../../../components/AdminGallery';
import Link from 'next/link';

export default async function GestionarEvento({ params }: { params: { eventId: string } }) {
  const { eventId } = await params;

  // Obtenemos los detalles del evento
  const { data: evento } = await supabase
    .from('events')
    .select('couple_name_1, couple_name_2')
    .eq('id', eventId)
    .single();

  // Obtenemos todas las fotos
  const { data: photos } = await supabase
    .from('photos')
    .select('*')
    .eq('event_id', eventId)
    .order('created_at', { ascending: false });

  // Preparamos las URLs públicas
  const photosWithUrls = (photos || []).map(photo => {
    const { data } = supabase.storage.from('bodas').getPublicUrl(photo.storage_path_original);
    return { ...photo, url: data.publicUrl };
  });

  return (
    <main className="p-8 font-sans max-w-6xl mx-auto bg-gray-50 min-h-screen">
      <div className="mb-6 flex justify-between items-center border-b pb-4">
        <div>
          <Link href="/admin" className="text-sm text-gray-500 hover:text-black mb-2 inline-block">
            ← Volver al panel
          </Link>
          <h1 className="text-2xl font-bold text-gray-800">
            Gestionar: {evento?.couple_name_1} y {evento?.couple_name_2}
          </h1>
        </div>
      </div>
      
      <AdminGallery initialPhotos={photosWithUrls} />
    </main>
  );
}