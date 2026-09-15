import { supabase } from '../lib/supabase';

export default async function Home() {
  // Obtenemos los eventos activos
  const { data: events, error } = await supabase
    .from('events')
    .select('*')
    .eq('status', 'active');

  if (error) {
    console.error('Error obteniendo eventos:', error);
    return <div>Error al cargar los eventos</div>;
  }

  return (
    <main className="p-8 font-sans">
      <h1 className="text-2xl font-bold mb-4">Álbum QR para Bodas</h1>
      {events?.map((evento) => (
        <div key={evento.id} className="p-6 border rounded-lg shadow-sm bg-white">
          <h2 className="text-xl font-semibold">Boda de {evento.couple_name_1} y {evento.couple_name_2}</h2>
          <p className="text-gray-600 mt-2">Fecha: {new Date(evento.event_date).toLocaleDateString()}</p>
          <p className="text-gray-600">Mensaje: {evento.welcome_message}</p>
          <p className="mt-4 text-sm font-mono bg-gray-100 p-2 rounded inline-block">Token: {evento.public_token}</p>
        </div>
      ))}
    </main>
  );
}