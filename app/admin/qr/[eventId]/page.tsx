'use client';

import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { supabase } from '../../../../lib/supabase';
import Link from 'next/link';
import { use } from 'react';

export default function VistaQR({ params }: { params: Promise<{ eventId: string }> }) {
  const resolvedParams = use(params);
  const [evento, setEvento] = useState<any>(null);
  const [urlDestino, setUrlDestino] = useState('');

  useEffect(() => {
    async function cargarEvento() {
      const { data } = await supabase
        .from('events')
        .select('*')
        .eq('id', resolvedParams.eventId)
        .single();
      
      if (data) {
        setEvento(data);
        // Construimos la URL completa dinámica basada en dónde estemos (localhost o Vercel)
        setUrlDestino(`${window.location.origin}/e/${data.public_token}`);
      }
    }
    cargarEvento();
  }, [resolvedParams.eventId]);

  if (!evento) return <div className="p-8 text-center text-gray-500">Cargando código QR...</div>;

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center font-sans p-8">
      {/* Botones de control (Se ocultan al imprimir gracias a print:hidden) */}
      <div className="absolute top-8 left-8 print:hidden flex space-x-4">
        <Link href="/admin" className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
          ← Volver
        </Link>
        <button 
          onClick={() => window.print()}
          className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 shadow-md"
        >
          Imprimir QR
        </button>
      </div>

      {/* Zona imprimible */}
      <div className="text-center max-w-lg">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 font-serif">
          {evento.couple_name_1} & {evento.couple_name_2}
        </h1>
        <p className="text-xl text-gray-600 mb-10">
          {new Date(evento.event_date).toLocaleDateString()}
        </p>

        <div className="bg-white p-6 rounded-2xl shadow-sm border-2 border-gray-100 inline-block mb-8">
          <QRCodeSVG 
            value={urlDestino} 
            size={300}
            level="H" // Alta corrección de errores para que se lea aunque se ensucie un poco
            includeMargin={true}
          />
        </div>

        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          ¡Ayúdanos a capturar este día!
        </h2>
        <p className="text-gray-600">
          Escanea el código con la cámara de tu móvil para subir tus fotos y ver la galería compartida. No necesitas instalar nada.
        </p>
      </div>
    </main>
  );
}