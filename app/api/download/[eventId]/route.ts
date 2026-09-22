import { NextResponse } from 'next/server';
import { supabase } from '../../../../lib/supabase'; // Ajusta los niveles de carpetas según necesites
import JSZip from 'jszip';

export async function GET(
  request: Request,
  { params }: { params: { eventId: string } }
) {
  const { eventId } = await params;

  try {
    // 1. Pedir a la base de datos la lista de rutas de todas las fotos de este evento
    const { data: photos, error: dbError } = await supabase
      .from('photos')
      .select('storage_path_original')
      .eq('event_id', eventId);

    if (dbError || !photos || photos.length === 0) {
      return new NextResponse('No hay fotos para descargar en este evento.', { status: 404 });
    }

    const zip = new JSZip();

    // 2. Descargar cada archivo de Supabase Storage y añadirlo al ZIP en memoria
    const downloadPromises = photos.map(async (photo, index) => {
      const { data, error } = await supabase.storage
        .from('bodas')
        .download(photo.storage_path_original);

      if (data && !error) {
        // Extraemos la extensión original (ej. jpg, png)
        const ext = photo.storage_path_original.split('.').pop() || 'jpg';
        const arrayBuffer = await data.arrayBuffer();
        
        // Nombramos los archivos secuencialmente: foto-1.jpg, foto-2.png...
        zip.file(`foto-${index + 1}.${ext}`, arrayBuffer);
      }
    });

    // Esperamos a que todas las descargas terminen
    await Promise.all(downloadPromises);

    // 3. Generar el archivo ZIP final en formato nativo de servidor
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });

    // 4. Enviar el archivo forzando la descarga en el navegador
    // Usamos "as any" para calmar la validación estricta de TypeScript
    return new NextResponse(zipBuffer as any, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="album-boda.zip"`,
      },
    });

  } catch (error) {
    console.error('Error generando ZIP:', error);
    return new NextResponse('Error interno al generar el archivo', { status: 500 });
  }
}