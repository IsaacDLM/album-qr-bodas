import { supabase } from '../../lib/supabase';

export default async function AdminDashboard() {
  // Obtenemos todos los eventos ordenados por fecha de creación
  const { data: events, error } = await supabase
    .from('events')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return <div className="p-8 text-red-500">Error cargando el panel de control.</div>;
  }

  return (
    <main className="p-8 font-sans max-w-6xl mx-auto bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Panel de Administración</h1>
        <button className="bg-black text-white px-5 py-2 rounded-md hover:bg-gray-800 transition-colors">
          + Nuevo Evento
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b text-gray-600 text-sm uppercase tracking-wider">
              <th className="p-4 font-semibold">Novios</th>
              <th className="p-4 font-semibold">Fecha del Evento</th>
              <th className="p-4 font-semibold">Estado</th>
              <th className="p-4 font-semibold">Token / Enlace</th>
              <th className="p-4 font-semibold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {events?.map((evento) => (
              <tr key={evento.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-medium text-gray-800">
                  {evento.couple_name_1} & {evento.couple_name_2}
                </td>
                <td className="p-4 text-gray-600">
                  {new Date(evento.event_date).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    evento.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {evento.status === 'active' ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="p-4 font-mono text-sm text-gray-500">
                  {evento.public_token}
                </td>
                <td className="p-4 text-right space-x-3">
                  <a 
                    href={`/e/${evento.public_token}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-900 text-sm"
                  >
                    Ver Álbum
                  </a>
                  <button className="text-gray-400 hover:text-gray-700 text-sm">
                    Gestionar
                  </button>
                </td>
              </tr>
            ))}
            
            {events?.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  No hay eventos creados todavía.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}