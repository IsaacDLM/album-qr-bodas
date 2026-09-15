import Gallery from '../../components/Gallery';
import UploadButton from '../../components/UploadButton';
import { supabase } from '../../../lib/supabase';
import { notFound } from 'next/navigation';

export default async function PaginaEvento({ params }: { params: { token: string } }) {

  const { token } = await params;

  const { data: evento, error } = await supabase
    .from('events')
    .select('*')
    .eq('public_token', token)
    .eq('status', 'active')
    .single();

  if (error || !evento) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-3xl font-serif text-gray-800 mb-2">
        {evento.couple_name_1} & {evento.couple_name_2}
      </h1>
      <p className="text-gray-500 mb-6">
        {new Date(evento.event_date).toLocaleDateString()}
      </p>
      
      <div className="bg-white p-6 rounded-xl shadow-sm max-w-md w-full mb-8">
        <p className="text-gray-700 italic">"{evento.welcome_message}"</p>
      </div>
      
      <UploadButton eventId={evento.id} />
      <Gallery eventId={evento.id}/>
    </main>
  );
}